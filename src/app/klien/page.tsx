import { getClients, getSettings } from "@/lib/db";
import { KlienContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Klien Kami" };

export default async function KlienPage() {
  const clients = await getClients();
  const settings = await getSettings();
  return <KlienContent clients={clients} whatsapp={settings.whatsapp} />;
}
