import { getCategories, getServices, serviceWithItems } from "@/lib/db";
import { LayananContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Layanan Kami" };

export default async function LayananPage() {
  const categories = await getCategories();
  const rows = await getServices();
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
