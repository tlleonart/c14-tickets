/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_clerkId_key" ON "user"("clerkId");
