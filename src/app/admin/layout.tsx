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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-6">
        <aside className="no-scrollbar -mx-4 mb-4 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:h-fit lg:overflow-visible lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:p-2 lg:px-2">
          <nav className="flex gap-1.5 pb-1 lg:grid lg:pb-0" aria-label="Menu admin">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-bold text-slate-700 shadow-sm hover:bg-sand lg:rounded-lg lg:border-0 lg:bg-transparent lg:px-3 lg:py-2.5 lg:text-sm lg:font-semibold lg:shadow-none"
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
