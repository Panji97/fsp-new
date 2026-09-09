"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Globe, ChevronRight, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn, waLink } from "@/lib/utils";

const links = [
  { href: "/", key: "nav_home" },
  { href: "/tentang", key: "nav_about" },
  { href: "/layanan", key: "nav_services" },
  { href: "/informasi", key: "nav_info" },
  { href: "/galeri", key: "nav_gallery" },
  { href: "/klien", key: "nav_clients" },
  { href: "/kontak", key: "nav_contact" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wa = waLink(
    whatsapp,
    lang === "en"
      ? "Hi Faqib Surya Perkasa, I would like to consult about Training & Certification. Thank you."
      : "Hi Faqib Surya Perkasa, saya ingin konsultasi tentang Pelatihan & Sertifikasi. Terima kasih."
  );
  if (pathname?.startsWith("/admin")) return null;

  // tutup menu saat pindah halaman + tombol Escape
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow",
        open ? "border-slate-200 shadow-lg" : "border-slate-200/80"
      )}
    >
      <a href="#konten" className="skip-link">
        Lewati ke konten
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-[72px]">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="Beranda PT Faqib Surya Perkasa"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/new-logo.png"
            alt="Logo PT Faqib Surya Perkasa"
            className="h-10 w-auto object-contain sm:h-11 lg:h-12"
          />
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Navigasi utama"
        >
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "link-underline text-sm font-semibold",
                  active
                    ? "text-brand-600"
                    : "text-navy-900/80 hover:text-navy-900"
                )}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 px-3 text-xs font-bold text-navy-900 transition hover:border-navy-900 hover:bg-sand"
            aria-label="Ganti bahasa / Switch language"
          >
            <Globe size={14} />
            {lang === "id" ? "ID | EN" : "EN | ID"}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 items-center gap-1.5 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-800 md:inline-flex"
          >
            <Phone size={15} />
            {t("cta_contact")}
          </a>
          <button
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition lg:hidden",
              open
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-slate-300 text-navy-900 hover:bg-sand"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* panel menu mobile */}
      <div
        className={cn(
          "grid overflow-hidden border-slate-200 bg-white transition-all duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        )}
      >
        <nav
          className="min-h-0 overflow-hidden"
          aria-label="Navigasi seluler"
          aria-hidden={!open}
        >
          <ul className="space-y-1 px-4 py-4 sm:px-6">
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold transition",
                      active
                        ? "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20"
                        : "text-navy-900 hover:bg-sand active:bg-sand"
                    )}
                  >
                    <span className="flex items-center">
                      {t(l.key)}
                    </span>
                    <ChevronRight
                      size={17}
                      className={active ? "text-brand-600" : "text-slate-300"}
                    />
                  </Link>
                </li>
              );
            })}
            <li className="pt-3">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-navy-900 text-[15px] font-bold text-white transition hover:bg-navy-800 active:scale-[0.99]"
              >
                <Phone size={16} />
                {t("cta_contact")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
