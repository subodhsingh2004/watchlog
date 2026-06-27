/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "createdAt",
DROP COLUMN "genre";
