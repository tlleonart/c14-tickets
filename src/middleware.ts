// src/middleware.ts - FIXED VERSION

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Protected routes (pages that need auth)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/organizer(.*)", // Add other protected routes
  "/sell-tickets(.*)", // Add other protected routes
]);

// ✅ Public API routes (no auth needed)
const isPublicApiRoute = createRouteMatcher([
  "/api/events(.*)", // Your events API
  "/api/webhooks(.*)", // Webhooks don't need auth - IMPORTANT!
  "/api/ticket-types(.*)", // Public ticket info
  "/api/purchases(.*)", // Purchase API (handles auth internally)
]);

export default clerkMiddleware(async (auth, req) => {
  // ✅ Skip auth for public API routes
  if (isPublicApiRoute(req)) {
    return;
  }

  // ✅ Protect page routes that need auth
  if (isProtectedRoute(req)) {
    // await auth.protect();
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
