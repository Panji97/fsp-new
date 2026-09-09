import { getDb } from "@/lib/db";
import { InformasiContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Informasi Jadwal" };

export default function InformasiPage() {
  const db = getDb();
  const schedules = db
    .prepare("SELECT * FROM schedules WHERE is_active=1 ORDER BY sort")
    .all() as import("@/lib/db").Schedule[];
  return <InformasiContent schedules={schedules} />;
}
