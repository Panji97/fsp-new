import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveClient, deleteClient } from "@/lib/actions";
import { AdminTitle, DeleteButton, Toggle } from "@/components/admin/controls";
import { CrudForm } from "@/components/admin/crud-form";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminKlien() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getDb();
  const rows = db.prepare("SELECT * FROM clients ORDER BY sort").all() as import("@/lib/db").Client[];

  return (
    <div>
      <AdminTitle title="Klien" desc="Logo perusahaan yang tampil di marquee halaman utama." />
      <Toggle label="+ Tambah klien">
        <CrudForm action={saveClient} className="grid gap-1 sm:grid-cols-3">
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Nama perusahaan</label><Input name="name" required /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Logo</label><UploadField name="logo" required /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={rows.length} /></div>
          <div className="sm:col-span-3"><Button type="submit" size="sm">Simpan</Button></div>
        </CrudForm>
      </Toggle>
      <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {rows.map((c) => (
          <li key={c.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
            <img src={c.logo} alt={c.name} className="h-12 w-auto max-w-[160px] rounded border border-slate-200 object-contain p-1" loading="lazy" />
            <CrudForm action={saveClient} className="flex flex-1 flex-col gap-2 sm:flex-row">
              <input type="hidden" name="id" value={c.id} />
              <Input name="name" defaultValue={c.name} required className="flex-1" />
              <UploadField name="logo" defaultValue={c.logo} required className="flex-1" />
              <Input name="sort" type="number" defaultValue={c.sort} className="w-20" />
              <Button type="submit" size="sm" variant="outline">Simpan</Button>
            </CrudForm>
            <DeleteButton id={c.id} action={deleteClient} name={c.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
