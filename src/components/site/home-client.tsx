"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { submitMessage } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { cn, waLink } from "@/lib/utils";

export function HeroCarousel({
  slides,
  tagline,
  title,
  text,
  whatsapp,
}: {
  slides: string[];
  tagline: string;
  title: string;
  text: string;
  whatsapp: string;
}) {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % Math.max(slides.length, 1)),
      5000
    );
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-navy-950 lg:min-h-[92vh]">
      {slides.map((s, i) => (
        <div
          key={s + i}
          className={cn("hero-slide", i === idx && "active")}
          style={{ backgroundImage: `url('${s}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/20" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Badge variant="accent" className="bg-accent-500/15 text-accent-500 ring-accent-500/40">
            {tagline}
          </Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-[56px]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            {text}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/layanan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-[15px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {t("cta_services")} <ArrowRight size={17} />
            </Link>
            <a
              href={waLink(
                whatsapp,
                "Hi Faqib Surya Perkasa, saya ingin konsultasi tentang Pelatihan & Sertifikasi. Terima kasih."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-[15px] font-bold text-white transition hover:bg-white/10"
            >
              {t("cta_wa")}
            </a>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s + i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ContactForm() {
  const { lang } = useLang();
  const [state, setState] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const res = await submitMessage(new FormData(e.currentTarget));
        setState(res);
        setPending(false);
        if (res.ok) (e.target as HTMLFormElement).reset();
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="cf-name" className="mb-1.5 block text-[13px] font-semibold text-navy-900">
          {lang === "en" ? "Full name" : "Nama Lengkap"}
        </label>
        <Input id="cf-name" name="name" required placeholder="Nama Anda" />
      </div>
      <div>
        <label htmlFor="cf-email" className="mb-1.5 block text-[13px] font-semibold text-navy-900">
          Email
        </label>
        <Input id="cf-email" name="email" type="email" required placeholder="nama@email.com" />
      </div>
      <div>
        <label htmlFor="cf-msg" className="mb-1.5 block text-[13px] font-semibold text-navy-900">
          {lang === "en" ? "Message" : "Pesan"}
        </label>
        <Textarea
          id="cf-msg"
          name="message"
          required
          placeholder={lang === "en" ? "How can we help?" : "Apa yang bisa kami bantu?"}
        />
      </div>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      {state?.ok && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {lang === "en" ? "Message sent. We will contact you soon." : "Pesan terkirim. Kami akan segera menghubungi Anda."}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        <Send size={15} /> {pending ? "..." : lang === "en" ? "Send Message" : "Kirim Pesan"}
      </Button>
    </form>
  );
}
