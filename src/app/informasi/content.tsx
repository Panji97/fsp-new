"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero } from "@/components/site/sections";
import { Card, CardContent } from "@/components/ui/card";
import type { Schedule } from "@/lib/db";

export function InformasiContent({ schedules }: { schedules: Schedule[] }) {
  const { pick, lang } = useLang();
  return (
    <>
      <PageHero
        title={lang === "en" ? "Training & Certification Schedules" : "Jadwal Pelatihan & Sertifikasi"}
        desc={pick(
          "Unduh jadwal terbaru untuk setiap lembaga sertifikasi. Hubungi kami untuk pendaftaran.",
          "Download the latest schedule for each certification body. Contact us to register."
        )}
      />
      <section className="no-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 pt-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-6 sm:pb-0 lg:grid-cols-3">
        {schedules.map((s) => (
          <Card key={s.id} className="flex w-[84%] shrink-0 snap-center flex-col overflow-hidden sm:w-auto">
            <div className="flex h-44 items-center justify-center bg-sand p-8">
              <img src={s.image} alt={pick(s.title_id, s.title_en)} className="max-h-full w-auto object-contain" />
            </div>
            <CardContent className="flex flex-1 flex-col pt-5">
              <h2 className="mt-0 text-xl font-bold text-navy-900">{pick(s.title_id, s.title_en)}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {pick(s.body_id, s.body_en)}
              </p>
              <div className="mt-4 flex gap-2">
                {s.pdf_url ? (
                  <>
                    <a
                      href={s.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      <FileText size={15} /> {lang === "en" ? "View schedule" : "Lihat jadwal"}
                    </a>
                    <a
                      href={s.pdf_url}
                      download
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-3.5 text-sm font-semibold hover:bg-sand"
                      aria-label="Unduh PDF"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </>
                ) : (
                  <a
                    href="/kontak"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-sand"
                  >
                    {lang === "en" ? "Ask us for the schedule" : "Tanyakan jadwal ke kami"}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="h-4" />
    </>
  );
}
