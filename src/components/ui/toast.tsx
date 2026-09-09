"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "success" | "error";
type Item = { id: number; msg: string; kind: Kind };

let push: ((msg: string, kind?: Kind) => void) | null = null;

/** Tampilkan toast dari mana saja (client component). */
export function toast(msg: string, kind: Kind = "success") {
  if (push) push(msg, kind);
}

let nextId = 1;

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    push = (msg, kind = "success") => {
      const id = nextId++;
      setItems((prev) => [...prev.slice(-2), { id, msg, kind }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "toast-in pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl",
            t.kind === "success" ? "bg-emerald-600" : "bg-red-600"
          )}
        >
          {t.kind === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <XCircle size={18} className="shrink-0" />
          )}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
