import { getGallery } from "@/lib/db";
import { GaleriContent } from "./content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri" };

export default async function GaleriPage() {
  const items = await getGallery();
  return <GaleriContent items={items} />;
}
