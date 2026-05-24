'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export type ContactEmailRow = { email: string; note: string };

type Props = {
  emails: ContactEmailRow[];
  copyLabel: string;
  copiedLabel: string;
};

export default function ContactEmailRows({ emails, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (email: string) => {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(email);
        window.setTimeout(() => setCopied(null), 2000);
      } catch {
        setCopied(null);
      }
    },
    [],
  );

  return (
    <ul className="space-y-1.5">
      {emails.map((row) => {
        const isCopied = copied === row.email;
        return (
          <li
            key={row.email}
            className="rounded-md border border-zinc-200 bg-zinc-50/90 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          >
            <div className="flex items-start gap-1.5">
              <div className="min-w-0 flex-1">
                <a
                  href={`mailto:${row.email}`}
                  className="block truncate font-mono text-[11px] font-semibold tracking-tight text-zinc-900 hover:text-red-700 sm:text-xs"
                  dir="ltr"
                  title={row.email}
                >
                  {row.email}
                </a>
                <p className="mt-0.5 text-[10px] font-medium leading-snug text-zinc-500 sm:text-[11px]">{row.note}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(row.email)}
                className="flex shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-600 shadow-sm transition hover:border-red-400 hover:text-red-700"
                aria-label={isCopied ? copiedLabel : `${copyLabel}: ${row.email}`}
              >
                {isCopied ? <Check className="h-3 w-3 text-emerald-600" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
                <span className="hidden min-[380px]:inline">{isCopied ? copiedLabel : copyLabel}</span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
