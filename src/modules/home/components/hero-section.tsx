import { Suspense } from "react";
import { FeaturedCarousel } from "./featured/featured-carousel";
import { fetchFeaturedEvents } from "@/modules/shared/services/events-services";
import { ErrorState } from "@/modules/shared/components/ui/error-state";

function HeroSkeleton() {
  return (
    <div className="relative w-full h-screen bg-muted animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="absolute bottom-20 left-8 space-y-4">
        <div className="h-6 w-24 bg-muted-foreground/20 rounded" />
        <div className="h-16 w-96 bg-muted-foreground/20 rounded" />
        <div className="h-4 w-64 bg-muted-foreground/20 rounded" />
        <div className="h-12 w-40 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );
}

async function FeaturedEventsContent() {
  try {
    const featuredEvents = await fetchFeaturedEvents();

    if (!featuredEvents || featuredEvents.length === 0) {
      return (
        <section className="relative w-full h-screen bg-gradient-hero flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="h1 text-white">Próximamente eventos destacados</h1>
            <p className="text-lg text-white/80">
              Estamos preparando eventos increíbles para ti
            </p>
          </div>
        </section>
      );
    }

    return <FeaturedCarousel slides={featuredEvents} />;
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return (
      <section className="relative w-full h-screen bg-gradient-hero flex items-center justify-center">
        <ErrorState
          title="Error al cargar eventos destacados"
          description="No pudimos cargar los eventos destacados."
          className="text-white"
        />
      </section>
    );
  }
}

export function HeroSection() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <FeaturedEventsContent />
    </Suspense>
  );
}
