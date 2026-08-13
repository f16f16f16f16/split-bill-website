"use client";

import { toggleItemAssignment } from "@/app/actions";

export default function AssignmentCheckbox({
  itemId,
  participantId,
  participantName,
  defaultChecked,
}: {
  itemId: string;
  participantId: string;
  participantName: string;
  defaultChecked: boolean;
}) {
  return (
    <form action={toggleItemAssignment.bind(null, itemId, participantId)}>
      <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:text-blue-700 dark:border-zinc-700 dark:text-zinc-300 dark:has-checked:border-blue-400 dark:has-checked:bg-blue-950 dark:has-checked:text-blue-300">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="sr-only"
        />
        {participantName}
      </label>
    </form>
  );
}
