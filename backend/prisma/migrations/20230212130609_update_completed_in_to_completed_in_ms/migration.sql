/*
  Warnings:

  - You are about to drop the column `completed_in` on the `Performances` table. All the data in the column will be lost.
  - Added the required column `completed_in_ms` to the `Performances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Performances" DROP COLUMN "completed_in",
ADD COLUMN     "completed_in_ms" INTEGER NOT NULL;
