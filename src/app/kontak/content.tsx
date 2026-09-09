"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero, SectionHeading } from "@/components/site/sections";
import { ContactForm } from "@/components/site/home-client";

export function KontakContent({ settings }: { settings: Record<string, string> }) {
  const { lang } = useLang();
  return (
    <>
      <PageHero
        title={lang === "en" ? "Contact Us" : "Kontak Kami"}
        desc={lang === "en" ? "We reply on working days, 08.00–17.00 WIB." : "Kami merespons pada hari kerja, 08.00–17.00 WIB."}
        image="/images/5.jpg"
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-12 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={lang === "en" ? "Contact info" : "Informasi Kontak"}
            title={lang === "en" ? "Visit or call us" : "Kunjungi atau hubungi kami"}
          />
          <ul className="mt-6 space-y-5">
            {[
              { icon: MapPin, h: "Alamat", v: settings.address },
              { icon: Phone, h: "Telepon", v: settings.phones },
              { icon: Mail, h: "Email", v: settings.email },
            ].map((c) => (
              <li key={c.h} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <c.icon size={20} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-navy-900">{c.h}</span>
                  <span className="mt-0.5 block text-[15px] text-slate-700">{c.v}</span>
                </span>
              </li>
            ))}
          </ul>
          <a
            href={settings.maps_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-11 items-center rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            {lang === "en" ? "Open in Google Maps" : "Buka di Google Maps"}
          </a>
        </div>
        <div className="h-fit rounded-2xl border border-slate-200 bg-sand p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900">
            {lang === "en" ? "Send a message" : "Kirim Pesan"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {lang === "en" ? "Messages are stored and can be read in the admin inbox." : "Pesan tersimpan dan bisa dibaca di inbox admin."}
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </section>
      <div className="h-4" />
    </>
  );
}
