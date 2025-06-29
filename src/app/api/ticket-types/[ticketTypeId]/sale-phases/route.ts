import prisma from "@/modules/shared/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { ticketTypeId: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    console.warn("Unauthorized access attempt");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { organizer: true },
    });

    if (!user) {
      console.error(`User ${userId} not found in DB`);
      return new Response("User not found", { status: 404 });
    }

    if (user.role !== "ORGANIZER" || !user.organizer) {
      console.warn("Access denied (not an organizer): ", user.email);
      return new Response("Access denied", { status: 403 });
    }

    const ticketTypeId = parseInt(params.ticketTypeId);
    if (isNaN(ticketTypeId)) {
      return new Response("Invalid ticket type ID", { status: 400 });
    }

    const ticketType = await prisma.ticket_type.findUnique({
      where: { id: ticketTypeId },
      include: {
        event: true,
      },
    });

    if (!ticketType || ticketType.event.organizer_id !== user.organizer.id) {
      console.warn(`Ticket type not found or unauthorized: ${ticketTypeId}`);
      return new Response("Ticket type not found or unauthorized", {
        status: 404,
      });
    }

    const body = await req.json();
    const { name, price, quantity, start_date, end_date } = body;

    if (
      !name ||
      typeof price !== "number" ||
      typeof quantity !== "number" ||
      !start_date ||
      !end_date
    ) {
      return new Response("Missing or invalid fields", { status: 400 });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new Response("Invalid date format", { status: 400 });
    }

    if (startDate >= endDate) {
      return new Response("start_date must be before end_date", {
        status: 400,
      });
    }

    const salePhase = await prisma.sale_phase.create({
      data: {
        ticket_type_id: ticketTypeId,
        name,
        price,
        quantity,
        available: quantity,
        start_date: startDate,
        end_date: endDate,
      },
    });

    return new Response(`Sale phase created: ${JSON.stringify(salePhase)}`, {
      status: 201,
    });
  } catch (error) {
    console.error("Unexpected error creating sale phase: ", error);
    return new Response("Internal server error", { status: 500 });
  }
}
