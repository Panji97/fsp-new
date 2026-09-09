import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Cek cepat konfigurasi DB deployment (tanpa membocorkan kredensial).
// Buka https://<domain-kamu>/api/health -> {"ok":true,"backend":"turso"}
export async function GET() {
  try {
    const { initDb, isRemoteDb } = await import("@/lib/db");
    await initDb();
    return NextResponse.json({
      ok: true,
      backend: isRemoteDb() ? "turso" : "sqlite-local",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
