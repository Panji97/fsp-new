"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  Phone,
  Mail,
  Target,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { SectionHeading } from "@/components/site/sections";
import { HeroCarousel, ContactForm } from "@/components/site/home-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  Client,
  GalleryItem,
  Schedule,
  ServiceCategory,
} from "@/lib/db";

type Stat = { value: string; label_id: string; label_en: string };

export function HomeContent({
  settings,
  categories,
  counts,
  schedules,
  gallery,
  clients,
}: {
  settings: Record<string, string>;
  categories: ServiceCategory[];
  counts: Record<string, number>;
  schedules: Schedule[];
  gallery: GalleryItem[];
  clients: Client[];
}) {
  const { t, pick, lang } = useLang();
  const slides: string[] = JSON.parse(settings.hero_slides || "[]");
  const stats: Stat[] = JSON.parse(settings.stats || "[]");
  const mission: string[] = JSON.parse(
    (lang === "en" ? settings.mission_en : settings.mission_id) || "[]"
  );

  return (
    <>
      <HeroCarousel
        slides={slides.length ? slides : ["/images/6.jpg"]}
        tagline={settings.tagline}
        title={pick(settings.hero_title_id, settings.hero_title_en)}
        text={pick(settings.hero_text_id, settings.hero_text_en)}
        whatsapp={settings.whatsapp}
      />

      {/* stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-navy-900 shadow-xl lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value + s.label_id} className="bg-navy-900 px-6 py-6 text-center">
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] font-medium text-slate-300">
                {pick(s.label_id, s.label_en)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* tentang singkat */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              align="left"
              eyebrow={lang === "en" ? "About us" : "Tentang Kami"}
              title={settings.company_name}
              desc={pick(settings.about_id, settings.about_en)}
            />
            <ul className="mt-6 space-y-3">
              {mission.slice(0, 3).map((m, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-slate-700">
                  <BadgeCheck size={19} className="mt-0.5 shrink-0 text-brand-600" />
                  {m}
                </li>
              ))}
            </ul>
            <Link
              href="/tentang"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:gap-3"
            >
              {lang === "en" ? "More about us" : "Selengkapnya tentang kami"}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <img
              src="/images/d.jpeg"
              alt="Kegiatan training FSP"
              className="aspect-[4/3] w-full rounded-2xl border border-slate-200 object-cover shadow-lg"
            />
            <div className="absolute -bottom-5 -left-3 rounded-xl bg-navy-900 px-5 py-4 text-white shadow-xl sm:-left-5">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Building2 size={16} className="text-accent-500" /> TUK Berlisensi
              </p>
              <p className="mt-0.5 text-xs text-slate-300">
                Tempat Uji Kompetensi resmi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* layanan */}
      <section className="mt-24 bg-sand py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={lang === "en" ? "Services" : "Layanan"}
            title={lang === "en" ? "Certification for every field role" : "Sertifikasi untuk setiap peran lapangan"}
            desc={pick(
              "Dari inspektur rig hingga K3 umum — semua skema dikelola dan dapat diperbarui melalui halaman admin.",
              "From rig inspectors to general OHS — all schemes are managed and updatable via the admin pages."
            )}
          />
          <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/layanan#${c.slug}`}
                className="group w-[84%] shrink-0 snap-center rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-600/40 hover:shadow-lg sm:w-auto"
              >
                <div className="flex h-14 items-center">
                  <img src={c.logo} alt={pick(c.title_id, c.title_en)} className="max-h-14 w-auto object-contain" />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-navy-900 group-hover:text-brand-700">
                  {pick(c.title_id, c.title_en)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {pick(c.description_id, c.description_en)}
                </p>
                <p className="mt-4 flex items-center gap-2 text-[13px] font-bold text-brand-600">
                  <Award size={15} />
                  {counts[c.id] || 0} {lang === "en" ? "schemes" : "skema"}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* jadwal */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow={lang === "en" ? "Schedules" : "Jadwal"}
            title={lang === "en" ? "Training & certification schedules" : "Jadwal Pelatihan & Sertifikasi"}
          />
          <Link href="/informasi" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600">
            {t("cta_schedule")} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {schedules.slice(0, 3).map((s) => (
            <Card key={s.id} className="w-[84%] shrink-0 snap-center overflow-hidden sm:w-auto">
              <div className="flex h-36 items-center justify-center bg-sand p-6">
                <img src={s.image} alt={pick(s.title_id, s.title_en)} className="max-h-full w-auto object-contain" />
              </div>
              <CardContent className="pt-5">
                <Badge>{pick(s.badge_id, s.badge_en)}</Badge>
                <h3 className="mt-2 text-lg font-bold text-navy-900">
                  {pick(s.title_id, s.title_en)}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                  {pick(s.body_id, s.body_en)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* visi misi strip */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-navy-900 p-7 text-white sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-500">
              <Eye size={15} /> Visi
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-200">
              {pick(settings.vision_id, settings.vision_en)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              <Target size={15} /> Misi
            </p>
            <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-slate-700">
              {mission.map((m, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* galeri */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow={lang === "en" ? "Gallery" : "Galeri"}
            title={lang === "en" ? "Field & classroom moments" : "Momen lapangan & kelas"}
          />
          <Link href="/galeri" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600">
            {lang === "en" ? "All photos" : "Semua foto"} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {gallery.slice(0, 6).map((g) => (
            <img
              key={g.id}
              src={g.image}
              alt={g.title}
              loading="lazy"
              className="h-60 w-auto shrink-0 snap-center rounded-xl border border-slate-200 object-cover sm:h-72 lg:h-auto lg:w-full"
            />
          ))}
        </div>
      </section>

      {/* klien */}
      <section className="mt-20 border-y border-slate-200 bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow={lang === "en" ? "Our clients" : "Klien Kami"}
            title={
              lang === "en"
                ? "Trusted by oil & gas and drilling companies"
                : "Dipercaya perusahaan migas & drilling ternama"
            }
            desc={pick(
              `${clients.length} perusahaan telah mempercayakan training dan sertifikasi karyawannya kepada kami — dari kontraktor drilling hingga jasa ladang minyak.`,
              `${clients.length} companies have entrusted their employee training and certification to us — from drilling contractors to oilfield services.`
            )}
          />
          <div className="marquee-mask mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max items-stretch gap-4">
              {[...clients, ...clients].map((c, i) => (
                <figure
                  key={c.id + i}
                  className="flex w-44 shrink-0 flex-col items-center rounded-xl bg-white p-4 sm:w-52"
                >
                  <span className="flex h-16 w-full items-center justify-center sm:h-20">
                    <img
                      src={c.logo}
                      alt={c.name}
                      title={c.name}
                      loading="lazy"
                      className="max-h-full w-auto max-w-full object-contain"
                    />
                  </span>
                  <figcaption className="mt-2.5 line-clamp-2 text-center text-xs font-bold leading-snug text-navy-900">
                    {c.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/klien"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {lang === "en" ? "See all clients" : "Lihat semua klien"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* kontak */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow={lang === "en" ? "Contact" : "Kontak"}
              title={lang === "en" ? "Let's discuss your training needs" : "Diskusikan kebutuhan training Anda"}
              desc={pick(
                "Hubungi kami untuk informasi jadwal, biaya, dan pendaftaran sertifikasi.",
                "Contact us for schedules, pricing, and certification registration."
              )}
            />
            <ul className="mt-6 space-y-4 text-[15px]">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>{settings.phones}</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>{settings.email}</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={settings.maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-sand"
              >
                {lang === "en" ? "Open Maps" : "Buka Maps"}
              </a>
              {schedules.find((s) => s.pdf_url) && (
                <a
                  href={schedules.find((s) => s.pdf_url)!.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-sand"
                >
                  <FileText size={15} />
                  {lang === "en" ? "Latest schedule (PDF)" : "Jadwal terbaru (PDF)"}
                </a>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-sand p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900">
              <CalendarDays size={18} className="text-brand-600" />
              {lang === "en" ? "Send a message" : "Kirim Pesan"}
            </h3>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
