"use client";

import { useFormStatus } from "react-dom";

export default function PaidToggleButton({ paid }: { paid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={
        paid
          ? "rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-400"
          : "rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
      }
    >
      {pending ? "Saving…" : paid ? "Paid ✓" : "Mark as paid"}
    </button>
  );
}
