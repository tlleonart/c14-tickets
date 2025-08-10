import { EventDetail } from "@/modules/events/event-detail/event-detail-page";
import { fetchEventBySlug } from "@/modules/events/event-detail/services/event-detail-services";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventDetailSkeleton } from "@/modules/events/event-detail/components/event-detail-skeleton";
import { ErrorState } from "@/modules/shared/components/ui/error-state";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const event = await fetchEventBySlug(slug);

    return {
      title: `${event.name} | Carbono Tickets`,
      description: event.shortDescription,
      openGraph: {
        title: event.name,
        description: event.shortDescription,
        images: [
          {
            url: event.coverImageUrl,
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: event.name,
        description: event.shortDescription,
        images: [event.coverImageUrl],
      },
    };
  } catch (error) {
    console.error("Error buscando evento: ", error);
    return {
      title: "Evento no encontrado | Carbono Tickets",
    };
  }
}

// Event content component with error handling
async function EventContent({ slug }: { slug: string }) {
  try {
    const event = await fetchEventBySlug(slug);

    if (!event) {
      notFound();
    }

    return <EventDetail event={event} />;
  } catch (error) {
    console.error("[EVENT_DETAIL_PAGE] Error fetching event:", error);

    return (
      <div className="min-h-screen pt-16">
        <ErrorState
          title="Error al cargar el evento"
          description="No pudimos cargar la información del evento. Por favor, inténtalo de nuevo."
          retry={() => window.location.reload()}
        />
      </div>
    );
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen pt-16">
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventContent slug={slug} />
      </Suspense>
    </div>
  );
}
