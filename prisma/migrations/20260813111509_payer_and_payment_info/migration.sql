/*
  Warnings:

  - Added the required column `payerId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "payerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "paymentInfo" TEXT;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
