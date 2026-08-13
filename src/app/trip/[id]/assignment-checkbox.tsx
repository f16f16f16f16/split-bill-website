"use client";

import { useFormStatus } from "react-dom";
import { toggleItemAssignment } from "@/app/actions";

function Chip({
  participantName,
  defaultChecked,
}: {
  participantName: string;
  defaultChecked: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <label
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 has-checked:border-blue-500 has-checked:bg-blue-50 has-checked:text-blue-700 dark:border-zinc-700 dark:text-zinc-300 dark:has-checked:border-blue-400 dark:has-checked:bg-blue-950 dark:has-checked:text-blue-300 ${
        pending ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="sr-only"
      />
      {participantName}
      {pending && (
        <span className="h-2 w-2 animate-spin rounded-full border border-current border-t-transparent" />
      )}
    </label>
  );
}

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
      <Chip participantName={participantName} defaultChecked={defaultChecked} />
    </form>
  );
}
