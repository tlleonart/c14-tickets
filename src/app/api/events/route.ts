/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("[DEBUG] /api/events handler triggered");
  console.log("[DEBUG] Headers:", Object.fromEntries(req.headers.entries()));
  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};

    if (isFeatured) {
      where.FeaturedEvent = { isNot: null };
    }

    if (category) {
      where.category = category;
    }

    if (city) {
      where.locationCity = city;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            user: { select: { fullName: true } },
          },
        },
        FeaturedEvent: {
          select: { featuredAt: true },
        },
      },
      orderBy: [
        // ✅ Featured events first, then by date
        { FeaturedEvent: { featuredAt: "desc" } },
        { startDatetime: "asc" },
      ],
      take: limit,
      skip: offset,
    });

    const eventIds = events.map((e) => e.id);

    {
      /*const ticketPrices = await prisma.ticketType.groupBy({
      by: ["eventStageId"],
      where: {
        eventStage: {
          eventId: { in: eventIds },
        },
      },
      _min: { price: true },
      include: {
        eventStage: {
          select: { eventId: true },
        },
      },
    });*/
    }

    const priceMap = new Map();
    for (const stage of await prisma.eventStage.findMany({
      where: { eventId: { in: eventIds } },
      include: {
        ticketTypes: {
          select: { price: true },
        },
      },
    })) {
      const minPrice = Math.min(...stage.ticketTypes.map((tt) => tt.price));
      if (
        !priceMap.has(stage.eventId) ||
        priceMap.get(stage.eventId) > minPrice
      ) {
        priceMap.set(stage.eventId, minPrice);
      }
    }

    const eventsWithMinPrice = events.map((event) => ({
      ...event,
      minPrice: priceMap.get(event.id) ?? 0,
      isFeatured: !!event.FeaturedEvent,
    }));

    const total = await prisma.event.count({ where });

    return NextResponse.json({
      events: eventsWithMinPrice,
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      },
    });
  } catch (error) {
    console.error("[GET_EVENTS_ERROR]", error);
    console.log("[DEBUG] Error type:", error?.constructor?.name);
    return new NextResponse("Error fetching events", { status: 500 });
  }
}
