import { getDb, serviceWithItems } from "@/lib/db";
import { LayananContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Layanan Kami" };

export default function LayananPage() {
  const db = getDb();
  const categories = db
    .prepare("SELECT * FROM service_categories ORDER BY sort, title_id")
    .all() as import("@/lib/db").ServiceCategory[];
  const rows = db
    .prepare("SELECT * FROM services ORDER BY sort")
    .all() as import("@/lib/db").Service[];
  const groups = rows.map((r) => {
    const w = serviceWithItems(r);
    return {
      id: w.id,
      category_id: w.category_id,
      title_id: w.title_id,
      title_en: w.title_en,
      list_id: w.list_id,
      list_en: w.list_en,
    };
  });
  return <LayananContent categories={categories} groups={groups} />;
}
