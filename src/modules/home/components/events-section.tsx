import { Suspense } from "react";
import { ThumbnailCarousel } from "./thumbnail-carousel/thumbnail-carousel";
import { fetchAllEvents } from "@/modules/shared/services/events-services";
import { ErrorState } from "@/modules/shared/components/ui/error-state";
import { EventCardSkeleton } from "@/modules/shared/components/ui/loading";

// Loading component for events section
function EventsSkeleton() {
  return (
    <section className="section-padding-sm">
      <div className="container-fluid">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// All events content component
async function AllEventsContent() {
  try {
    const events = await fetchAllEvents();

    if (!events || events.length === 0) {
      return (
        <section className="section-padding bg-background">
          <div className="container-fluid">
            <h2 className="h2 mb-8">Todos los eventos</h2>
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No hay eventos disponibles en este momento
              </p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="section-padding">
        <div className="container-fluid">
          <h2 className="h2 mb-8">Descubre más eventos</h2>
          <ThumbnailCarousel slides={events} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching all events:", error);
    return (
      <section className="section-padding">
        <div className="container-fluid">
          <ErrorState
            title="Error al cargar eventos"
            description="No pudimos cargar la lista de eventos."
          />
        </div>
      </section>
    );
  }
}

export function EventsSection() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <AllEventsContent />
    </Suspense>
  );
}
