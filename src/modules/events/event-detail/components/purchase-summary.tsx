/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ShoppingCart, CreditCard, AlertCircle, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Separator } from "@/modules/shared/components/ui/separator";
import { Button } from "@/modules/shared/components/ui/button";
import { Badge } from "@/modules/shared/components/ui/badge";
import { useState, useMemo } from "react";
import { cn } from "@/modules/shared/lib/utils";
import { useUser } from "@clerk/nextjs";
import { EventDetailType } from "../services/event-detail-services";

interface PurchaseSummaryProps {
  event: EventDetailType;
  selectedTickets: Record<string, number>;
  onTicketsChange: (tickets: Record<string, number>) => void;
}

interface BuyerInfo {
  email: string;
  fullName: string;
  dni?: string;
}

export function PurchaseSummary({
  event,
  selectedTickets,
}: PurchaseSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    email: "",
    fullName: "",
    dni: "",
  });

  const { user, isSignedIn } = useUser();

  // Obtener la etapa activa y sus tipos de tickets
  const { activeStage, ticketTypes } = useMemo(() => {
    const activeStage = event.stages.find((stage) => stage.isActive);
    const ticketTypes = activeStage?.ticketTypes || [];
    return { activeStage, ticketTypes };
  }, [event.stages]);

  // Función para calcular precio con descuentos
  const getDiscountedPrice = (ticket: (typeof ticketTypes)[0]) => {
    if (!ticket.discountType || !ticket.discountValue) return ticket.price;

    if (ticket.discountType === "PERCENTAGE") {
      return ticket.price * (1 - ticket.discountValue / 100);
    } else if (ticket.discountType === "FIXED") {
      return Math.max(0, ticket.price - ticket.discountValue);
    }

    return ticket.price;
  };

  // Calcular totales usando los datos reales del evento
  const { subtotal, totalTickets, ticketDetails } = useMemo(() => {
    let subtotal = 0;
    let totalTickets = 0;
    const ticketDetails: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      originalPrice: number;
      subtotal: number;
      hasDiscount: boolean;
    }> = [];

    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      if (quantity <= 0) return;

      const ticket = ticketTypes.find((t) => t.id === ticketId);
      if (!ticket) return;

      const originalPrice = ticket.price;
      const discountedPrice = getDiscountedPrice(ticket);
      const ticketSubtotal = discountedPrice * quantity;
      const hasDiscount = discountedPrice !== originalPrice;

      subtotal += ticketSubtotal;
      totalTickets += quantity;

      ticketDetails.push({
        id: ticket.id,
        name: ticket.name,
        quantity,
        unitPrice: discountedPrice,
        originalPrice,
        subtotal: ticketSubtotal,
        hasDiscount,
      });
    });

    return { subtotal, totalTickets, ticketDetails };
  }, [selectedTickets, ticketTypes]);

  const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
  const total = subtotal + serviceFee;
  const hasTickets = totalTickets > 0;

  const handleProceedToPay = async () => {
    if (!hasTickets) return;

    // Si no está autenticado, mostrar formulario de comprador
    if (!isSignedIn && !showBuyerForm) {
      setShowBuyerForm(true);
      return;
    }

    // Validar datos del comprador no registrado
    if (!isSignedIn && (!buyerInfo.email || !buyerInfo.fullName)) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    setIsProcessing(true);

    try {
      // Preparar los tickets para la API usando IDs reales
      const tickets = Object.entries(selectedTickets)
        .filter(([_, count]) => count > 0)
        .map(([ticketId, count]) => ({
          ticketTypeId: ticketId, // Usar el ID real del ticket type
          quantity: count,
        }));

      const requestBody = {
        eventId: event.id,
        tickets,
        ...(!isSignedIn && { buyer: buyerInfo }),
      };

      console.log("Creating purchase:", requestBody);

      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar la compra");
      }

      const data = await response.json();
      console.log("Purchase created:", data);

      // Redirigir a MercadoPago
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No se recibió URL de pago");
      }
    } catch (error) {
      console.error("Payment process failed:", error);
      alert(
        error instanceof Error ? error.message : "Error al procesar el pago"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Entradas disponibles",
          className: "bg-green-500/15 text-green-600 border-green-500/20",
        };
      case "ANNOUNCED":
        return {
          label: "Próximamente",
          className: "bg-primary/15 text-primary border-primary/20",
        };
      case "CANCELLED":
        return {
          label: "Evento cancelado",
          className: "bg-destructive/15 text-destructive border-destructive/20",
        };
      default:
        return {
          label: "Estado desconocido",
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo(event.status);

  // Si no hay etapa activa, mostrar mensaje
  if (!activeStage) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ShoppingCart className="w-5 h-5" />
            Resumen de compra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Las entradas para este evento aún no están disponibles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ShoppingCart className="w-5 h-5" />
          Resumen de compra
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {event.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startDatetime).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {event.venue ? event.venue.name : event.locationName},{" "}
            {event.venue ? event.venue.city : event.locationCity}
          </p>
        </div>

        <Separator className="bg-border/50" />

        {/* User Info */}
        {isSignedIn ? (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">
              Comprando como:{" "}
              {user?.fullName || user?.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        ) : showBuyerForm ? (
          <div className="space-y-3 p-3 bg-muted/20 rounded-md border border-border/50">
            <h4 className="font-medium text-foreground">Datos del comprador</h4>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email *"
                value={buyerInfo.email}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                required
              />
              <input
                type="text"
                placeholder="Nombre completo *"
                value={buyerInfo.fullName}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                required
              />
              <input
                type="text"
                placeholder="DNI (opcional)"
                value={buyerInfo.dni}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, dni: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Los campos marcados con * son obligatorios
            </p>
          </div>
        ) : null}

        {/* Ticket Summary */}
        {hasTickets ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {ticketDetails.map((detail) => (
                <div
                  key={detail.id}
                  className="flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{detail.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{detail.quantity} ×</span>
                      {detail.hasDiscount && (
                        <span className="line-through">
                          ${detail.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span
                        className={
                          detail.hasDiscount ? "text-primary font-medium" : ""
                        }
                      >
                        ${detail.unitPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">
                    ${detail.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="bg-border/50" />

            {/* Pricing Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-foreground">
                <span>
                  Subtotal ({totalTickets} entrada{totalTickets > 1 ? "s" : ""})
                </span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cargo por servicio (10%)</span>
                <span>${serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toLocaleString()}</span>
            </div>

            {/* Action Button */}
            {event.status === "ACTIVE" ? (
              <>
                {!isSignedIn && !showBuyerForm ? (
                  <Button
                    className="w-full btn-gradient"
                    size="lg"
                    onClick={handleProceedToPay}
                    disabled={isProcessing}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Continuar como invitado
                  </Button>
                ) : (
                  <Button
                    className="w-full btn-gradient"
                    size="lg"
                    onClick={handleProceedToPay}
                    disabled={
                      isProcessing ||
                      (!isSignedIn && (!buyerInfo.email || !buyerInfo.fullName))
                    }
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessing ? "Procesando..." : "Proceder al pago"}
                  </Button>
                )}
              </>
            ) : (
              <Button className="w-full" size="lg" disabled variant="secondary">
                <AlertCircle className="w-4 h-4 mr-2" />
                No disponible
              </Button>
            )}

            <div className="text-xs text-muted-foreground text-center">
              Serás redirigido a MercadoPago para completar el pago
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Selecciona tus entradas para ver el resumen
            </p>
          </div>
        )}

        {/* Event Status */}
        <div className="pt-4">
          <Badge
            className={cn(
              "w-full justify-center font-medium",
              statusInfo.className
            )}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
