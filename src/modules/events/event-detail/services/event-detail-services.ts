export interface TicketTypeDetail {
  id: string;
  name: string;
  price: number;
  capacity: number;
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number | null;
}

export interface EventStageDetail {
  id: string;
  stageName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  ticketTypes: TicketTypeDetail[];
}

export interface ValidatorDetail {
  id: string;
  user: {
    fullName: string;
  };
}

export interface VenueDetail {
  name: string;
  address: string;
  capacity: number;
  city: string;
}

export interface EventDetailType {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  locationName: string;
  locationCity: string;
  status: "ANNOUNCED" | "ACTIVE" | "CANCELLED";
  thumbnailUrl: string;
  coverImageUrl: string;
  videoUrl?: string | null;
  startDatetime: string;
  endDatetime: string;
  organizer: {
    id: string;
    user: {
      fullName: string;
    };
  };
  venue?: VenueDetail | null;
  stages: EventStageDetail[];
  validators: ValidatorDetail[];
  featuredEvent?: {
    featuredAt: string;
  } | null;
  minPrice?: number;
  capacity: number;
}

async function fetchEventBySlugFromApi(slug: string): Promise<EventDetailType> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/events/${encodeURIComponent(
        slug
      )}`
    );
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Evento no encontrado");
      }
      throw new Error(`Server responded with status ${res.status}`);
    }
    const data = await res.json();
    return data as EventDetailType;
  } catch (error) {
    console.error("[FETCH_EVENT_BY_SLUG_ERROR]", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "No se pudo obtener el detalle del evento. Intentá más tarde."
    );
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventDetailType> {
  return fetchEventBySlugFromApi(slug);
}
