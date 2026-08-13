"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { createTrip } from "./actions";

type ParticipantDraft = { name: string; paymentInfo: string };

export default function Home() {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState<ParticipantDraft[]>([
    { name: "", paymentInfo: "" },
    { name: "", paymentInfo: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addParticipant() {
    setParticipants((p) => [...p, { name: "", paymentInfo: "" }]);
  }

  function removeParticipant(idx: number) {
    if (participants.length <= 1) return;
    setParticipants((p) => p.filter((_, i) => i !== idx));
  }

  function updateParticipant(
    idx: number,
    field: keyof ParticipantDraft,
    value: string
  ) {
    setParticipants((p) =>
      p.map((person, i) => (i === idx ? { ...person, [field]: value } : person))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createTrip({ title, participants });
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-8 dark:bg-black sm:px-6 sm:py-12">
      <main className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Split Bill
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Start a trip, add everyone going, then add a bill for each day or
          expense. Share the link so everyone can check what they had and
          mark themselves as paid.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
            <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Trip name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chiang Mai Weekend"
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Who&apos;s going
              </h2>
              <button
                type="button"
                onClick={addParticipant}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                + Add person
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              This list is shared across every bill in the trip. Payment info
              is optional but shows up whenever this person pays for a bill,
              so others know how to pay them back.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {participants.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) =>
                        updateParticipant(idx, "name", e.target.value)
                      }
                      placeholder={`Person ${idx + 1}`}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                    />
                    <input
                      type="text"
                      value={person.paymentInfo}
                      onChange={(e) =>
                        updateParticipant(idx, "paymentInfo", e.target.value)
                      }
                      placeholder="Payment info (e.g. Kbank 123-4-56789-0 or PromptPay 08xxxxxxxx)"
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeParticipant(idx)}
                    disabled={participants.length <= 1}
                    className="shrink-0 rounded-lg px-2 py-2 text-sm text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                    aria-label="Remove person"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

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
            {submitting ? "Creating…" : "Create trip"}
          </button>
        </form>
      </main>
    </div>
  );
}
