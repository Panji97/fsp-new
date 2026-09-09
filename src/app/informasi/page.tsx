import { getSchedules } from "@/lib/db";
import { InformasiContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Informasi Jadwal" };

export default async function InformasiPage() {
  const schedules = await getSchedules(true);
  return <InformasiContent schedules={schedules} />;
}
