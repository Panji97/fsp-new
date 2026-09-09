import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/gif", "gif"],
  ["application/pdf", "pdf"],
]);

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let file: unknown;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Form tidak valid." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "Pilih file dulu." }, { status: 400 });

  const ext = ALLOWED.get(file.type);
  if (!ext)
    return NextResponse.json(
      { error: "Format harus gambar (JPG/PNG/WebP/AVIF/GIF) atau PDF." },
      { status: 400 }
    );
  if (file.size > MAX_BYTES)
    return NextResponse.json(
      { error: "Ukuran maksimal 5MB." },
      { status: 400 }
    );

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}` });
}
