import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import AddBillForm from "./add-bill-form";
import AssignmentCheckbox from "./assignment-checkbox";
import PaidToggleButton from "./paid-toggle-button";
import { toggleParticipantPaid } from "@/app/actions";

type OwedItem = {
  itemId: string;
  itemName: string;
  amount: number;
};

type OwedLine = {
  billId: string;
  billTitle: string;
  amount: number;
  payToName: string;
  payToInfo: string | null;
  items: OwedItem[];
};

export default async function TripPage(props: PageProps<"/trip/[id]">) {
  const { id } = await props.params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      participants: true,
      bills: {
        include: { items: { include: { assignments: true } }, payer: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!trip) notFound();

  const owedBreakdownByParticipant = new Map<string, OwedLine[]>(
    trip.participants.map((p) => [p.id, []])
  );

  for (const bill of trip.bills) {
    const itemsByParticipant = new Map<string, OwedItem[]>();
    for (const item of bill.items) {
      const price = Number(item.price);
      const sharedCount = item.assignments.length;
      if (sharedCount === 0) continue;
      const share = price / sharedCount;
      for (const a of item.assignments) {
        if (a.participantId === bill.payerId) continue;
        const list = itemsByParticipant.get(a.participantId) ?? [];
        list.push({ itemId: item.id, itemName: item.name, amount: share });
        itemsByParticipant.set(a.participantId, list);
      }
    }
    for (const [participantId, items] of itemsByParticipant) {
      const amount = items.reduce((sum, i) => sum + i.amount, 0);
      if (amount <= 0) continue;
      owedBreakdownByParticipant.get(participantId)?.push({
        billId: bill.id,
        billTitle: bill.title,
        amount,
        payToName: bill.payer.name,
        payToInfo: bill.payer.paymentInfo,
        items,
      });
    }
  }

  const grandTotal = trip.bills.reduce(
    (sum, bill) =>
      sum + bill.items.reduce((s, item) => s + Number(item.price), 0),
    0
  );

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-8 dark:bg-black sm:px-6 sm:py-12">
      <main className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {trip.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {trip.participants.map((p) => p.name).join(", ")}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {trip.bills.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No bills yet — add the first one below.
            </p>
          )}

          {trip.bills.map((bill) => {
            const billTotal = bill.items.reduce(
              (s, item) => s + Number(item.price),
              0
            );
            return (
              <section
                key={bill.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {bill.title}
                  </h2>
                  <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {formatCurrency(billTotal)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Paid by {bill.payer.name}
                  {bill.payer.paymentInfo ? ` — ${bill.payer.paymentInfo}` : ""}
                </p>
                <div className="mt-3 flex flex-col gap-4">
                  {bill.items.map((item) => {
                    const assignedIds = new Set(
                      item.assignments.map((a) => a.participantId)
                    );
                    return (
                      <div
                        key={item.id}
                        className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-zinc-800 dark:text-zinc-200">
                            {item.name}
                          </p>
                          <span className="shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                            {formatCurrency(Number(item.price))}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {trip.participants.map((p) => (
                            <AssignmentCheckbox
                              key={p.id}
                              itemId={item.id}
                              participantId={p.id}
                              participantName={p.name}
                              defaultChecked={assignedIds.has(p.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <AddBillForm tripId={trip.id} participants={trip.participants} />
        </div>

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
          <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Who owes what
          </h2>
          <div className="mt-3 flex flex-col gap-4">
            {trip.participants.map((p) => {
              const lines = owedBreakdownByParticipant.get(p.id) ?? [];
              const total = lines.reduce((sum, l) => sum + l.amount, 0);
              return (
                <div
                  key={p.id}
                  className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                        {p.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {lines.length === 0
                          ? "Nothing owed"
                          : `${formatCurrency(total)} total`}
                      </p>
                    </div>
                    <form action={toggleParticipantPaid.bind(null, p.id)}>
                      <PaidToggleButton paid={p.paid} />
                    </form>
                  </div>
                  {lines.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-2">
                      {lines.map((line) => (
                        <li key={line.billId} className="text-xs">
                          <div className="flex items-center justify-between gap-3 text-zinc-600 dark:text-zinc-400">
                            <span>
                              {line.billTitle} → pay {line.payToName}
                              {line.payToInfo ? ` (${line.payToInfo})` : ""}
                            </span>
                            <span className="shrink-0 font-medium text-zinc-800 dark:text-zinc-200">
                              {formatCurrency(line.amount)}
                            </span>
                          </div>
                          <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                            {line.items.map((item) => (
                              <li
                                key={item.itemId}
                                className="flex items-center justify-between gap-3 text-zinc-500 dark:text-zinc-500"
                              >
                                <span>{item.itemName}</span>
                                <span className="shrink-0">
                                  {formatCurrency(item.amount)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between border-t border-zinc-200 pt-3 text-sm font-semibold text-zinc-950 dark:border-zinc-800 dark:text-zinc-50">
            <span>Trip total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
