"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Building2, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/sections";
import { Input } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { waLink } from "@/lib/utils";
import type { Client } from "@/lib/db";

export function KlienContent({
  clients,
  whatsapp,
}: {
  clients: Client[];
  whatsapp: string;
}) {
  const { lang } = useLang();
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(needle));
  }, [q, clients]);

  return (
    <>
      <PageHero
        title={lang === "en" ? "Our Clients" : "Klien Kami"}
        desc={
          lang === "en"
            ? `${clients.length} companies trust us with their workforce training and certification.`
            : `${clients.length} perusahaan mempercayakan training dan sertifikasi tenaga kerjanya kepada kami.`
        }
        image="/images/6.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            <Building2 size={17} className="text-brand-600" />
            {clients.length} {lang === "en" ? "companies & counting" : "perusahaan & terus bertambah"}
          </p>
          <div className="relative sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "en" ? "Search company…" : "Cari perusahaan…"}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((c) => (
            <figure
              key={c.id}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-600/40 hover:shadow-lg"
            >
              <span className="flex h-20 w-full items-center justify-center sm:h-24">
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </span>
              <figcaption className="mt-3 line-clamp-2 min-h-8 text-center text-[13px] font-bold leading-snug text-navy-900">
                {c.name}
              </figcaption>
            </figure>
          ))}
        </div>
        {!shown.length && (
          <p className="py-16 text-center text-slate-500">
            {lang === "en" ? "No companies found." : "Perusahaan tidak ditemukan."}
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-navy-950 px-6 py-12 text-center sm:px-12">
          <Badge variant="accent" className="bg-accent-500/15 text-accent-500 ring-accent-500/40">
            {lang === "en" ? "Join them" : "Bergabunglah"}
          </Badge>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
            {lang === "en"
              ? "Make your workforce certified, like they did"
              : "Jadikan tenaga kerja Anda tersertifikasi, seperti mereka"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-slate-300">
            {lang === "en"
              ? "Tell us your training needs — we will prepare the scheme, schedule, and instructors."
              : "Ceritakan kebutuhan training perusahaan Anda — kami siapkan skema, jadwal, dan instrukturnya."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={waLink(
                whatsapp,
                lang === "en"
                  ? "Hi Faqib Surya Perkasa, our company is interested in corporate training & certification."
                  : "Hi Faqib Surya Perkasa, perusahaan kami tertarik dengan training & sertifikasi korporat."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {lang === "en" ? "Contact us" : "Hubungi kami"} <ArrowRight size={17} />
            </a>
            <a
              href={waLink(
                whatsapp,
                lang === "en"
                  ? "Hi Faqib Surya Perkasa, our company is interested in corporate training & certification."
                  : "Hi Faqib Surya Perkasa, perusahaan kami tertarik dengan training & sertifikasi korporat."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-[15px] font-bold text-white transition hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
      <div className="h-4" />
    </>
  );
}
