"use client";

import { ShoppingCart, CreditCard, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Separator } from "@/modules/shared/components/ui/separator";
import { Button } from "@/modules/shared/components/ui/button";
import { Badge } from "@/modules/shared/components/ui/badge";
import { useState } from "react";
import { cn } from "@/modules/shared/lib/utils";

// TODO: This will come from API/props in the future - should match TicketSelector
const ticketPrices = {
  general: {
    price: 15000,
    name: "Entrada General",
    discountType: null,
    discountValue: null,
  },
  vip: {
    price: 35000,
    name: "Entrada VIP",
    discountType: "PERCENTAGE",
    discountValue: 10,
  },
  premium: {
    price: 55000,
    name: "Entrada Premium",
    discountType: null,
    discountValue: null,
  },
};

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: string;
}

interface PurchaseSummaryProps {
  event: Event;
  selectedTickets: Record<string, number>;
  onTicketsChange: (tickets: Record<string, number>) => void;
}

export function PurchaseSummary({
  event,
  selectedTickets,
}: PurchaseSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const getDiscountedPrice = (ticketType: keyof typeof ticketPrices) => {
    const ticket = ticketPrices[ticketType];
    if (!ticket.discountType || !ticket.discountValue) return ticket.price;

    if (ticket.discountType === "PERCENTAGE") {
      return ticket.price * (1 - ticket.discountValue / 100);
    } else if (ticket.discountType === "FIXED") {
      return Math.max(0, ticket.price - ticket.discountValue);
    }

    return ticket.price;
  };

  const subtotal = Object.entries(selectedTickets).reduce(
    (total, [type, count]) => {
      const ticketType = type as keyof typeof ticketPrices;
      if (ticketPrices[ticketType] && count > 0) {
        return total + getDiscountedPrice(ticketType) * count;
      }
      return total;
    },
    0
  );

  const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
  const total = subtotal + serviceFee;
  const hasTickets = Object.values(selectedTickets).some((count) => count > 0);
  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleProceedToPay = async () => {
    setIsProcessing(true);

    // TODO: Implement actual payment flow
    try {
      console.log("Processing payment for:", {
        eventId: event.id,
        tickets: selectedTickets,
        total: total,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Redirect to payment gateway or checkout page
      alert(
        "Redirigiendo al proceso de pago... (TODO: Implementar MercadoPago)"
      );
    } catch (error) {
      console.error("Payment process failed:", error);
      // TODO: Show error toast
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
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground">{event.date}</p>
          <p className="text-sm text-muted-foreground">{event.venue}</p>
        </div>

        <Separator className="bg-border/50" />

        {/* Ticket Summary */}
        {hasTickets ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {Object.entries(selectedTickets).map(([type, count]) => {
                if (count === 0) return null;

                const ticketType = type as keyof typeof ticketPrices;
                const ticket = ticketPrices[ticketType];
                if (!ticket) return null;

                const discountedPrice = getDiscountedPrice(ticketType);
                const originalPrice = ticket.price;
                const hasDiscount = discountedPrice !== originalPrice;

                return (
                  <div key={type} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {ticket.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{count} ×</span>
                        {hasDiscount && (
                          <span className="line-through">
                            ${originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={
                            hasDiscount ? "text-primary font-medium" : ""
                          }
                        >
                          ${discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground">
                      ${(discountedPrice * count).toLocaleString()}
                    </p>
                  </div>
                );
              })}
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
              <Button
                className="w-full btn-gradient"
                size="lg"
                onClick={handleProceedToPay}
                disabled={isProcessing}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessing ? "Procesando..." : "Proceder al pago"}
              </Button>
            ) : (
              <Button className="w-full" size="lg" disabled variant="secondary">
                <AlertCircle className="w-4 h-4 mr-2" />
                No disponible
              </Button>
            )}

            <div className="text-xs text-muted-foreground text-center">
              Las entradas se enviarán por email después del pago
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
