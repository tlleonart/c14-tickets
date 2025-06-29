/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Event {
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
  videoUrl?: string;
  startDatetime: string;
  endDatetime: string;
  capacity?: number;
  organizerName: string;
  isFeatured?: boolean;
  minPrice?: number;
}

async function fetchFromApi(endpoint: string): Promise<Event[]> {
  try {
    // ✅ Fixed URL construction for all environments
    let url: string;

    if (typeof window !== "undefined") {
      // Client-side: use relative URLs
      url = endpoint;
    } else {
      // Server-side: need absolute URL
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL
        : "http://localhost:3000";

      url = `${baseUrl}${endpoint}`;
    }
    console.log("[DEBUG] Fetching from:", url);

    console.log("[EVENTS_SERVICE] Fetching from:", url); // Debug log

    const response = await fetch(url, {
      // Add headers for server-side requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[EVENTS_SERVICE] Raw response:", data); // Debug log

    // ✅ Handle the API response structure: { events: [...], pagination: {...} }
    const events = data.events || data;

    if (!Array.isArray(events)) {
      console.error("[EVENTS_API_ERROR] Expected events array, got:", data);
      throw new Error("Unexpected response format");
    }

    // ✅ Transform to expected format
    return events.map((event: any) => ({
      id: event.id,
      slug: event.slug,
      name: event.name,
      category: event.category,
      shortDescription: event.shortDescription,
      longDescription: event.longDescription,
      locationName: event.locationName,
      locationCity: event.locationCity,
      status: event.status,
      thumbnailUrl: event.thumbnailUrl,
      coverImageUrl: event.coverImageUrl,
      videoUrl: event.videoUrl,
      startDatetime: event.startDatetime,
      endDatetime: event.endDatetime,
      capacity: event.capacity,
      organizerName: event.organizer?.user?.fullName || "Organizador",
      isFeatured: !!event.FeaturedEvent || event.isFeatured,
      minPrice: event.minPrice || 0,
    }));
  } catch (error) {
    console.error("[EVENTS_API_ERROR]", error);
    throw new Error("No se pudieron obtener los eventos. Intentalo más tarde.");
  }
}

export async function fetchAllEvents(): Promise<Event[]> {
  return fetchFromApi("/api/events");
}

export async function fetchFeaturedEvents(): Promise<Event[]> {
  return fetchFromApi("/api/events?featured=true");
}
