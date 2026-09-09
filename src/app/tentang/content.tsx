"use client";

import { Building2, Eye, Target, BadgeCheck, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHero, SectionHeading } from "@/components/site/sections";

export function TentangContent({ settings }: { settings: Record<string, string> }) {
  const { pick, lang } = useLang();
  const mission: string[] = JSON.parse(
    (lang === "en" ? settings.mission_en : settings.mission_id) || "[]"
  );
  return (
    <>
      <PageHero
        title={lang === "en" ? "About Faqib Surya Perkasa" : "Tentang Faqib Surya Perkasa"}
        desc={pick(
          "Berdiri sejak 2018 di Pekanbaru — partner training & sertifikasi untuk industri migas, konstruksi, dan pertambangan.",
          "Established in 2018 in Pekanbaru — your training & certification partner for oil & gas, construction, and mining."
        )}
        image="/images/5.jpg"
      />
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow={lang === "en" ? "Profile" : "Profil"}
              title={settings.company_name}
            />
            <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
              {pick(settings.about_id, settings.about_en)}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
              {pick(
                "Dengan menjalin komunikasi dan hubungan yang harmonis, kami menjadi partner yang tepat dalam memberikan layanan terbaik — mengakomodasi kebutuhan perkembangan karier SDM perusahaan sehingga meningkatkan benefit perusahaan dan value bagi customer.",
                "Through harmonious communication and relationships, we are the right partner in delivering the best services — accommodating corporate HR career development needs to increase company benefits and customer value."
              )}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { icon: Building2, v: "2018", l: lang === "en" ? "Established" : "Berdiri" },
                { icon: BadgeCheck, v: "TUK", l: lang === "en" ? "Licensed test center" : "Tempat Uji Kompetensi" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-slate-200 bg-sand p-4 text-center">
                  <s.icon size={20} className="mx-auto text-brand-600" />
                  <p className="mt-2 text-xl font-extrabold text-navy-900">{s.v}</p>
                  <p className="text-[13px] text-slate-600">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
            {["/images/a.jpeg", "/images/b.jpeg", "/images/c.jpeg", "/images/f.jpeg"].map((src) => (
              <img key={src} src={src} alt="Kegiatan FSP" loading="lazy" className="aspect-[4/3] w-[78%] shrink-0 snap-center rounded-xl border border-slate-200 object-cover sm:w-full" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-navy-900 p-7 text-white sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-500">
              <Eye size={15} /> Visi
            </p>
            <p className="mt-3 leading-relaxed text-slate-200">{pick(settings.vision_id, settings.vision_en)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              <Target size={15} /> Misi
            </p>
            <ul className="mt-3 space-y-2.5 leading-relaxed text-slate-700">
              {mission.map((m, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-sand p-6">
          <MapPin size={20} className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-bold text-navy-900">{lang === "en" ? "Head office" : "Kantor pusat"}</p>
            <p className="mt-1 text-[15px] text-slate-700">{settings.address}</p>
            <p className="mt-1 text-[15px] text-slate-700">{settings.phones} · {settings.email}</p>
          </div>
        </div>
      </section>
    </>
  );
}
