"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { createBill } from "@/app/actions";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/components/i18n-provider";

type ItemDraft = { name: string; price: string };
type ParticipantOption = { id: string; name: string };

export default function AddBillForm({
  tripId,
  participants,
}: {
  tripId: string;
  participants: ParticipantOption[];
}) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [payerId, setPayerId] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([{ name: "", price: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addItem() {
    setItems((its) => [...its, { name: "", price: "" }]);
  }

  function removeItem(idx: number) {
    if (items.length <= 1) return;
    setItems((its) => its.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof ItemDraft, value: string) {
    setItems((its) =>
      its.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  }

  const total = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createBill({
        tripId,
        title,
        payerId,
        items: items.map((it) => ({
          name: it.name,
          price: parseFloat(it.price) || 0,
        })),
      });
      setTitle("");
      setPayerId("");
      setItems([{ name: "", price: "" }]);
      setOpen(false);
    } catch (err) {
      unstable_rethrow(err);
      setError(
        err instanceof Error ? err.message : dict.addBill.somethingWentWrong
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
      >
        {dict.addBill.addABill}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {dict.addBill.newBill}
        </h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          {dict.addBill.cancel}
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={dict.addBill.billTitlePlaceholder}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
      />

      <select
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <option value="">{dict.addBill.whoPaid}</option>
        {participants.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
              placeholder={dict.addBill.itemNamePlaceholder}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={item.price}
              onChange={(e) => updateItem(idx, "price", e.target.value)}
              placeholder="0.00"
              className="w-24 shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={items.length <= 1}
              className="shrink-0 rounded-lg px-2 py-2 text-sm text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
              aria-label={dict.addBill.removeItem}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="self-start text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {dict.addBill.addItem}
        </button>
      </div>

      <div className="flex justify-between border-t border-zinc-200 pt-3 text-sm font-semibold text-zinc-950 dark:border-zinc-800 dark:text-zinc-50">
        <span>{dict.addBill.total}</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {submitting ? dict.addBill.creating : dict.addBill.createBill}
      </button>
    </form>
  );
}
