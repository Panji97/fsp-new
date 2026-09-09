import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Layers,
  CalendarDays,
  Image as ImageIcon,
  Building2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const db = getDb();
  const count = (t: string) =>
    (db.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get() as { c: number }).c;
  const unread = (
    db.prepare("SELECT COUNT(*) AS c FROM messages WHERE is_read=0").get() as { c: number }
  ).c;
  const recent = db
    .prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 5")
    .all() as import("@/lib/db").Message[];

  const cards = [
    { href: "/admin/layanan", icon: Layers, label: "Kategori & Skema Layanan", value: `${count("service_categories")} kategori · ${count("services")} kelompok` },
    { href: "/admin/informasi", icon: CalendarDays, label: "Jadwal & Informasi", value: `${count("schedules")} kartu jadwal` },
    { href: "/admin/galeri", icon: ImageIcon, label: "Galeri", value: `${count("gallery")} foto` },
    { href: "/admin/klien", icon: Building2, label: "Klien", value: `${count("clients")} logo` },
    { href: "/admin/pesan", icon: Inbox, label: "Pesan Masuk", value: `${unread} belum dibaca` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Selamat datang, <b>{user}</b>. Kelola seluruh konten website dari sini.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <c.icon size={21} />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-navy-900">{c.label}</span>
                  <span className="text-sm text-slate-500">{c.value}</span>
                </span>
                <ArrowRight size={17} className="text-slate-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pesan terbaru
            {unread > 0 && <Badge variant="accent">{unread} baru</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!recent.length ? (
            <p className="text-sm text-slate-500">Belum ada pesan.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>
                    <b className="text-navy-900">{m.name}</b>
                    <span className="text-slate-500"> — {m.message.slice(0, 60)}{m.message.length > 60 ? "…" : ""}</span>
                  </span>
                  {!m.is_read && <Badge variant="accent">baru</Badge>}
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/pesan" className="mt-3 inline-block text-sm font-bold text-brand-600">
            Buka inbox →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
