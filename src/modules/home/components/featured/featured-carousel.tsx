"use client";

import React, { FC, useCallback } from "react";
import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./featured-carousel-dot-button";
import { FeaturedCarouselSlide } from "./featured-carousel-slide";
import { Event } from "@/modules/shared/services/events-services";

interface FeaturedCarouselProps {
  slides: Event[];
}

export const FeaturedCarousel: FC<FeaturedCarouselProps> = ({ slides }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;
    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  if (!slides || slides.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No featured events available.
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <FeaturedCarouselSlide key={slide.id} slide={slide} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70 transition"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
