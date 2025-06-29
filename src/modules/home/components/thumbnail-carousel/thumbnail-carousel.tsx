"use client";

import React, { FC, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/modules/shared/services/events-services";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { ThumbnailSlide } from "./thumbnail-slide";

interface ThumbnailCarouselProps {
  slides: Event[];
  className?: string;
}

export const ThumbnailCarousel: FC<ThumbnailCarouselProps> = ({
  slides,
  className,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: "auto",
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 1280px)": { slidesToScroll: 4 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!slides || slides.length === 0) {
    return (
      <div className={cn("text-center py-16", className)}>
        <p className="text-lg text-muted-foreground">
          No hay eventos disponibles en este momento
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full",
              !canScrollPrev && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Eventos anteriores"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full",
              !canScrollNext && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Siguientes eventos"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View All Button */}
        <Button variant="ghost" className="text-sm font-medium">
          Ver todos los eventos
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 lg:gap-6">
          {slides.map((slide) => (
            <ThumbnailSlide
              key={slide.id}
              slide={slide}
              className="flex-[0_0_280px] md:flex-[0_0_320px]"
            />
          ))}
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{
            width: emblaApi
              ? `${
                  ((emblaApi.selectedScrollSnap() + 1) /
                    emblaApi.scrollSnapList().length) *
                  100
                }%`
              : "0%",
          }}
        />
      </div>

      {/* Keyboard Navigation */}
      <div className="sr-only">
        <p>Use las flechas izquierda y derecha para navegar por los eventos</p>
      </div>
    </div>
  );
};
