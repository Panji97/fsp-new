"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/utils";

export function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const { t, pick, lang } = useLang();
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const wa = waLink(
    settings.whatsapp || "6281266517373",
    lang === "en"
      ? "Hi Faqib Surya Perkasa, I would like to consult about Training & Certification. Thank you."
      : "Hi Faqib Surya Perkasa, saya ingin konsultasi tentang Pelatihan & Sertifikasi. Terima kasih."
  );

  return (
    <>
      <footer className="mt-24 bg-navy-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/new-logo.png"
                alt="Logo FSP"
                className="h-12 w-auto rounded bg-white p-1"
              />
              <p className="text-xl font-extrabold tracking-tight text-white">
                {settings.company_name}
              </p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {pick(
                "Penyelenggara training profesional dan sertifikasi untuk meningkatkan kualitas SDM di bidang migas dan industri terkait.",
                "Professional training and certification provider improving human resource quality in oil & gas and related industries."
              )}
            </p>
            <p className="mt-3 text-sm font-semibold text-accent-500">
              {settings.tagline}
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/tentang", t("nav_about")],
                ["/layanan", t("nav_services")],
                ["/informasi", t("nav_info")],
                ["/galeri", t("nav_gallery")],
                ["/klien", t("nav_clients")],
                ["/kontak", t("nav_contact")],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {t("nav_contact")}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-500" />
                {settings.address}
              </li>
              <li className="flex gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent-500" />
                {settings.phones}
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent-500" />
                {settings.email}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>
              © {new Date().getFullYear()} {settings.company_name}. Pekanbaru,
              Indonesia.
            </span>
            <span>TUK — Tempat Uji Kompetensi berlisensi.</span>
          </div>
        </div>
      </footer>
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle size={26} />
      </a>
    </>
  );
}
