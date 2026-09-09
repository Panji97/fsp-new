import { getSettings } from "@/lib/db";
import { KontakContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kontak" };

export default function KontakPage() {
  return <KontakContent settings={getSettings()} />;
}
