import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { saveSettings } from "@/lib/actions";
import { AdminTitle } from "@/components/admin/controls";
import { CrudForm } from "@/components/admin/crud-form";
import { Input, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function Field({ label, name, value, textarea, rows }: { label: string; name: string; value: string; textarea?: boolean; rows?: number }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-[13px] font-bold text-navy-900">{label}</label>
      {textarea ? (
        <Textarea name={name} defaultValue={value} rows={rows || 3} />
      ) : (
        <Input name={name} defaultValue={value} />
      )}
    </div>
  );
}

export default async function AdminPengaturan() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const s = await getSettings();
  const slides: string[] = JSON.parse(s.hero_slides || "[]");

  return (
    <div>
      <AdminTitle title="Pengaturan" desc="Identitas perusahaan & konten utama website (bilingual ID/EN)." />
      <CrudForm action={saveSettings} className="grid gap-4 lg:grid-cols-2" success="Pengaturan tersimpan.">
        <Card>
          <CardHeader><CardTitle className="text-base">Identitas & Kontak</CardTitle></CardHeader>
          <CardContent>
            <Field label="Nama perusahaan" name="company_name" value={s.company_name} />
            <Field label="Tagline" name="tagline" value={s.tagline} />
            <Field label="Alamat" name="address" value={s.address} textarea />
            <Field label="Telepon" name="phones" value={s.phones} />
            <Field label="Email" name="email" value={s.email} />
            <Field label="Nomor WhatsApp (format 628xx)" name="whatsapp" value={s.whatsapp} />
            <Field label="URL Google Maps" name="maps_url" value={s.maps_url} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Hero (ID / EN)</CardTitle></CardHeader>
            <CardContent>
              <Field label="Judul hero (ID)" name="hero_title_id" value={s.hero_title_id} textarea />
              <Field label="Judul hero (EN)" name="hero_title_en" value={s.hero_title_en} textarea />
              <Field label="Teks hero (ID)" name="hero_text_id" value={s.hero_text_id} textarea rows={4} />
              <Field label="Teks hero (EN)" name="hero_text_en" value={s.hero_text_en} textarea rows={4} />
              <div className="mb-4">
                <label className="mb-1 block text-[13px] font-bold text-navy-900">Slide hero — 1 path per baris</label>
                <Textarea name="hero_slides" defaultValue={slides.join("\n")} rows={4} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Tentang, Visi & Misi (ID / EN)</CardTitle></CardHeader>
            <CardContent>
              <Field label="Tentang (ID)" name="about_id" value={s.about_id} textarea rows={4} />
              <Field label="Tentang (EN)" name="about_en" value={s.about_en} textarea rows={4} />
              <Field label="Visi (ID)" name="vision_id" value={s.vision_id} textarea />
              <Field label="Visi (EN)" name="vision_en" value={s.vision_en} textarea />
              <p className="mb-4 rounded-lg bg-sand p-3 text-xs text-slate-600">
                Misi & statistik saat ini dikelola via database (tabel site_settings: mission_id, mission_en, stats). Hubungi developer untuk mengubahnya, atau saya tambahkan editornya bila dibutuhkan.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Button type="submit">Simpan semua pengaturan</Button>
        </div>
      </CrudForm>
    </div>
  );
}
