/*
  Warnings:

  - You are about to drop the column `billId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `tripId` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_billId_fkey";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "tripId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "billId",
DROP COLUMN "paid",
DROP COLUMN "paidAt",
ADD COLUMN     "tripId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillPayment" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "BillPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillPayment_billId_participantId_key" ON "BillPayment"("billId", "participantId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
