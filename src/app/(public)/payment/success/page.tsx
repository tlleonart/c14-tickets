/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Download, Mail, Calendar } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Separator } from "@/modules/shared/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";

interface PaymentSuccessContentProps {
  searchParams: Promise<{ purchase_id?: string }>;
}

async function PaymentSuccessContent({
  searchParams,
}: PaymentSuccessContentProps) {
  const { purchase_id } = await searchParams;

  if (!purchase_id) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Pago procesado!</h1>
            <p className="text-muted-foreground mb-6">
              Tu pago ha sido procesado correctamente. Recibirás un email con
              los detalles.
            </p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  try {
    // Obtener detalles de la compra
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/purchases?purchase_id=${purchase_id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la información de la compra");
    }

    const { purchase } = await response.json();

    return (
      <div className="min-h-screen pt-16">
        <div className="container-fluid py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Success */}
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">¡Pago exitoso!</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Tu compra ha sido procesada correctamente
                </p>
                <Badge
                  variant="secondary"
                  className="bg-green-500/15 text-green-600"
                >
                  Confirmado
                </Badge>
              </CardContent>
            </Card>

            {/* Purchase Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Detalles del evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {purchase.event.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {new Date(purchase.event.startDatetime).toLocaleDateString(
                      "es-ES",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {purchase.event.locationName}, {purchase.event.locationCity}
                  </p>
                </div>

                <Separator />

                {/* Tickets */}
                <div>
                  <h4 className="font-medium mb-3">Tus entradas</h4>
                  <div className="space-y-2">
                    {purchase.tickets.length > 0 ? (
                      purchase.tickets.map((ticket: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted/20 rounded-md"
                        >
                          <div>
                            <p className="font-medium">
                              {ticket.ticketType.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              #{ticket.qrCode}
                            </p>
                          </div>
                          <Badge variant="outline">Válida</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                        <p className="text-sm text-yellow-600">
                          Tus entradas se están procesando. Las recibirás por
                          email en unos minutos.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h4 className="font-medium mb-3">Resumen del pago</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total pagado</span>
                      <span className="font-semibold">
                        ${purchase.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Estado del pago</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/15 text-green-600"
                      >
                        {purchase.paymentStatus === "PAID"
                          ? "Pagado"
                          : purchase.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>¿Qué sigue?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Recibirás un email</p>
                    <p className="text-sm text-muted-foreground">
                      Te enviaremos tus entradas por email a{" "}
                      {purchase.user?.email ||
                        purchase.unregisteredBuyer?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Guarda tus entradas</p>
                    <p className="text-sm text-muted-foreground">
                      Puedes descargar tus entradas en PDF o guardarlas en tu
                      teléfono
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">El día del evento</p>
                    <p className="text-sm text-muted-foreground">
                      Presenta tu QR code en la entrada para acceder al evento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/">Volver al inicio</Link>
              </Button>
              <Button asChild>
                <Link href="/events">Ver más eventos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading purchase details:", error);

    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Pago procesado!</h1>
            <p className="text-muted-foreground mb-6">
              Tu pago ha sido procesado correctamente. Recibirás un email con
              los detalles.
            </p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase_id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando detalles de tu compra...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
