"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/sections";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/db";

export function GaleriContent({ items }: { items: GalleryItem[] }) {
  const { lang } = useLang();
  const [filter, setFilter] = useState("all");
  const [light, setLight] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const shown = useMemo(
    () => items.filter((g) => filter === "all" || g.category === filter),
    [items, filter]
  );

  const countFor = (v: string) =>
    v === "all" ? items.length : items.filter((g) => g.category === v).length;

  const pills = [
    { v: "all", label: lang === "en" ? "All" : "Semua" },
    { v: "training", label: "Training" },
    { v: "events", label: lang === "en" ? "Company Events" : "Kegiatan" },
  ];

  const catLabel = (c: string) =>
    c === "training" ? "Training" : lang === "en" ? "Event" : "Kegiatan";

  const step = useCallback(
    (dir: 1 | -1) =>
      setLight((i) =>
        i === null ? i : (i + dir + shown.length) % shown.length
      ),
    [shown.length]
  );

  // tutup lightbox saat filter berubah
  useEffect(() => {
    setLight(null);
  }, [filter]);

  // keyboard + kunci scroll body saat lightbox terbuka
  useEffect(() => {
    if (light === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLight(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [light, step]);

  const current = light !== null ? shown[light] : null;

  return (
    <>
      <PageHero
        title={lang === "en" ? "Gallery" : "Galeri"}
        desc={
          lang === "en"
            ? "Training sessions and company events. Tap any photo to view."
            : "Dokumentasi sesi training dan kegiatan perusahaan. Ketuk foto untuk melihat."
        }
        image="/images/a.jpeg"
      />

      {/* filter menempel di bawah header */}
      <div className="sticky top-16 z-30 -mx-0 border-b border-slate-200/70 bg-white/95 backdrop-blur lg:top-[72px]">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {pills.map((p) => (
            <button
              key={p.v}
              onClick={() => setFilter(p.v)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-bold transition active:scale-95",
                filter === p.v
                  ? "bg-navy-900 text-white shadow"
                  : "border border-slate-300 text-slate-600 hover:bg-sand"
              )}
            >
              {p.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  filter === p.v ? "bg-white/20" : "bg-sand text-slate-500"
                )}
              >
                {countFor(p.v)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {!shown.length ? (
          <p className="py-16 text-center text-slate-500">
            {lang === "en" ? "No photos yet." : "Belum ada foto."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {shown.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setLight(idx)}
                className="group relative block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-sand transition active:scale-[0.98]"
                aria-label={g.title}
              >
                <img
                  src={g.image}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/70 to-transparent p-2.5 pt-6 text-left">
                  <span className="line-clamp-1 block text-xs font-bold text-white">
                    {g.title}
                  </span>
                </span>
                <span className="absolute left-2 top-2">
                  <Badge className="bg-white/90 text-[11px] text-navy-900">
                    {catLabel(g.category)}
                  </Badge>
                </span>
              </button>
            ))}
          </div>
        )}
        <p className="mt-6 text-center text-[13px] text-slate-500">
          {shown.length} {lang === "en" ? "photos" : "foto"} ·{" "}
          {lang === "en" ? "tap to enlarge, swipe for more" : "ketuk untuk memperbesar, geser untuk lainnya"}
        </p>
      </section>

      {/* lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (dx > 48) step(-1);
            else if (dx < -48) step(1);
            setTouchX(null);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm font-bold tabular-nums text-white">
              {light !== null ? light + 1 : 0} / {shown.length}
              <span className="ml-2.5 font-medium text-slate-400">
                {catLabel(current.category)}
              </span>
            </p>
            <button
              aria-label="Tutup"
              onClick={() => setLight(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-14">
            <button
              aria-label="Foto sebelumnya"
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:inline-flex"
            >
              <ChevronLeft size={22} />
            </button>
            <img
              key={current.id}
              src={current.image}
              alt={current.title}
              className="max-h-full w-auto max-w-full rounded-lg object-contain"
              onClick={() => setLight(null)}
            />
            <button
              aria-label="Foto berikutnya"
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:inline-flex"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <p className="line-clamp-1 px-4 pb-5 text-center text-sm font-semibold text-white sm:px-6">
            {current.title}
          </p>
        </div>
      )}
      <div className="h-4" />
    </>
  );
}
