import { getDb, getSettings, serviceWithItems } from "@/lib/db";
import { HomeContent } from "@/components/site/home-content";

export const dynamic = "force-dynamic";

export default function Home() {
  const db = getDb();
  const settings = getSettings();
  const categories = db
    .prepare("SELECT * FROM service_categories ORDER BY sort, title_id")
    .all() as import("@/lib/db").ServiceCategory[];
  const svcRows = db
    .prepare("SELECT * FROM services ORDER BY sort")
    .all() as import("@/lib/db").Service[];
  const counts: Record<string, number> = {};
  for (const s of svcRows) counts[s.category_id] = (counts[s.category_id] || 0) + 1;
  const schedules = db
    .prepare("SELECT * FROM schedules WHERE is_active=1 ORDER BY sort")
    .all() as import("@/lib/db").Schedule[];
  const gallery = db
    .prepare("SELECT * FROM gallery ORDER BY sort LIMIT 6")
    .all() as import("@/lib/db").GalleryItem[];
  const clients = db
    .prepare("SELECT * FROM clients ORDER BY sort")
    .all() as import("@/lib/db").Client[];
  void serviceWithItems;

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
