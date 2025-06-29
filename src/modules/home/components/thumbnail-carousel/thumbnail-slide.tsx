import { Badge } from "@/modules/shared/components/ui/badge";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { Event } from "@/modules/shared/services/events-services";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/modules/shared/lib/utils";

interface ThumbnailSlideProps {
  slide: Event;
  className?: string;
}

export const ThumbnailSlide: FC<ThumbnailSlideProps> = ({
  slide,
  className,
}) => {
  const {
    category,
    startDatetime,
    thumbnailUrl,
    locationCity,
    locationName,
    shortDescription,
    slug,
    name,
    status,
  } = slide;

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const time = date.toLocaleDateString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { day, month: month.toUpperCase(), time };
  };

  const { day, month, time } = formatEventDate(startDatetime);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/90 text-white border-green-500/20";
      case "ANNOUNCED":
        return "bg-carbono-yellow/15 text-carbono-yellow-dark border-carbono-yellow/20";
      case "CANCELLED":
        return "bg-destructive/15 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "En venta";
      case "ANNOUNCED":
        return "Próximamente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return "Info";
    }
  };

  return (
    <div className={cn("group", className)}>
      <Card
        className={cn(
          "h-full overflow-hidden border-0 bg-card transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-2 card-hover"
        )}
      >
        <Link href={`/events/${slug}`} className="block h-full">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={`${name} - Miniatura del evento`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 320px"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                className={cn("text-xs font-medium", getStatusColor(status))}
              >
                {getStatusLabel(status)}
              </Badge>
            </div>

            {/* Date Badge */}
            <div className="absolute top-3 left-3">
              <div className="bg-white/90  backdrop-blur-sm rounded-lg p-2 text-center min-w-[50px]">
                <div className="text-lg font-bold text-black leading-none ">
                  {day}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {month}
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-black/70 text-white border-0 backdrop-blur-sm"
              >
                {category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-5 space-y-4">
            {/* Event Title */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-muted-foreground">
              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {locationName}, {locationCity}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{time}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>

            {/* Action Indicator */}
            <div className="pt-2">
              {status === "ACTIVE" ? (
                <div className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                  Ver entradas →
                </div>
              ) : status === "ANNOUNCED" ? (
                <div className="text-sm font-medium text-muted-foreground">
                  Más información →
                </div>
              ) : (
                <div className="text-sm font-medium text-muted-foreground opacity-50">
                  No disponible
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
