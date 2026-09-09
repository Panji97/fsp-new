import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getSchedules } from "@/lib/db";
import { saveSchedule, deleteSchedule } from "@/lib/actions";
import { AdminTitle, DeleteButton, Toggle } from "@/components/admin/controls";
import { CrudForm } from "@/components/admin/crud-form";
import { UploadField } from "@/components/admin/upload-field";
import { Input, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminInformasi() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const rows = await getSchedules(false);

  return (
    <div>
      <AdminTitle title="Jadwal & Informasi" desc="Kartu jadwal yang tampil di halaman Informasi." />
      <Toggle label="+ Tambah kartu jadwal">
        <CrudForm action={saveSchedule} className="grid gap-1 sm:grid-cols-2">
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Judul (ID)</label><Input name="title_id" required /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Judul (EN)</label><Input name="title_en" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Deskripsi (ID)</label><Textarea name="body_id" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Deskripsi (EN)</label><Textarea name="body_en" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Gambar</label><UploadField name="image" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">File PDF jadwal</label><UploadField name="pdf_url" accept="application/pdf" emptyLabel="Ketuk untuk unggah PDF" hint="PDF — maks 5MB" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={rows.length + 1} /></div>
          <div className="mb-3 flex items-end gap-2 pb-1">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" /> Aktif</label>
          </div>
          <div className="sm:col-span-2"><Button type="submit" size="sm">Simpan</Button></div>
        </CrudForm>
      </Toggle>
      <div className="mt-4 grid gap-4">
        {rows.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-5">
              <CrudForm action={saveSchedule} className="grid gap-1 sm:grid-cols-2">
                <input type="hidden" name="id" value={s.id} />
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Judul (ID)</label><Input name="title_id" defaultValue={s.title_id} required /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Judul (EN)</label><Input name="title_en" defaultValue={s.title_en} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Deskripsi (ID)</label><Textarea name="body_id" defaultValue={s.body_id} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Deskripsi (EN)</label><Textarea name="body_en" defaultValue={s.body_en} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Badge (ID)</label><Input name="badge_id" defaultValue={s.badge_id} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Badge (EN)</label><Input name="badge_en" defaultValue={s.badge_en} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Gambar</label><UploadField name="image" defaultValue={s.image} /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">File PDF jadwal</label><UploadField name="pdf_url" defaultValue={s.pdf_url} accept="application/pdf" emptyLabel="Ketuk untuk unggah PDF" hint="PDF — maks 5MB" /></div>
                <div className="mb-3"><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={s.sort} /></div>
                <div className="mb-3 flex items-end gap-2 pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_active" defaultChecked={!!s.is_active} className="h-4 w-4" /> Aktif</label>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Button type="submit" size="sm">Simpan</Button>
                  <DeleteButton id={s.id} action={deleteSchedule} name={s.title_id} />
                </div>
              </CrudForm>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
