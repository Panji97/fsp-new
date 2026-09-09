import { getDb, getSettings } from "@/lib/db";
import { KlienContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Klien Kami" };

export default function KlienPage() {
  const db = getDb();
  const clients = db
    .prepare("SELECT * FROM clients ORDER BY sort")
    .all() as import("@/lib/db").Client[];
  const settings = getSettings();
  return <KlienContent clients={clients} whatsapp={settings.whatsapp} />;
}
