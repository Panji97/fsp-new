import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveGallery, deleteGallery } from "@/lib/actions";
import { AdminTitle, DeleteButton, Toggle } from "@/components/admin/controls";
import { Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminGaleri() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getDb();
  const rows = db.prepare("SELECT * FROM gallery ORDER BY sort").all() as import("@/lib/db").GalleryItem[];

  return (
    <div>
      <AdminTitle title="Galeri" desc="Foto di /galeri. Simpan file baru ke folder public/images lalu isi path-nya di sini." />
      <Toggle label="+ Tambah foto">
        <form action={saveGallery} className="grid gap-1 sm:grid-cols-2">
          <div className="mb-3 sm:col-span-2"><label className="mb-1 block text-xs font-bold">Path gambar (mis. /images/m.jpeg)</label><Input name="image" required /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Judul</label><Input name="title" /></div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Kategori</label>
            <select name="category" className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm">
              <option value="training">Training</option>
              <option value="events">Company Events</option>
            </select>
          </div>
          <div className="mb-3"><label className="mb-1 block text-xs font-bold">Urutan</label><Input name="sort" type="number" defaultValue={rows.length} /></div>
          <div className="sm:col-span-2"><Button type="submit" size="sm">Simpan</Button></div>
        </form>
      </Toggle>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((g) => (
          <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <img src={g.image} alt={g.title} className="aspect-video w-full rounded-lg object-cover" loading="lazy" />
            <form action={saveGallery} className="mt-2 flex flex-col gap-2">
              <input type="hidden" name="id" value={g.id} />
              <Input name="image" defaultValue={g.image} required />
              <div className="flex gap-2">
                <Input name="title" defaultValue={g.title} placeholder="Judul" />
                <select name="category" defaultValue={g.category} className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm">
                  <option value="training">Training</option>
                  <option value="events">Events</option>
                </select>
                <Input name="sort" type="number" defaultValue={g.sort} className="w-16" />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" size="sm" variant="outline">Simpan</Button>
                <DeleteButton id={g.id} action={deleteGallery} name={g.title} />
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
