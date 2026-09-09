import Link from "next/link";
import {
  LayoutDashboard,
  Layers,
  CalendarDays,
  Image as ImageIcon,
  Building2,
  Inbox,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { adminLogout } from "@/lib/actions";

const menu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/layanan", label: "Layanan", icon: Layers },
  { href: "/admin/informasi", label: "Jadwal & Info", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/admin/klien", label: "Klien", icon: Building2 },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: Inbox },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-navy-950 text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img src="/images/new-logo.png" alt="FSP" className="h-8 w-auto rounded bg-white p-0.5" />
            <span className="text-sm font-bold">FSP Admin</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:block">{user}</span>
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 px-3 text-[13px] font-semibold hover:bg-white/10"
            >
              <Globe size={14} /> Situs
            </Link>
            <form action={adminLogout}>
              <button className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 text-[13px] font-semibold hover:bg-white/20">
                <LogOut size={14} /> Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 lg:sticky lg:top-20">
          <nav className="grid gap-1 lg:block">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-sand"
              >
                <m.icon size={17} className="text-brand-600" />
                {m.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
