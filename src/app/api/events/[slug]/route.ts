import prisma from "@/modules/shared/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            user: {
              select: { fullName: true },
            },
          },
        },
        venue: {
          select: {
            name: true,
            address: true,
            capacity: true,
            city: true,
          },
        },
        stages: {
          orderBy: { startDate: "asc" },
          include: {
            ticketTypes: {
              select: {
                id: true,
                name: true,
                price: true,
                capacity: true,
                discountType: true,
                discountValue: true,
              },
            },
          },
        },
        validators: {
          select: {
            id: true,
            user: {
              select: { fullName: true },
            },
          },
        },
        FeaturedEvent: {
          select: { featuredAt: true },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[GET_EVENT_BY_SLUG_ERROR]", error);
    return new NextResponse("Error fetching event", { status: 500 });
  }
}
