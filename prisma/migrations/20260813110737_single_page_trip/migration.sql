/*
  Warnings:

  - You are about to drop the `BillPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillPayment" DROP CONSTRAINT "BillPayment_billId_fkey";

-- DropForeignKey
ALTER TABLE "BillPayment" DROP CONSTRAINT "BillPayment_participantId_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "BillPayment";
