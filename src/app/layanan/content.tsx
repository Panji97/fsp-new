"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/sections";
import { Input } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/db";

export type SvcGroup = {
  id: string;
  category_id: string;
  title_id: string;
  title_en: string;
  list_id: string[];
  list_en: string[];
};

export function LayananContent({
  categories,
  groups,
}: {
  categories: ServiceCategory[];
  groups: SvcGroup[];
}) {
  const { pick, lang } = useLang();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return groups;
    return groups.filter(
      (g) =>
        g.title_id.toLowerCase().includes(needle) ||
        g.title_en.toLowerCase().includes(needle) ||
        g.list_id.some((i) => i.toLowerCase().includes(needle))
    );
  }, [q, groups]);

  return (
    <>
      <PageHero
        title={lang === "en" ? "Our Services" : "Layanan Kami"}
        desc={pick(
          "Skema sertifikasi BNSP, PPSDM Migas, KEMNAKER, IADC, dan training profesional.",
          "BNSP, PPSDM Migas, KEMNAKER, and IADC certification schemes plus professional training."
        )}
        image="/images/3.avif"
      />
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "en" ? "Search schemes, e.g. crane, welding, K3…" : "Cari skema, mis. crane, las, K3…"}
            className="h-12 pl-10 text-[15px]"
          />
        </div>
      </div>
      {categories.map((c) => {
        const items = filtered.filter((g) => g.category_id === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} id={c.slug} className="mx-auto max-w-5xl scroll-mt-24 px-4 pt-12 sm:px-6">
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
              <img src={c.logo} alt={pick(c.title_id, c.title_en)} className="h-16 w-auto max-w-[220px] object-contain" />
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-navy-900">
                  {pick(c.title_id, c.title_en)}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{pick(c.description_id, c.description_en)}</p>
                <Badge className="mt-2">
                  {items.length} {lang === "en" ? "groups" : "kelompok skema"}
                </Badge>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              {items.map((g, gi) => {
                const isOpen = open === g.id;
                const list = lang === "en" && g.list_en.length ? g.list_en : g.list_id;
                return (
                  <div key={g.id} className={cn(gi > 0 && "border-t border-slate-200")}>
                    <button
                      onClick={() => setOpen(isOpen ? null : g.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 bg-white px-5 py-4 text-left hover:bg-sand"
                    >
                      <span className={cn(
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition",
                        isOpen ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-slate-500"
                      )}>
                        {isOpen ? "−" : "+"}
                      </span>
                      <span className="flex-1 text-[15px] font-bold text-navy-900">
                        {pick(g.title_id, g.title_en)}
                      </span>
                      <span className="hidden text-xs text-slate-500 sm:block">
                        {list.length} skema
                      </span>
                      <ChevronDown size={17} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="grid gap-2 bg-sand/60 px-5 py-4 sm:grid-cols-2">
                        {list.map((item) => (
                          <p key={item} className="flex items-start gap-2 rounded-lg bg-white px-3 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200">
                            <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      <div className="h-4" />
    </>
  );
}
