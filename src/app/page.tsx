import { getCategories, getClients, getGallery, getSchedules, getServices, getSettings } from "@/lib/db";
import { HomeContent } from "@/components/site/home-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSettings();
  const categories = await getCategories();
  const svcRows = await getServices();
  const counts: Record<string, number> = {};
  for (const s of svcRows) counts[s.category_id] = (counts[s.category_id] || 0) + 1;
  const schedules = await getSchedules(true);
  const gallery = (await getGallery()).slice(0, 6);
  const clients = await getClients();

  return (
    <HomeContent
      settings={settings}
      categories={categories}
      counts={counts}
      schedules={schedules}
      gallery={gallery}
      clients={clients}
    />
  );
}
