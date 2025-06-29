"use client";

import Image from "next/image";
import { Calendar, MapPin, Users, Share2, Heart } from "lucide-react";
import { FC, useState } from "react";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Separator } from "@/modules/shared/components/ui/separator";
import { TicketSelector } from "./components/ticket-selector";
import { PurchaseSummary } from "./components/purchase-summary";
import { splitDateHour } from "@/modules/shared/lib/utils";
import { EventDetailType } from "./services/event-detail-services";
import { cn } from "@/modules/shared/lib/utils";

interface EventDetailProps {
  event: EventDetailType;
}

export const EventDetail: FC<EventDetailProps> = ({ event }) => {
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    name,
    coverImageUrl,
    category,
    shortDescription,
    longDescription,
    startDatetime,
    venue,
    locationName,
    locationCity,
    capacity,
    status,
  } = event;

  const { date: eventDate, hour: eventHour } = splitDateHour(startDatetime);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "En venta",
          className: "bg-green-500/15 text-green-600 border-green-500/20",
        };
      case "ANNOUNCED":
        return {
          label: "Próximamente",
          className: "bg-primary/15 text-primary border-primary/20",
        };
      case "CANCELLED":
        return {
          label: "Cancelado",
          className: "bg-destructive/15 text-destructive border-destructive/20",
        };
      default:
        return {
          label: "Info",
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality with backend
  };

  return (
    <div className="min-h-screen">
      <div className="container-fluid py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={coverImageUrl || "/placeholder.svg"}
                alt={`${name} - Imagen del evento`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleFavorite}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isFavorite
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Information */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("font-medium", statusInfo.className)}
                  >
                    {statusInfo.label}
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {name}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {shortDescription}
                </p>
              </div>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-card/50 rounded-lg border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {eventDate}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {eventHour} Hs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {venue ? venue.name : locationName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {venue ? venue.city : locationCity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Capacidad</p>
                      <p className="text-sm text-muted-foreground">
                        {venue ? venue.capacity : capacity} personas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Event Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Sobre el evento</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {shortDescription}
                  </p>
                  {longDescription && (
                    <p className="text-muted-foreground leading-relaxed">
                      {longDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Ticket Selection */}
              {status === "ACTIVE" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Seleccionar entradas</h2>
                  <TicketSelector
                    selectedTickets={selectedTickets}
                    onTicketsChange={setSelectedTickets}
                    eventId={event.id}
                  />
                </div>
              )}

              {status === "ANNOUNCED" && (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-border/50">
                  <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
                  <p className="text-muted-foreground">
                    Las entradas estarán disponibles pronto. ¡Mantente atento!
                  </p>
                </div>
              )}

              {status === "CANCELLED" && (
                <div className="text-center py-8 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Evento cancelado
                  </h3>
                  <p className="text-muted-foreground">
                    Este evento ha sido cancelado. Contacta al organizador para
                    más información.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Purchase Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PurchaseSummary
                event={{
                  id: event.id,
                  title: name,
                  venue: venue ? venue.name : locationName,
                  date: eventDate,
                  status: status,
                }}
                selectedTickets={selectedTickets}
                onTicketsChange={setSelectedTickets}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
