"use client";

import { Minus, Plus, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";

// TODO: This will come from API/props in the future
const ticketTypes = [
  {
    id: "general",
    name: "Entrada General",
    price: 15000,
    description: "Acceso general al evento",
    available: 150,
    maxPerPerson: 6,
    discountType: null,
    discountValue: null,
  },
  {
    id: "vip",
    name: "Entrada VIP",
    price: 35000,
    description: "Acceso VIP con beneficios exclusivos",
    available: 25,
    maxPerPerson: 4,
    discountType: "PERCENTAGE",
    discountValue: 10, // 10% off
  },
  {
    id: "premium",
    name: "Entrada Premium",
    price: 55000,
    description: "Experiencia premium con meet & greet",
    available: 10,
    maxPerPerson: 2,
    discountType: null,
    discountValue: null,
  },
];

interface TicketSelectorProps {
  selectedTickets: Record<string, number>;
  onTicketsChange: (tickets: Record<string, number>) => void;
  eventId: string;
}

export function TicketSelector({
  selectedTickets,
  onTicketsChange,
}: TicketSelectorProps) {
  const updateTicketCount = (ticketId: string, change: number) => {
    const current = selectedTickets[ticketId] || 0;
    const newCount = Math.max(0, current + change);
    const ticket = ticketTypes.find((t) => t.id === ticketId);

    if (!ticket) return;

    const maxCount = Math.min(ticket.available, ticket.maxPerPerson);
    const finalCount = Math.min(newCount, maxCount);

    onTicketsChange({
      ...selectedTickets,
      [ticketId]: finalCount,
    });
  };

  const getDiscountedPrice = (ticket: (typeof ticketTypes)[0]) => {
    if (!ticket.discountType || !ticket.discountValue) return ticket.price;

    if (ticket.discountType === "PERCENTAGE") {
      return ticket.price * (1 - ticket.discountValue / 100);
    } else if (ticket.discountType === "FIXED") {
      return Math.max(0, ticket.price - ticket.discountValue);
    }

    return ticket.price;
  };

  const hasDiscount = (ticket: (typeof ticketTypes)[0]) => {
    return ticket.discountType && ticket.discountValue;
  };

  if (ticketTypes.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No hay entradas disponibles
          </h3>
          <p className="text-muted-foreground">
            Las entradas para este evento aún no están a la venta.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ticketTypes.map((ticket) => {
        const discountedPrice = getDiscountedPrice(ticket);
        const currentSelected = selectedTickets[ticket.id] || 0;
        const maxAvailable = Math.min(ticket.available, ticket.maxPerPerson);
        const isMaxSelected = currentSelected >= maxAvailable;
        const isUnavailable = ticket.available === 0;

        return (
          <Card
            key={ticket.id}
            className={cn(
              "border-border/50 transition-all duration-200",
              isUnavailable && "opacity-50",
              currentSelected > 0 && "ring-1 ring-primary/50"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    {ticket.name}
                    {hasDiscount(ticket) && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        -{ticket.discountValue}%
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {hasDiscount(ticket) && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${ticket.price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      ${discountedPrice.toLocaleString()}
                    </span>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 border-border/50",
                      isUnavailable
                        ? "text-destructive border-destructive/20"
                        : "text-muted-foreground"
                    )}
                  >
                    {isUnavailable
                      ? "Agotado"
                      : `${ticket.available} disponibles`}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Máximo {ticket.maxPerPerson} por persona
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTicketCount(ticket.id, -1)}
                    disabled={currentSelected === 0 || isUnavailable}
                    className="w-8 h-8 p-0 border-border/50 hover:bg-muted"
                    aria-label={`Reducir cantidad de ${ticket.name}`}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="w-8 text-center font-semibold text-foreground">
                    {currentSelected}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTicketCount(ticket.id, 1)}
                    disabled={isMaxSelected || isUnavailable}
                    className="w-8 h-8 p-0 border-border/50 hover:bg-muted"
                    aria-label={`Aumentar cantidad de ${ticket.name}`}
                  >
                    <Plus className="w-4 w-4" />
                  </Button>
                </div>
              </div>

              {currentSelected > 0 && (
                <div className="mt-3 p-3 bg-primary/5 rounded-md border border-primary/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {currentSelected} × ${discountedPrice.toLocaleString()}
                    </span>
                    <span className="font-semibold text-foreground">
                      ${(discountedPrice * currentSelected).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Ticket Selection Summary */}
      {Object.values(selectedTickets).some((count) => count > 0) && (
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total de entradas seleccionadas:
            </span>
            <span className="font-semibold">
              {Object.values(selectedTickets).reduce(
                (sum, count) => sum + count,
                0
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
