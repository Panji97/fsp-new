"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

export function AdminTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">{title}</h1>
      {desc && <p className="mt-1 text-sm text-slate-600">{desc}</p>}
    </div>
  );
}

export function DeleteButton({
  id,
  action,
  name,
}: {
  id: string;
  action: (id: string) => Promise<void>;
  name?: string;
}) {
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px]">
        <span className="text-slate-600">Hapus{name ? ` “${name}”` : ""}?</span>
        <button
          disabled={pending}
          onClick={() => start(async () => { await action(id); })}
          className="cursor-pointer rounded-md bg-red-600 px-2.5 py-1 font-bold text-white hover:bg-red-700"
        >
          Ya
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="cursor-pointer rounded-md border border-slate-300 px-2.5 py-1 font-semibold hover:bg-sand"
        >
          Batal
        </button>
      </span>
    );
  }
  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[13px] font-semibold text-red-600 hover:bg-red-50"
      aria-label={`Hapus ${name || ""}`}
    >
      <Trash2 size={14} /> Hapus
    </button>
  );
}

export function Toggle({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer list-none px-5 py-3.5 text-sm font-bold text-brand-700 hover:bg-sand [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
        {label}
      </summary>
      <div className="border-t border-slate-200 p-5">{children}</div>
    </details>
  );
}
