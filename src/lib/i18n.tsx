"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "id" | "en";

const dict = {
  nav_home: { id: "Beranda", en: "Home" },
  nav_about: { id: "Tentang", en: "About" },
  nav_services: { id: "Layanan Kami", en: "Our Services" },
  nav_info: { id: "Informasi", en: "Information" },
  nav_gallery: { id: "Galeri", en: "Gallery" },
  nav_contact: { id: "Kontak", en: "Contact" },
  nav_clients: { id: "Klien Kami", en: "Our Clients" },
  cta_services: { id: "Jelajahi Layanan", en: "Explore Services" },
  cta_contact: { id: "Hubungi Kami", en: "Contact Us" },
  cta_schedule: { id: "Lihat Jadwal", en: "View Schedule" },
  cta_wa: { id: "Konsultasi via WhatsApp", en: "Consult via WhatsApp" },
} as const;

export type DictKey = keyof typeof dict;

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
  pick: (id: string, en: string) => string;
};

const Ctx = createContext<LangCtx>({
  lang: "id",
  setLang: () => {},
  t: (k) => dict[k].id,
  pick: (id) => id,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const saved = document.cookie.match(/(?:^|; )fsp_lang=(id|en)/);
    if (saved) setLangState(saved[1] as Lang);
    else {
      const nav = navigator.language.toLowerCase();
      if (nav.startsWith("en")) setLangState("en");
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `fsp_lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const t = useCallback(
    (k: DictKey) => (lang === "en" ? dict[k].en : dict[k].id),
    [lang]
  );
  const pick = useCallback(
    (id: string, en: string) => (lang === "en" && en ? en : id),
    [lang]
  );

  return (
    <Ctx.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}
