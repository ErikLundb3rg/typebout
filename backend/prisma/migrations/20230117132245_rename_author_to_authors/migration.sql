/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quotes" DROP CONSTRAINT "Quotes_authorId_fkey";

-- DropTable
DROP TABLE "Author";

-- CreateTable
CREATE TABLE "Authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authors_name_key" ON "Authors"("name");

-- AddForeignKey
ALTER TABLE "Quotes" ADD CONSTRAINT "Quotes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
