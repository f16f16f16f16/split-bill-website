"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type CreateTripInput = {
  title: string;
  participants: { name: string; paymentInfo: string }[];
};

export async function createTrip(input: CreateTripInput) {
  const title = input.title.trim();
  const participants = input.participants
    .map((p) => ({ name: p.name.trim(), paymentInfo: p.paymentInfo.trim() }))
    .filter((p) => p.name.length > 0);

  if (!title) throw new Error("Trip title is required");
  if (participants.length < 1)
    throw new Error("At least one participant is required");

  const trip = await prisma.trip.create({
    data: {
      title,
      participants: {
        create: participants.map((p) => ({
          name: p.name,
          paymentInfo: p.paymentInfo || null,
        })),
      },
    },
  });

  redirect(`/trip/${trip.id}`);
}

export type CreateBillInput = {
  tripId: string;
  title: string;
  payerId: string;
  items: { name: string; price: number }[];
};

export async function createBill(input: CreateBillInput) {
  const title = input.title.trim();
  const items = input.items
    .map((item) => ({ ...item, name: item.name.trim() }))
    .filter((item) => item.name.length > 0 && item.price > 0);

  if (!title) throw new Error("Bill title is required");
  if (!input.payerId) throw new Error("Pick who paid for this bill");
  if (items.length < 1) throw new Error("At least one item is required");

  const payer = await prisma.participant.findUniqueOrThrow({
    where: { id: input.payerId },
  });
  if (payer.tripId !== input.tripId)
    throw new Error("Payer must be a participant of this trip");

  await prisma.bill.create({
    data: {
      title,
      tripId: input.tripId,
      payerId: input.payerId,
      items: {
        create: items.map((item) => ({ name: item.name, price: item.price })),
      },
    },
  });

  revalidatePath(`/trip/${input.tripId}`);
}

export async function toggleItemAssignment(
  itemId: string,
  participantId: string
) {
  const item = await prisma.item.findUniqueOrThrow({
    where: { id: itemId },
    include: { bill: true },
  });

  const existing = await prisma.itemAssignment.findUnique({
    where: { itemId_participantId: { itemId, participantId } },
  });

  if (existing) {
    await prisma.itemAssignment.delete({ where: { id: existing.id } });
  } else {
    await prisma.itemAssignment.create({ data: { itemId, participantId } });
  }

  revalidatePath(`/trip/${item.bill.tripId}`);
}

export async function toggleParticipantPaid(participantId: string) {
  const participant = await prisma.participant.findUniqueOrThrow({
    where: { id: participantId },
  });

  await prisma.participant.update({
    where: { id: participantId },
    data: {
      paid: !participant.paid,
      paidAt: !participant.paid ? new Date() : null,
    },
  });

  revalidatePath(`/trip/${participant.tripId}`);
}
