import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toast";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getSettings } from "@/lib/db";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PT Faqib Surya Perkasa — Training & Sertifikasi Profesional",
    template: "%s · PT Faqib Surya Perkasa",
  },
  description:
    "Penyelenggara training profesional dan sertifikasi BNSP, KEMNAKER, PPSDM Migas, dan IADC di bidang migas, konstruksi, dan pertambangan. Berbasis di Pekanbaru.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-800 antialiased">
        <LanguageProvider>
          <SiteHeader whatsapp={settings.whatsapp || "6281266517373"} />
          <main id="konten" className="flex-1 pt-16 lg:pt-[72px]">
            {children}
          </main>
          <SiteFooter settings={settings} />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
