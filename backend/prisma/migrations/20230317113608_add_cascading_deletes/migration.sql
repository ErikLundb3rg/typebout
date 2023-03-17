-- DropForeignKey
ALTER TABLE "Performances" DROP CONSTRAINT "Performances_raceId_fkey";

-- DropForeignKey
ALTER TABLE "Performances" DROP CONSTRAINT "Performances_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quotes" DROP CONSTRAINT "Quotes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Races" DROP CONSTRAINT "Races_quotesId_fkey";

-- AddForeignKey
ALTER TABLE "Performances" ADD CONSTRAINT "Performances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performances" ADD CONSTRAINT "Performances_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Races"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Races" ADD CONSTRAINT "Races_quotesId_fkey" FOREIGN KEY ("quotesId") REFERENCES "Quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotes" ADD CONSTRAINT "Quotes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
