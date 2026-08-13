"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";
import { locales, type Locale } from "@/lib/i18n/dictionaries";

export async function setLocale(locale: Locale) {
  if (!(locales as readonly string[]).includes(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}

export type CreateTripInput = {
  title: string;
  participants: { name: string; paymentInfo: string }[];
};

export async function createTrip(input: CreateTripInput) {
  const dict = getDictionary(await getLocale());
  const title = input.title.trim();
  const participants = input.participants
    .map((p) => ({ name: p.name.trim(), paymentInfo: p.paymentInfo.trim() }))
    .filter((p) => p.name.length > 0);

  if (!title) throw new Error(dict.errors.tripTitleRequired);
  if (participants.length < 1)
    throw new Error(dict.errors.atLeastOneParticipant);

  const trip = await prisma.trip.create({ data: { title } });

  await prisma.participant.createMany({
    data: participants.map((p) => ({
      tripId: trip.id,
      name: p.name,
      paymentInfo: p.paymentInfo || null,
    })),
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
  const dict = getDictionary(await getLocale());
  const title = input.title.trim();
  const items = input.items
    .map((item) => ({ ...item, name: item.name.trim() }))
    .filter((item) => item.name.length > 0 && item.price > 0);

  if (!title) throw new Error(dict.errors.billTitleRequired);
  if (!input.payerId) throw new Error(dict.errors.pickPayer);
  if (items.length < 1) throw new Error(dict.errors.atLeastOneItem);

  const payer = await prisma.participant.findUniqueOrThrow({
    where: { id: input.payerId },
  });
  if (payer.tripId !== input.tripId)
    throw new Error(dict.errors.payerMustBeParticipant);

  const bill = await prisma.bill.create({
    data: {
      title,
      tripId: input.tripId,
      payerId: input.payerId,
    },
  });

  await prisma.item.createMany({
    data: items.map((item) => ({
      billId: bill.id,
      name: item.name,
      price: item.price,
    })),
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
