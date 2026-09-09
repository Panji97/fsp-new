import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveCategory, deleteCategory, saveService, deleteService } from "@/lib/actions";
import { AdminTitle, DeleteButton, Toggle } from "@/components/admin/controls";
import { CrudForm } from "@/components/admin/crud-form";
import { UploadField } from "@/components/admin/upload-field";
import { Input, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const inputCls = "mb-3";

export default async function AdminLayanan() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getDb();
  const cats = db.prepare("SELECT * FROM service_categories ORDER BY sort").all() as import("@/lib/db").ServiceCategory[];
  const svcs = db.prepare("SELECT * FROM services ORDER BY category_id, sort").all() as import("@/lib/db").Service[];

  return (
    <div>
      <AdminTitle title="Layanan" desc="Kelola kategori sertifikasi & kelompok skema. Perubahan langsung tampil di /layanan." />

      <Toggle label="+ Tambah kategori baru">
        <CrudForm action={saveCategory} className="grid gap-1 sm:grid-cols-2">
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Slug (unik, mis. bnsp)</label><Input name="slug" required /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Logo</label><UploadField name="logo" /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (ID)</label><Input name="title_id" required /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (EN)</label><Input name="title_en" /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Deskripsi (ID)</label><Textarea name="description_id" /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Deskripsi (EN)</label><Textarea name="description_en" /></div>
          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={cats.length + 1} /></div>
          <div className="sm:col-span-2"><Button type="submit" size="sm">Simpan kategori</Button></div>
        </CrudForm>
      </Toggle>

      <div className="mt-4 space-y-4">
        {cats.map((c) => {
          const items = svcs.filter((s) => s.category_id === c.id);
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                  {c.title_id}
                  <Badge>{items.length} kelompok</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CrudForm action={saveCategory} className="grid gap-1 rounded-lg bg-sand p-4 sm:grid-cols-2">
                  <input type="hidden" name="id" value={c.id} />
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Slug</label><Input name="slug" defaultValue={c.slug} required /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Logo</label><UploadField name="logo" defaultValue={c.logo} /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (ID)</label><Input name="title_id" defaultValue={c.title_id} required /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (EN)</label><Input name="title_en" defaultValue={c.title_en} /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Deskripsi (ID)</label><Textarea name="description_id" defaultValue={c.description_id} /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Deskripsi (EN)</label><Textarea name="description_en" defaultValue={c.description_en} /></div>
                  <div className={inputCls}><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={c.sort} /></div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Button type="submit" size="sm">Simpan</Button>
                    <DeleteButton id={c.id} action={deleteCategory} name={c.title_id} />
                  </div>
                </CrudForm>

                <div>
                  <p className="mb-2 text-[13px] font-bold text-slate-600">KELOMPOK SKEMA</p>
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {items.map((s) => (
                      <li key={s.id} className="p-3">
                        <CrudForm action={saveService} className="grid gap-1 sm:grid-cols-2">
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="category_id" value={c.id} />
                          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (ID)</label><Input name="title_id" defaultValue={s.title_id} required /></div>
                          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Judul (EN)</label><Input name="title_en" defaultValue={s.title_en} /></div>
                          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Item skema (ID) — 1 per baris</label><Textarea name="items_id" defaultValue={JSON.parse(s.items_id || "[]").join("\n")} rows={3} /></div>
                          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Item skema (EN) — kosongkan = sama</label><Textarea name="items_en" defaultValue={JSON.parse(s.items_en || "[]").join("\n")} rows={3} /></div>
                          <div className={inputCls}><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={s.sort} /></div>
                          <div className="flex items-center gap-3">
                            <Button type="submit" size="sm" variant="outline">Simpan</Button>
                            <DeleteButton id={s.id} action={deleteService} name={s.title_id} />
                          </div>
                        </CrudForm>
                      </li>
                    ))}
                  </ul>
                  <CrudForm action={saveService} className="mt-2 flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 p-3 sm:flex-row">
                    <input type="hidden" name="category_id" value={c.id} />
                    <Input name="title_id" placeholder="Judul kelompok baru (ID)" required className="flex-1" />
                    <Input name="title_en" placeholder="Judul (EN)" className="flex-1" />
                    <Button type="submit" size="sm">+ Tambah</Button>
                  </CrudForm>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
