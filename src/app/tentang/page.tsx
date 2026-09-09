import { getSettings } from "@/lib/db";
import { TentangContent } from "./content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tentang Kami" };

export default function TentangPage() {
  return <TentangContent settings={getSettings()} />;
}
