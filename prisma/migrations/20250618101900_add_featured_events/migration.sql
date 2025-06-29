-- CreateTable
CREATE TABLE "featured_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "featuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "featured_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "featured_events_eventId_key" ON "featured_events"("eventId");

-- AddForeignKey
ALTER TABLE "featured_events" ADD CONSTRAINT "featured_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
