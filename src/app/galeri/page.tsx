import { getDb } from "@/lib/db";
import { GaleriContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri" };

export default function GaleriPage() {
  const db = getDb();
  const items = db
    .prepare("SELECT * FROM gallery ORDER BY sort")
    .all() as import("@/lib/db").GalleryItem[];
  return <GaleriContent items={items} />;
}
