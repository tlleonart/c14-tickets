import prisma from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isFeatured = searchParams.get("featured") === "true";

  try {
    const events = await prisma.event.findMany({
      where: isFeatured ? { FeaturedEvent: { isNot: null } } : undefined,
      include: {
        organizer: {
          select: {
            id: true,
            user: { select: { fullName: true } },
          },
        },
        FeaturedEvent: true,
      },
      orderBy: { startDatetime: "asc" },
    });

    const eventsWithMinPrice = await Promise.all(
      events.map(async (e) => {
        const agg = await prisma.ticketType.aggregate({
          where: {
            eventStage: { eventId: e.id },
          },
          _min: { price: true },
        });

        return {
          ...e,
          minPrice: agg._min.price ?? 0,
        };
      })
    );

    return NextResponse.json(eventsWithMinPrice);
  } catch (error) {
    console.error("[GET_EVENTS_ERROR]", error);
    return new NextResponse("Error fetching events", { status: 500 });
  }
}
