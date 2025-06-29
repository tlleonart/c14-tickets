/*
  Warnings:

  - Added the required column `city` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "city" TEXT NOT NULL;
