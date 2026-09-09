import { countTable, initDb, isRemoteDb } from "@/lib/db";

async function main() {
  console.log(`Backend: ${isRemoteDb() ? "Turso remote" : "SQLite lokal (file:./fsp.db)"}`);
  await initDb();
  for (const t of [
    "service_categories",
    "services",
    "schedules",
    "gallery",
    "clients",
    "messages",
  ]) {
    console.log(`${t}: ${await countTable(t)}`);
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);
