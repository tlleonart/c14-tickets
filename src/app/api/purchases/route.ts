import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/modules/shared/lib/prisma";

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

interface TicketItem {
  ticketTypeId: string;
  quantity: number;
}

interface PurchaseRequestBody {
  eventId: string;
  tickets: TicketItem[];
  buyer?: {
    email: string;
    fullName: string;
    dni?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: PurchaseRequestBody = await req.json();
    const { eventId, tickets, buyer } = body;

    // Obtener usuario autenticado (opcional)
    const { userId } = await auth();

    // Validar que el evento existe y está activo
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        stages: {
          where: { isActive: true },
          include: {
            ticketTypes: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    if (event.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Evento no disponible para compra" },
        { status: 400 }
      );
    }

    // Verificar disponibilidad y calcular precios
    let totalPrice = 0;
    const ticketDetails: Array<{
      ticketTypeId: string;
      quantity: number;
      unitPrice: number;
      name: string;
      subtotal: number;
    }> = [];

    for (const ticketItem of tickets) {
      const ticketType = event.stages
        .flatMap((stage) => stage.ticketTypes)
        .find((tt) => tt.id === ticketItem.ticketTypeId);

      if (!ticketType) {
        return NextResponse.json(
          { error: `Tipo de ticket no encontrado: ${ticketItem.ticketTypeId}` },
          { status: 400 }
        );
      }

      // Verificar disponibilidad
      const soldTickets = await prisma.ticket.count({
        where: {
          ticketTypeId: ticketType.id,
          ticketPurchase: {
            paymentStatus: "PAID",
          },
        },
      });

      const available = ticketType.capacity - soldTickets;
      if (available < ticketItem.quantity) {
        return NextResponse.json(
          {
            error: `No hay suficientes tickets disponibles para ${ticketType.name}`,
          },
          { status: 400 }
        );
      }

      // Calcular precio con descuentos
      let unitPrice = ticketType.price;
      if (ticketType.discountType && ticketType.discountValue) {
        if (ticketType.discountType === "PERCENTAGE") {
          unitPrice = ticketType.price * (1 - ticketType.discountValue / 100);
        } else if (ticketType.discountType === "FIXED") {
          unitPrice = Math.max(0, ticketType.price - ticketType.discountValue);
        }
      }

      const subtotal = unitPrice * ticketItem.quantity;
      totalPrice += subtotal;

      ticketDetails.push({
        ticketTypeId: ticketType.id,
        quantity: ticketItem.quantity,
        unitPrice,
        name: ticketType.name,
        subtotal,
      });
    }

    // Agregar fee de servicio (10%)
    const serviceFee = Math.round(totalPrice * 0.1);
    const finalTotalPrice = totalPrice + serviceFee;

    // Crear comprador no registrado si es necesario
    let unregisteredBuyerId: string | undefined;
    if (!userId && buyer) {
      const unregisteredBuyer = await prisma.unregisteredBuyer.create({
        data: {
          email: buyer.email,
          fullName: buyer.fullName,
          dni: buyer.dni,
        },
      });
      unregisteredBuyerId = unregisteredBuyer.id;
    }

    // Crear la compra en estado PENDING
    const purchase = await prisma.ticketPurchase.create({
      data: {
        userId: userId || undefined,
        unregisteredBuyerId,
        eventId,
        paymentStatus: "PENDING",
        paymentProvider: "MERCADO_PAGO",
        totalPrice: finalTotalPrice,
        externalReference: `carbono-${Date.now()}`, // Referencia única
      },
    });

    // Preparar items para MercadoPago
    const items = ticketDetails.map((detail) => ({
      id: detail.ticketTypeId,
      title: `${event.name} - ${detail.name}`,
      quantity: detail.quantity,
      unit_price: detail.unitPrice,
      description: `Entrada para ${event.name}`,
    }));

    // Agregar fee de servicio como item separado
    if (serviceFee > 0) {
      items.push({
        id: "service-fee",
        title: "Cargo por servicio",
        quantity: 1,
        unit_price: serviceFee,
        description: "Cargo por procesamiento del pago",
      });
    }

    // Verificar que tengamos la URL base
    const appUrl = "https://https://tickets.carbono-14.net/";
    if (!appUrl) {
      console.error(
        "[CREATE_PURCHASE_ERROR] NEXT_PUBLIC_APP_URL not configured"
      );
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    // Crear preferencia de MercadoPago
    const preference = await new Preference(client).create({
      body: {
        items,
        metadata: {
          purchaseId: purchase.id,
          eventId,
          userId: userId || null,
          unregisteredBuyerId: unregisteredBuyerId || null,
        },
        back_urls: {
          success: `${appUrl}/payment/success?purchase_id=${purchase.id}`,
          failure: `${appUrl}/payment/failure?purchase_id=${purchase.id}`,
          pending: `${appUrl}/payment/pending?purchase_id=${purchase.id}`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        external_reference: purchase.externalReference ?? "",
      },
    });

    // Actualizar la compra con el ID de MercadoPago
    await prisma.ticketPurchase.update({
      where: { id: purchase.id },
      data: {
        mercadoPagoId: preference.id,
      },
    });

    return NextResponse.json({
      purchase: {
        id: purchase.id,
        eventId,
        totalPrice: finalTotalPrice,
        paymentStatus: "PENDING",
        tickets: ticketDetails,
      },
      paymentUrl: preference.init_point,
    });
  } catch (error) {
    console.error("[CREATE_PURCHASE_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const purchaseId = searchParams.get("purchase_id");

    if (!purchaseId) {
      return NextResponse.json(
        { error: "ID de compra requerido" },
        { status: 400 }
      );
    }

    const purchase = await prisma.ticketPurchase.findUnique({
      where: { id: purchaseId },
      include: {
        event: {
          select: {
            name: true,
            startDatetime: true,
            locationName: true,
            locationCity: true,
          },
        },
        tickets: {
          include: {
            ticketType: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        unregisteredBuyer: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Compra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("[GET_PURCHASE_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
