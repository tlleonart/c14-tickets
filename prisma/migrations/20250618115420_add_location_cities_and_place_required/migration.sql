/*
  Warnings:

  - Made the column `locationCity` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locationName` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "locationCity" SET NOT NULL,
ALTER COLUMN "locationName" SET NOT NULL;
