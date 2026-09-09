import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getMessages } from "@/lib/db";
import { AdminTitle } from "@/components/admin/controls";
import { MessageButtons } from "@/components/admin/message-buttons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPesan() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const rows = await getMessages();

  return (
    <div>
      <AdminTitle title="Pesan Masuk" desc="Pesan dari formulir kontak website." />
      {!rows.length ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Belum ada pesan.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-xl border bg-white p-4",
                m.is_read ? "border-slate-200" : "border-brand-600/40 ring-1 ring-brand-600/20"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">
                  <b className="text-navy-900">{m.name}</b>
                  <span className="text-slate-500"> · {m.email}</span>
                </p>
                <span className="flex items-center gap-2">
                  {!m.is_read && <Badge variant="accent">baru</Badge>}
                  <span className="text-xs text-slate-400">
                    {new Date(m.created_at).toLocaleString("id-ID")}
                  </span>
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[15px] text-slate-700">{m.message}</p>
              <div className="mt-3">
                <MessageButtons id={m.id} read={!!m.is_read} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
