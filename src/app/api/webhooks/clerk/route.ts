import { ROLE } from "@/modules/auth/lib/auth.types";
import prisma from "@/modules/shared/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;

  if (!secret) {
    console.error('Missing "SIGNING_SECRET"');
    return new Response("Server error", { status: 500 });
  }

  const wh = new Webhook(secret);

  let event: WebhookEvent;

  try {
    const body = await req.text();
    const headerPayload = await headers();
    event = wh.verify(body, {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Clerk webhook verification failed: ", error);

    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      event.data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error("Email missing in user.created payload");

      return new Response("Invalid user data", { status: 400 });
    }

    const role =
      (public_metadata?.role as string).toUpperCase() ?? ("CUSTOMER" as ROLE);

    try {
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
          role: role === "ORGANIZER" ? "ORGANIZER" : "CUSTOMER",
        },
      });

      if (role === "ORGANIZER") {
        const brandName = public_metadata?.brand_name as string;
        const legalName = public_metadata?.legal_name as string;
        const taxId = public_metadata?.tax_id as string;

        if (!brandName || !legalName || !taxId) {
          console.error(
            "Missing organizer metadata in Clerk for user: ",
            email
          );

          return new Response("Missing organizer metadata", { status: 400 });
        }

        const existingOrganizer = await prisma.organizer.findUnique({
          where: { user_id: user.id },
        });

        if (!existingOrganizer) {
          await prisma.organizer.create({
            data: {
              user_id: user.id,
              brand_name: brandName,
              legal_name: legalName,
              tax_id: taxId,
            },
          });
        }
      }

      console.log(`User ${email} registered as ${role}`);
      return new Response("User created", { status: 201 });
    } catch (error) {
      console.error("Error creating user: ", error);

      return new Response("Internal error", { status: 500 });
    }
  }

  return new Response("Ignored", { status: 200 });
}
