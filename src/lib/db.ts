// Lapisan data FSP — pola yang sama dengan project blog:
// satu client @libsql/client untuk lokal (file:./fsp.db) maupun
// Turso remote (libsql://... + TURSO_AUTH_TOKEN). Tanpa branching kode.
import { createClient, type Client as LibsqlClient, type Row } from "@libsql/client";
import { uid } from "./utils";

export type ServiceCategory = {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  logo: string;
  sort: number;
};

export type Service = {
  id: string;
  category_id: string;
  title_id: string;
  title_en: string;
  items_id: string;
  items_en: string;
  sort: number;
};

export type Schedule = {
  id: string;
  title_id: string;
  title_en: string;
  body_id: string;
  body_en: string;
  badge_id: string;
  badge_en: string;
  image: string;
  pdf_url: string;
  sort: number;
  is_active: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  sort: number;
};

export type Client = { id: string; name: string; logo: string; sort: number };

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: number;
};

/** Pilih URL DB yang valid. Abaikan nilai dengan skema tak didukung
 *  (mis. DATABASE_URL postgres:// dari integrasi lain) dan kupas tanda
 *  kutip yang tak sengaja ikut ter-copy dari file .env. */
function pickUrl(): string {
  const candidates = [process.env.TURSO_DATABASE_URL, process.env.DATABASE_URL];
  for (const raw of candidates) {
    if (!raw) continue;
    const u = raw.trim().replace(/^["']|["']$/g, "");
    if (/^(libsql|https?|wss?|file):\/\//.test(u)) return u;
  }
  return "file:./fsp.db";
}

const dbUrl = pickUrl();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim().replace(/^["']|["']$/g, "") || undefined;

declare global {
  var __fspClient: LibsqlClient | undefined;
  var __fspInit: Promise<void> | undefined;
}

function getClient(): LibsqlClient {
  if (!globalThis.__fspClient) {
    globalThis.__fspClient = createClient({ url: dbUrl, authToken });
  }
  return globalThis.__fspClient;
}

/** Baris libsql -> object (tahan terhadap format array maupun object). */
function toObjects<T>(columns: string[], rows: Row[]): T[] {
  return rows.map((r) => {
    if (Array.isArray(r)) {
      const o: Record<string, unknown> = {};
      columns.forEach((c, i) => (o[c] = r[i]));
      return o as T;
    }
    return r as unknown as T;
  });
}

async function all<T>(sql: string, args: unknown[] = []): Promise<T[]> {
  const c = getClient();
  const rs = await c.execute({ sql, args: args as never[] });
  return toObjects<T>(rs.columns, rs.rows);
}

async function run(sql: string, args: unknown[] = []): Promise<void> {
  await getClient().execute({ sql, args: args as never[] });
}

// ---------- skema + seed (sekali per proses) ----------
const DDL = [
  `CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS service_categories (
    id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE,
    title_id TEXT NOT NULL, title_en TEXT NOT NULL,
    description_id TEXT NOT NULL DEFAULT '', description_en TEXT NOT NULL DEFAULT '',
    logo TEXT NOT NULL DEFAULT '', sort INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    title_id TEXT NOT NULL, title_en TEXT NOT NULL,
    items_id TEXT NOT NULL DEFAULT '[]', items_en TEXT NOT NULL DEFAULT '[]',
    sort INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY, title_id TEXT NOT NULL, title_en TEXT NOT NULL,
    body_id TEXT NOT NULL DEFAULT '', body_en TEXT NOT NULL DEFAULT '',
    badge_id TEXT NOT NULL DEFAULT '', badge_en TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '', pdf_url TEXT NOT NULL DEFAULT '',
    sort INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'training',
    image TEXT NOT NULL DEFAULT '', sort INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY, name TEXT NOT NULL,
    logo TEXT NOT NULL DEFAULT '', sort INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
    message TEXT NOT NULL, created_at TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0
  )`,
];

const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: "PT Faqib Surya Perkasa",
  tagline: "Training with Purpose, Certifying with Integrity",
  hero_title_id:
    "Penyelenggara Training & Sertifikasi Profesional Migas, Konstruksi, dan Pertambangan",
  hero_title_en:
    "Professional Training & Certification Provider for Oil & Gas, Construction, and Mining",
  hero_text_id:
    "Bersama TUK PT Faqib Surya Perkasa, tingkatkan keterampilan dan kompetensi Anda di bidang migas, pertambangan, dan konstruksi. Pelatihan oleh pengajar berpengalaman untuk sertifikasi resmi BNSP, KEMNAKER, PPSDM Migas, dan IADC.",
  hero_text_en:
    "With TUK PT Faqib Surya Perkasa, advance your skills and competence in oil & gas, mining, and construction. Training by experienced instructors for official BNSP, KEMNAKER, PPSDM Migas, and IADC certification.",
  hero_slides: JSON.stringify(["/images/6.jpg", "/images/5.jpg", "/images/3.avif"]),
  about_id:
    "PT Faqib Surya Perkasa berdiri pada tahun 2018 dengan tujuan turut berkontribusi meningkatkan kualitas sumber daya manusia khususnya di dunia migas dan training lainnya — agar mampu membawa perubahan signifikan ke arah kemajuan dengan keunggulan kompetitif, performa kerja yang unggul dan optimal.",
  about_en:
    "PT Faqib Surya Perkasa was established in 2018 to help improve human resource quality, especially in oil & gas and other training fields — driving significant progress with competitive advantage and excellent, optimal work performance.",
  vision_id:
    "Menjadi penyelenggara training dan sertifikasi yang melayani secara profesional, dan berkomitmen dalam pengembangan sumber daya manusia sesuai kompetensi yang dimiliki serta memberikan kepuasan pelanggan.",
  vision_en:
    "To be a professional training and certification provider, committed to developing human resources according to their competence and delivering customer satisfaction.",
  mission_id: JSON.stringify([
    "Membangun komitmen yang kuat dengan memberikan layanan penyelenggaraan training dan sertifikasi yang terbaik.",
    "Menjadi partner terpercaya bagi perusahaan dan organisasi dalam mengembangkan sumber daya manusia.",
    "Menjadikan para peserta kompeten di bidang keahliannya.",
  ]),
  mission_en: JSON.stringify([
    "Build strong commitment by delivering the best training and certification services.",
    "Be a trusted partner for companies and organizations in developing human resources.",
    "Make every participant competent in their field of expertise.",
  ]),
  stats: JSON.stringify([
    { value: "2018", label_id: "Berdiri di Pekanbaru", label_en: "Established in Pekanbaru" },
    { value: "80+", label_id: "Skema sertifikasi", label_en: "Certification schemes" },
    { value: "5000+", label_id: "Peserta dilatih", label_en: "Participants trained" },
    { value: "15+", label_id: "Perusahaan klien", label_en: "Corporate clients" },
  ]),
  address: "Jl. Muslimin No.7B RT/RW 02/08 Soekarno Hatta, Pekanbaru",
  phones: "+62 812-6651-7373 / +62 821-7183-7099",
  email: "training-center@fsp.com",
  whatsapp: "6281266517373",
  maps_url: "https://maps.google.com/?q=Jl.+Muslimin+No.7B+Pekanbaru",
};

async function seed() {
  const c = getClient();
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    await c.execute({
      sql: "INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)",
      args: [k, v],
    });
  }

  const catCount = await c.execute("SELECT COUNT(*) AS c FROM service_categories");
  if (countOf(catCount) === 0) {
    const cats: Omit<ServiceCategory, "id">[] = [
      {
        slug: "bnsp", title_id: "Sertifikasi BNSP", title_en: "BNSP Certification",
        description_id: "Sertifikasi kompetensi resmi dari Badan Nasional Sertifikasi Profesi (BNSP) untuk puluhan skema bidang migas, konstruksi, dan industri.",
        description_en: "Official competency certification from the National Professional Certification Agency (BNSP) covering dozens of oil & gas, construction, and industry schemes.",
        logo: "/images/bnsp-logo.webp", sort: 1,
      },
      {
        slug: "ppsdm", title_id: "Sertifikasi PPSDM Migas", title_en: "PPSDM Migas Certification",
        description_id: "Pelatihan bersertifikat dari Pusat Pengembangan Sumber Daya Manusia Minyak dan Gas Bumi (PPSDM Migas).",
        description_en: "Certified training from the Oil and Gas Human Resources Development Center (PPSDM Migas).",
        logo: "/images/Sertifikasi PPSDM Migas.jpeg", sort: 2,
      },
      {
        slug: "kemnaker", title_id: "Sertifikasi KEMNAKER", title_en: "KEMNAKER Certification",
        description_id: "Pelatihan dan sertifikasi dari Kementerian Ketenagakerjaan RI: K3 umum, pesawat angkat, ketinggian, ruang terbatas, dan lainnya.",
        description_en: "Training and certification from the Ministry of Manpower: general OHS, lifting equipment, working at height, confined space, and more.",
        logo: "/images/logo-kemnaker.webp", sort: 3,
      },
      {
        slug: "iadc", title_id: "Sertifikasi IADC", title_en: "IADC Certification",
        description_id: "Pelatihan berstandar International Association of Drilling Contractors (IADC) untuk profesional rig dan pengeboran.",
        description_en: "Training under International Association of Drilling Contractors (IADC) standards for rig and drilling professionals.",
        logo: "/images/IadcLogo.png", sort: 4,
      },
      {
        slug: "profesional", title_id: "Training Profesional", title_en: "Professional Training",
        description_id: "Pengembangan dan penajaman keterampilan yang relevan dengan pekerjaan: kepemimpinan, teknis, dan soft skills.",
        description_en: "Development of job-relevant skills: leadership, technical, and soft skills.",
        logo: "/images/TrainingProfesional.jpg", sort: 5,
      },
    ];
    const ids: Record<string, string> = {};
    for (const cat of cats) {
      const id = uid("cat_");
      ids[cat.slug] = id;
      await c.execute({
        sql: "INSERT INTO service_categories (id, slug, title_id, title_en, description_id, description_en, logo, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [id, cat.slug, cat.title_id, cat.title_en, cat.description_id, cat.description_en, cat.logo, cat.sort],
      });
    }

    const J = (arr: string[]) => JSON.stringify(arr);
    const svc: { cat: string; id: string; en: string; items: string[] }[] = [
      { cat: "bnsp", id: "Inspektur Rig", en: "Rig Inspector", items: ["Inspektur Rig"] },
      { cat: "bnsp", id: "Operator Pesawat Angkat", en: "Lifting Equipment Operator", items: ["Operator Kran Mobil", "Operator Kran Putar Tetap", "Operator Kran Jembatan", "Ahli Juru Ikat (Rigging)", "Operator Forklift"] },
      { cat: "bnsp", id: "Pengeboran Darat", en: "Onshore Drilling", items: ["Juru Bor Darat (Driller)", "Pengoperasian Lantai Bor", "Pengoperasian Menara Bor", "Pengendali Bor"] },
      { cat: "bnsp", id: "Perawatan Sumur", en: "Well Maintenance", items: ["Operator Lantai Perawatan Sumur", "Operator Menara Perawatan Sumur", "Operator Unit Perawatan Sumur", "Ahli Pengendali Perawatan Sumur"] },
      { cat: "bnsp", id: "K3 Migas", en: "Oil & Gas OHS", items: ["Operator K3 Industri Migas", "Pengawas K3 Industri Migas"] },
      { cat: "bnsp", id: "Laboratorium Pengujian Migas", en: "Oil & Gas Testing Laboratory", items: ["Operator Pengujian Minyak Lumas", "Laboratorium Pengujian Migas"] },
      { cat: "bnsp", id: "Scaffolding", en: "Scaffolding", items: ["Pembantu Operator", "Operator Scaffolding", "Teknisi Maintenance & Repair"] },
      { cat: "bnsp", id: "Pengelolaan SPBU", en: "Fuel Station Management", items: ["Operator SPBU", "Pengelolaan SPBU"] },
      { cat: "bnsp", id: "Perawatan Mekanik", en: "Mechanical Maintenance", items: ["Teknisi II", "Teknisi III", "Supervisor Perawatan Mekanik"] },
      { cat: "bnsp", id: "Instrumentasi dan Kalibrasi", en: "Instrumentation & Calibration", items: ["Teknisi Instrumentasi Tingkat 1", "Teknisi Instrumentasi Tingkat 2", "Pengawas Instrumentasi"] },
      { cat: "bnsp", id: "Inspektur Pesawat Angkat / Crane", en: "Lifting Equipment Inspector", items: ["Inspektur Pesawat Angkat / Crane"] },
      { cat: "bnsp", id: "Inspektur Bejana Tekan", en: "Pressure Vessel Inspector", items: ["Inspektur Bejana Tekan"] },
      { cat: "bnsp", id: "Inspektur Pipa Penyalur", en: "Pipeline Inspector", items: ["Inspektur Pipa Penyalur"] },
      { cat: "bnsp", id: "Inspektur Tangki Timbun", en: "Storage Tank Inspector", items: ["Inspektur Tangki Timbun"] },
      { cat: "bnsp", id: "Inspektur Kelistrikan", en: "Electrical Inspector", items: ["Inspektur Kelistrikan"] },
      { cat: "bnsp", id: "Pipe Fitter", en: "Pipe Fitter", items: ["Pipe Fitter"] },
      { cat: "bnsp", id: "Wireline Logging", en: "Wireline Logging", items: ["Wireline Logging"] },
      { cat: "bnsp", id: "Auditor Energi", en: "Energy Auditor", items: ["Auditor Energi Industri", "Auditor Energi Bangunan Gedung", "Manajer Energi Industri", "Manajer Energi Bangunan Gedung"] },
      { cat: "bnsp", id: "K3 Umum", en: "General OHS", items: ["Ahli K3 Muda", "Ahli K3 Madya", "Ahli K3 Utama"] },
      { cat: "bnsp", id: "Ruang Terbatas (Confined Space)", en: "Confined Space", items: ["Ahli Muda Ruang Terbatas", "Teknisi Ruang Terbatas"] },
      { cat: "bnsp", id: "K3 Bekerja di Ketinggian", en: "Working at Height OHS", items: ["Teknisi K3 Bekerja di Ketinggian", "Gas Tester", "Petugas Penanganan Bahaya Gas H2S"] },
      { cat: "bnsp", id: "Operasi Produksi Migas", en: "Oil & Gas Production Operations", items: ["Pengoperasian Produksi Minyak dan Gas Alam", "Operasi Produksi Migas"] },
      { cat: "bnsp", id: "K3 Minerba", en: "Mining OHS", items: ["General Supervisor K3 Minerba"] },
      { cat: "bnsp", id: "Pengelasan", en: "Welding", items: ["Supervisi Pengelasan", "Perencanaan Pengelasan", "Pengelasan Pipa", "Pengelasan Pelat", "Inspeksi Pengelasan Standar"] },
      { cat: "ppsdm", id: "Operasi Produksi", en: "Production Operations", items: ["Operasi Produksi Minyak, Gas Alam & Panas Bumi"] },
      { cat: "ppsdm", id: "Pengeboran Darat", en: "Onshore Drilling", items: ["Juru Bor Darat", "Lantai & Menara Bor"] },
      { cat: "ppsdm", id: "Perawatan Sumur", en: "Well Services", items: ["Operator Unit Perawatan Sumur"] },
      { cat: "ppsdm", id: "Keselamatan dan Kesehatan Kerja", en: "Occupational Safety & Health", items: ["K3 Industri Migas"] },
      { cat: "ppsdm", id: "Penanganan Bahaya Gas H2S", en: "H2S Hazard Handling", items: ["Petugas Penanganan Bahaya Gas H2S", "Authorized Gas Tester"] },
      { cat: "ppsdm", id: "Fluida Pemboran & Komplesi", en: "Drilling & Completion Fluids", items: ["Fluida Pemboran, Komplesi & Kerja Ulang Sumur"] },
      { cat: "ppsdm", id: "Laboratorium Pengujian Migas", en: "Oil & Gas Testing Lab", items: ["Pengambilan Contoh Minyak dan Gas Bumi", "Petugas Pengukur Isi Tangki"] },
      { cat: "ppsdm", id: "Operasi SPBU & SPPLPG", en: "Fuel & LPG Station Operations", items: ["Operasi SPBU", "Pengelola SPPLPG"] },
      { cat: "ppsdm", id: "Pengolahan Minyak & Gas Bumi", en: "Oil & Gas Processing", items: ["Vacuum Distilling Unit", "Pemrosesan Gas Bumi", "Operasi Unit Blending"] },
      { cat: "ppsdm", id: "Instrumentasi, Kalibrasi & Boiler", en: "Instrumentation, Calibration & Boiler", items: ["Perawatan Peralatan Instrumentasi", "Kalibrasi", "Operasi Boiler"] },
      { cat: "ppsdm", id: "Teknik Listrik & Lingkungan", en: "Electrical & Environment", items: ["Teknik Listrik Migas", "Sistem Manajemen Lingkungan", "Pressure Relief Device"] },
      { cat: "kemnaker", id: "Ahli K3 Umum", en: "General OHS Expert", items: ["Ahli K3 Muda", "Ahli K3 Madya", "Ahli K3 Utama"] },
      { cat: "kemnaker", id: "Pesawat Angkat & Angkut", en: "Lifting & Transport Equipment", items: ["Operator Forklift", "Operator Crane", "Juru Ikat (Rigger)"] },
      { cat: "kemnaker", id: "Bekerja di Ketinggian", en: "Working at Height", items: ["Tenaga Kerja Bangunan Tinggi (TKBT)", "Teknisi Akses Tali"] },
      { cat: "kemnaker", id: "Ruang Terbatas", en: "Confined Space", items: ["Petugas Ruang Terbatas", "Supervisor Ruang Terbatas"] },
      { cat: "kemnaker", id: "Listrik & Kebakaran", en: "Electrical & Fire Safety", items: ["Teknisi Listrik", "Petugas Pemadam Kebakaran (Damkar)"] },
      { cat: "iadc", id: "Well Control & WellSharp", en: "Well Control & WellSharp", items: ["IADC WellSharp Drilling", "Well Control untuk Juru Bor & Pengendali Bor"] },
      { cat: "iadc", id: "RigPass & HSE", en: "RigPass & HSE", items: ["IADC RigPass", "HSE Orientation Rig"] },
      { cat: "iadc", id: "Drilling Operations", en: "Drilling Operations", items: ["Floorhand & Derrickman Training", "Driller Advancement"] },
      { cat: "profesional", id: "Kepemimpinan & Manajemen", en: "Leadership & Management", items: ["Supervisory Skills", "Leadership for Field Operations", "Manajemen Proyek Lapangan"] },
      { cat: "profesional", id: "Teknis Pendukung", en: "Supporting Technical Skills", items: ["Basic Mechanical & Electrical", "Pengoperasian Komputer & Pelaporan", "Bahasa Inggris Teknik Migas"] },
      { cat: "profesional", id: "Soft Skills", en: "Soft Skills", items: ["Komunikasi & Kerja Tim", "Keselamatan Perilaku (BBS)", "Etika Kerja Profesional"] },
    ];
    let i = 0;
    for (const s of svc) {
      await c.execute({
        sql: "INSERT INTO services (id, category_id, title_id, title_en, items_id, items_en, sort) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [uid("svc_"), ids[s.cat], s.id, s.en, J(s.items), J(s.items), i++],
      });
    }
  }

  const schCount = await c.execute("SELECT COUNT(*) AS c FROM schedules");
  if (countOf(schCount) === 0) {
    const rows: Omit<Schedule, "id">[] = [
      { title_id: "Sertifikasi BNSP", title_en: "BNSP Certification", body_id: "Pelatihan dan sertifikasi resmi dari Badan Nasional Sertifikasi Profesi.", body_en: "Official training and certification from the National Professional Certification Agency.", badge_id: "Jadwal Pelatihan", badge_en: "Training Schedule", image: "/images/bnsp-logo.webp", pdf_url: "/images/Jadwal BNSP.pdf", sort: 1, is_active: 1 },
      { title_id: "Sertifikasi PPSDM Migas", title_en: "PPSDM Migas Certification", body_id: "Pelatihan bersertifikat dari Pusat Pengembangan SDM Minyak dan Gas Bumi.", body_en: "Certified training from the Oil and Gas HR Development Center.", badge_id: "Jadwal Pelatihan", badge_en: "Training Schedule", image: "/images/Sertifikasi PPSDM Migas.jpeg", pdf_url: "/images/Sertifikasi PPSDM-2.pdf", sort: 2, is_active: 1 },
      { title_id: "Sertifikasi KEMNAKER", title_en: "KEMNAKER Certification", body_id: "Pelatihan bersertifikat dari Kementerian Ketenagakerjaan RI.", body_en: "Certified training from the Ministry of Manpower.", badge_id: "Jadwal Pelatihan", badge_en: "Training Schedule", image: "/images/logo-kemnaker.webp", pdf_url: "", sort: 3, is_active: 1 },
      { title_id: "Sertifikasi IADC", title_en: "IADC Certification", body_id: "Pelatihan IADC untuk profesional migas dan rig drilling.", body_en: "IADC training for oil & gas and rig drilling professionals.", badge_id: "Jadwal Pelatihan", badge_en: "Training Schedule", image: "/images/IadcLogo.png", pdf_url: "/images/Jadwal IADC.pdf", sort: 4, is_active: 1 },
      { title_id: "Training Profesional", title_en: "Professional Training", body_id: "Mengembangkan dan mempertajam keterampilan yang relevan dengan pekerjaan.", body_en: "Developing job-relevant skills.", badge_id: "Jadwal Pelatihan", badge_en: "Training Schedule", image: "/images/TrainingProfesional.jpg", pdf_url: "/images/silabus_materi_pelatihan.pdf", sort: 5, is_active: 1 },
    ];
    for (const r of rows) {
      await c.execute({
        sql: "INSERT INTO schedules (id, title_id, title_en, body_id, body_en, badge_id, badge_en, image, pdf_url, sort, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [uid("sch_"), r.title_id, r.title_en, r.body_id, r.body_en, r.badge_id, r.badge_en, r.image, r.pdf_url, r.sort, r.is_active],
      });
    }
  }

  const galCount = await c.execute("SELECT COUNT(*) AS c FROM gallery");
  if (countOf(galCount) === 0) {
    const cats = ["training", "training", "training", "events", "events", "training", "events", "training", "events", "events", "events", "training"];
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
    for (let idx = 0; idx < letters.length; idx++) {
      await c.execute({
        sql: "INSERT INTO gallery (id, title, category, image, sort) VALUES (?, ?, ?, ?, ?)",
        args: [uid("gal_"), `Kegiatan ${cats[idx] === "training" ? "Training" : "Perusahaan"} ${idx + 1}`, cats[idx], `/images/${letters[idx]}.jpeg`, idx],
      });
    }
  }

  const cliCount = await c.execute("SELECT COUNT(*) AS c FROM clients");
  if (countOf(cliCount) === 0) {
    const names = [
      "PT Arjuna Petrogas Indonesia", "PT Asia Petrocom Service", "PT Asrindo Citraseni Satria",
      "PT Baker Hughes Indonesia", "PT Bormindo Nusantara", "PT General Buditekindo",
      "PT Greatwall Drilling Asia Pacific", "PT Major Drilling Indonesia", "PT Patra Drilling Contractor",
      "PT Radiant Utama Interinsco", "PT Bohai Drilling Service Indonesia",
    ];
    const files = [
      "PT. Arjuna Petrogas Indonesia.jpeg", "PT. Asia Petrocom Service.jpeg", "PT. Asrindo Citraseni Satria.jpg",
      "PT. Baker Hughes Indonesia.jpg", "PT. Bormindo Nusantara.png", "PT. General buditekindo.jpg",
      "%E2%81%A0PT. Greatwall Drilling Asia Pacific.jpeg", "PT. Major Drlling Indonesia.jpeg", "PT. Patra Drilling Contractor (Pertamina).jpeg",
      "PT. Radiant Utama Interinsco.png", "PT. Bohai Drilling Service Indonesia.png",
    ];
    for (let idx = 0; idx < names.length; idx++) {
      await c.execute({
        sql: "INSERT INTO clients (id, name, logo, sort) VALUES (?, ?, ?, ?)",
        args: [uid("cli_"), names[idx], `/images/${files[idx]}`, idx],
      });
    }
  }
}

/** Ambil nilai COUNT(*) dari hasil query (tahan format baris apapun). */
function countOf(rs: { rows: Row[] }): number {
  const r = rs.rows[0] as unknown as Record<string, unknown> | unknown[] | undefined;
  if (!r) return 0;
  const v = Array.isArray(r) ? r[0] : r.c;
  return Number(v ?? 0);
}

/** Pastikan skema + seed ada. Dipanggil otomatis oleh setiap akses data. */
export async function initDb(): Promise<void> {
  if (!globalThis.__fspInit) {
    globalThis.__fspInit = (async () => {
      const c = getClient();
      for (const sql of DDL) await c.execute(sql);
      await seed();
    })().catch((e) => {
      globalThis.__fspInit = undefined;
      console.error(
        "[fsp-db] init gagal. Backend:",
        isRemoteDb() ? "turso-remote" : "sqlite-local(file:./fsp.db)",
        "— cek TURSO_DATABASE_URL & TURSO_AUTH_TOKEN di environment."
      );
      throw e;
    });
  }
  return globalThis.__fspInit;
}

export function isRemoteDb(): boolean {
  return (process.env.TURSO_DATABASE_URL ?? "").startsWith("libsql://");
}

// ---------- settings ----------
export async function getSettings(): Promise<Record<string, string>> {
  await initDb();
  const rows = await all<{ key: string; value: string }>(
    "SELECT key, value FROM site_settings"
  );
  const out: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function updateSettings(patch: Record<string, string>): Promise<void> {
  await initDb();
  for (const [k, v] of Object.entries(patch)) {
    await run(
      "INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [k, v]
    );
  }
}

// ---------- helpers baca ----------
export async function getCategories(): Promise<ServiceCategory[]> {
  await initDb();
  return all<ServiceCategory>(
    "SELECT * FROM service_categories ORDER BY sort, title_id"
  );
}

export async function getServices(): Promise<Service[]> {
  await initDb();
  return all<Service>("SELECT * FROM services ORDER BY sort");
}

export async function getSchedules(activeOnly = true): Promise<Schedule[]> {
  await initDb();
  return all<Schedule>(
    activeOnly
      ? "SELECT * FROM schedules WHERE is_active=1 ORDER BY sort"
      : "SELECT * FROM schedules ORDER BY sort"
  );
}

export async function getGallery(limit?: number): Promise<GalleryItem[]> {
  await initDb();
  return all<GalleryItem>(
    limit
      ? "SELECT * FROM gallery ORDER BY sort LIMIT ?"
      : "SELECT * FROM gallery ORDER BY sort",
    limit ? [limit] : []
  );
}

export async function getClients(): Promise<Client[]> {
  await initDb();
  return all<Client>("SELECT * FROM clients ORDER BY sort");
}

export async function getMessages(): Promise<Message[]> {
  await initDb();
  return all<Message>("SELECT * FROM messages ORDER BY created_at DESC");
}

export async function countTable(table: string): Promise<number> {
  const allowed = new Set([
    "service_categories", "services", "schedules", "gallery", "clients", "messages",
  ]);
  if (!allowed.has(table)) throw new Error("Tabel tidak dikenal");
  await initDb();
  const rows = await all<{ c: number }>(`SELECT COUNT(*) AS c FROM ${table}`);
  return Number(rows[0]?.c ?? 0);
}

export async function countUnread(): Promise<number> {
  await initDb();
  const rows = await all<{ c: number }>(
    "SELECT COUNT(*) AS c FROM messages WHERE is_read=0"
  );
  return Number(rows[0]?.c ?? 0);
}

// ---------- tulis ----------
export type CategoryInput = {
  slug: string; title_id: string; title_en: string;
  description_id: string; description_en: string; logo: string; sort: number;
};

export async function saveCategoryData(id: string | null, d: CategoryInput): Promise<void> {
  await initDb();
  if (id) {
    await run(
      "UPDATE service_categories SET slug=?, title_id=?, title_en=?, description_id=?, description_en=?, logo=?, sort=? WHERE id=?",
      [d.slug, d.title_id, d.title_en, d.description_id, d.description_en, d.logo, d.sort, id]
    );
  } else {
    await run(
      "INSERT INTO service_categories (id, slug, title_id, title_en, description_id, description_en, logo, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [uid("cat_"), d.slug, d.title_id, d.title_en, d.description_id, d.description_en, d.logo, d.sort]
    );
  }
}

export async function deleteCategoryData(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM services WHERE category_id=?", [id]);
  await run("DELETE FROM service_categories WHERE id=?", [id]);
}

export type ServiceInput = {
  category_id: string; title_id: string; title_en: string;
  itemsId: string[]; itemsEn: string[]; sort: number;
};

export async function saveServiceData(id: string | null, d: ServiceInput): Promise<void> {
  await initDb();
  if (id) {
    await run(
      "UPDATE services SET category_id=?, title_id=?, title_en=?, items_id=?, items_en=?, sort=? WHERE id=?",
      [d.category_id, d.title_id, d.title_en, JSON.stringify(d.itemsId), JSON.stringify(d.itemsEn), d.sort, id]
    );
  } else {
    await run(
      "INSERT INTO services (id, category_id, title_id, title_en, items_id, items_en, sort) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [uid("svc_"), d.category_id, d.title_id, d.title_en, JSON.stringify(d.itemsId), JSON.stringify(d.itemsEn), d.sort]
    );
  }
}

export async function deleteServiceData(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM services WHERE id=?", [id]);
}

export type ScheduleInput = {
  title_id: string; title_en: string; body_id: string; body_en: string;
  badge_id: string; badge_en: string; image: string; pdf_url: string;
  sort: number; is_active: number;
};

export async function saveScheduleData(id: string | null, d: ScheduleInput): Promise<void> {
  await initDb();
  if (id) {
    await run(
      "UPDATE schedules SET title_id=?, title_en=?, body_id=?, body_en=?, badge_id=?, badge_en=?, image=?, pdf_url=?, sort=?, is_active=? WHERE id=?",
      [d.title_id, d.title_en, d.body_id, d.body_en, d.badge_id, d.badge_en, d.image, d.pdf_url, d.sort, d.is_active, id]
    );
  } else {
    await run(
      "INSERT INTO schedules (id, title_id, title_en, body_id, body_en, badge_id, badge_en, image, pdf_url, sort, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [uid("sch_"), d.title_id, d.title_en, d.body_id, d.body_en, d.badge_id, d.badge_en, d.image, d.pdf_url, d.sort, d.is_active]
    );
  }
}

export async function deleteScheduleData(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM schedules WHERE id=?", [id]);
}

export async function saveGalleryData(
  id: string | null,
  d: { title: string; category: string; image: string; sort: number }
): Promise<void> {
  await initDb();
  if (id) {
    await run("UPDATE gallery SET title=?, category=?, image=?, sort=? WHERE id=?", [d.title, d.category, d.image, d.sort, id]);
  } else {
    await run("INSERT INTO gallery (id, title, category, image, sort) VALUES (?, ?, ?, ?, ?)", [uid("gal_"), d.title, d.category, d.image, d.sort]);
  }
}

export async function deleteGalleryData(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM gallery WHERE id=?", [id]);
}

export async function saveClientData(
  id: string | null,
  d: { name: string; logo: string; sort: number }
): Promise<void> {
  await initDb();
  if (id) {
    await run("UPDATE clients SET name=?, logo=?, sort=? WHERE id=?", [d.name, d.logo, d.sort, id]);
  } else {
    await run("INSERT INTO clients (id, name, logo, sort) VALUES (?, ?, ?, ?)", [uid("cli_"), d.name, d.logo, d.sort]);
  }
}

export async function deleteClientData(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM clients WHERE id=?", [id]);
}

export async function createMessage(name: string, email: string, message: string): Promise<void> {
  await initDb();
  await run(
    "INSERT INTO messages (id, name, email, message, created_at, is_read) VALUES (?, ?, ?, ?, ?, 0)",
    [uid("msg_"), name, email, message, new Date().toISOString()]
  );
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await initDb();
  await run("UPDATE messages SET is_read=? WHERE id=?", [read ? 1 : 0, id]);
}

export async function deleteMessageRow(id: string): Promise<void> {
  await initDb();
  await run("DELETE FROM messages WHERE id=?", [id]);
}

// ---------- murni ----------
function parseItems(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function serviceWithItems(s: Service) {
  return {
    ...s,
    list_id: parseItems(s.items_id),
    list_en: parseItems(s.items_en),
  };
}
