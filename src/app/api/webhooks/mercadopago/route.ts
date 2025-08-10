import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/modules/shared/lib/prisma";
// import crypto from "crypto";
import { EmailService } from "@/modules/shared/services/email-services";

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

// Función para generar QR Code único
function generateQRCode(): string {
  return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Función para verificar la autenticidad del webhook (opcional pero recomendado)
/*function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return signature === expectedSignature;
} */

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const data = JSON.parse(body);

    // Verificar autenticidad del webhook (opcional por ahora)
    /*
    if (process.env.MERCADOPAGO_WEBHOOK_SECRET) {
      const signature = req.headers.get("x-signature");
      console.log("[MERCADOPAGO_WEBHOOK] Signature:", signature);
      if (
        !signature ||
        !verifyWebhookSignature(
          body,
          signature,
          process.env.MERCADOPAGO_WEBHOOK_SECRET
        )
      ) {
        console.error("[MERCADOPAGO_WEBHOOK] Invalid signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } else {
      console.log(
        "[MERCADOPAGO_WEBHOOK] No webhook secret configured, skipping signature verification"
      );
    }
*/
    // Solo procesar notificaciones de pago
    if (
      data.type !== "payment" &&
      data.action !== "payment.created" &&
      data.action !== "payment.updated"
    ) {
      return NextResponse.json({ success: true });
    }

    const paymentId = data.data?.id || data.id;

    if (!paymentId) {
      console.error("[MERCADOPAGO_WEBHOOK] Missing payment ID in data:", data);
      return NextResponse.json(
        { error: "Missing payment ID" },
        { status: 400 }
      );
    }

    // Obtener detalles del pago desde MercadoPago
    const payment = await new Payment(client).get({ id: paymentId });

    if (!payment.external_reference) {
      console.error("[MERCADOPAGO_WEBHOOK] Missing external reference");
      return NextResponse.json(
        { error: "Missing external reference" },
        { status: 400 }
      );
    }

    // Buscar la compra en nuestra base de datos
    const purchase = await prisma.ticketPurchase.findFirst({
      where: {
        externalReference: payment.external_reference,
      },
      include: {
        event: true,
        tickets: true,
      },
    });

    if (!purchase) {
      console.error(
        "[MERCADOPAGO_WEBHOOK] Purchase not found:",
        payment.external_reference
      );
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Mapear estados de MercadoPago a nuestros estados
    let paymentStatus: "PENDING" | "PAID" | "REFUNDED";
    switch (payment.status) {
      case "approved":
        paymentStatus = "PAID";
        break;
      case "cancelled":
      case "rejected":
        paymentStatus = "REFUNDED";
        break;
      default:
        paymentStatus = "PENDING";
    }

    // Solo procesar si el estado cambió
    if (purchase.paymentStatus === paymentStatus) {
      return NextResponse.json({ success: true });
    }

    // Actualizar el estado de la compra
    await prisma.ticketPurchase.update({
      where: { id: purchase.id },
      data: {
        paymentStatus,
        mercadoPagoId: payment.id?.toString(),
      },
    });

    // Si el pago fue aprobado y no hay tickets generados, crear los tickets
    if (paymentStatus === "PAID" && purchase.tickets.length === 0) {
      // Obtener los detalles de los tickets desde la estructura de compra
      const ticketTypesData = await getTicketTypesFromPurchase(purchase.id);

      if (ticketTypesData.length === 0) {
        console.error(
          "[MERCADOPAGO_WEBHOOK] No ticket types found for purchase:",
          purchase.id
        );
        return NextResponse.json(
          { success: false, error: "No ticket types found" },
          { status: 400 }
        );
      }

      const ticketsToCreate = [];
      for (const { ticketTypeId, quantity } of ticketTypesData) {
        for (let i = 0; i < quantity; i++) {
          ticketsToCreate.push({
            ticketPurchaseId: purchase.id,
            ticketTypeId,
            qrCode: generateQRCode(),
          });
        }
      }

      await prisma.ticket.createMany({
        data: ticketsToCreate,
      });

      // Enviar email con los tickets
      try {
        await sendTicketEmail(purchase.id);
      } catch (emailError) {
        console.error("[MERCADOPAGO_WEBHOOK] Error sending email:", emailError);
        // No fallar el webhook por problemas de email
      }
    }

    // Si el pago fue cancelado/rechazado, liberar la capacidad (no hay tickets que eliminar porque no se crearon)
    if (paymentStatus === "REFUNDED") {
      console.log(
        "[MERCADOPAGO_WEBHOOK] Payment refunded, capacity automatically freed"
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MERCADOPAGO_WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Función para enviar email con tickets
async function sendTicketEmail(purchaseId: string) {
  const purchase = await prisma.ticketPurchase.findUnique({
    where: { id: purchaseId },
    include: {
      event: true,
      user: true,
      unregisteredBuyer: true,
      tickets: {
        include: {
          ticketType: true,
        },
      },
    },
  });

  if (!purchase) {
    throw new Error("Purchase not found for email");
  }

  // Determinar email y nombre del comprador
  const buyerEmail = purchase.user?.email || purchase.unregisteredBuyer?.email;
  const buyerName =
    purchase.user?.fullName || purchase.unregisteredBuyer?.fullName;

  if (!buyerEmail || !buyerName) {
    throw new Error("Buyer email or name not found");
  }

  // Formatear datos para el email
  const eventDate = new Date(purchase.event.startDatetime);
  const emailData = {
    purchaseId: purchase.id,
    buyerEmail,
    buyerName,
    event: {
      name: purchase.event.name,
      date: eventDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: eventDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: purchase.event.locationName,
      city: purchase.event.locationCity,
    },
    tickets: purchase.tickets.map((ticket) => ({
      id: ticket.id,
      qrCode: ticket.qrCode,
      ticketType: {
        name: ticket.ticketType.name,
        price: ticket.ticketType.price,
      },
    })),
    totalAmount: purchase.totalPrice,
  };

  const emailSent = await EmailService.sendTickets(emailData);

  if (!emailSent) {
    throw new Error("Failed to send email");
  }
}
async function getTicketTypesFromPurchase(purchaseId: string) {
  try {
    // Como no tenemos metadata confiable, vamos a inferir desde el request original
    // Por ahora, para el MVP, vamos a usar una estrategia simple:
    // 1. Buscar el evento y sus ticket types activos
    // 2. Por simplificación, asumir que se compró 1 ticket del primer tipo disponible

    const purchase = await prisma.ticketPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        event: {
          include: {
            stages: {
              where: { isActive: true },
              include: {
                ticketTypes: true,
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      console.error("[MERCADOPAGO_WEBHOOK] Purchase not found:", purchaseId);
      return [];
    }

    const activeStage = purchase.event.stages.find((stage) => stage.isActive);
    if (!activeStage || activeStage.ticketTypes.length === 0) {
      console.error(
        "[MERCADOPAGO_WEBHOOK] No active stage or ticket types found"
      );
      return [];
    }

    // HACK TEMPORAL: Para el MVP, vamos a asumir que se compró 1 ticket del primer tipo
    // En una implementación real, deberíamos guardar esta info en la tabla TicketPurchase
    const firstTicketType = activeStage.ticketTypes[0];

    // Por ahora, asumir 1 ticket
    // Podrías mejorar esto calculando quantity = totalPrice / ticketPrice
    const quantity = Math.round(purchase.totalPrice / firstTicketType.price);

    return [
      {
        ticketTypeId: firstTicketType.id,
        quantity: Math.max(1, quantity), // Mínimo 1 ticket
      },
    ];
  } catch (error) {
    console.error("[MERCADOPAGO_WEBHOOK] Error getting ticket types:", error);
    return [];
  }
}

// Permitir solo POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
