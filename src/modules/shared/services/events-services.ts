export interface Event {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  videoUrl?: string;
  status: "ANNOUNCED" | "ACTIVE" | "CANCELLED";
  startDatetime: string;
  endDatetime: string;
  locationName: string;
  locationCity: string;
  organizer: {
    id: string;
    user: {
      fullName: string;
    };
  };
  featuredEvent?: {
    id: string;
    featuredAt: string;
  };
  minPrice: number;
}

async function fetchFromApi(query = ""): Promise<Event[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/events${query}`
    );

    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response format");
    }

    return data;
  } catch (error) {
    console.error("[EVENTS_API_ERROR]", error);
    throw new Error("No se pudieron obtener los eventos. Intentalo más tarde.");
  }
}

export async function fetchAllEvents(): Promise<Event[]> {
  return fetchFromApi();
}

export async function fetchFeaturedEvents(): Promise<Event[]> {
  return fetchFromApi("?featured=true");
}
