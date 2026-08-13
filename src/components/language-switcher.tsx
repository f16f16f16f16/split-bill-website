"use client";

import { setLocale } from "@/app/actions";
import { useI18n } from "./i18n-provider";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function LanguageSwitcher() {
  const { locale } = useI18n();

  return (
    <div className="flex overflow-hidden rounded-full border border-zinc-300 bg-white text-xs dark:border-zinc-700 dark:bg-zinc-900">
      {(["en", "th"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`px-2.5 py-1.5 font-medium uppercase transition-colors ${
            locale === l
              ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
