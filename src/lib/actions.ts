"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "./db";
import { uid } from "./utils";
import {
  checkCredentials,
  createAdminSession,
  destroyAdminSession,
  getAdminUser,
} from "./auth";

async function requireAdmin() {
  const u = await getAdminUser();
  if (!u) redirect("/admin/login");
  return u;
}

function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------- auth ----------
export async function adminLogin(form: FormData) {
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");
  if (!checkCredentials(username, password)) {
    return { error: "Username atau password salah." };
  }
  await createAdminSession(username);
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}

// ---------- contact ----------
export async function submitMessage(form: FormData) {
  const name = String(form.get("name") || "").trim().slice(0, 100);
  const email = String(form.get("email") || "").trim().slice(0, 120);
  const message = String(form.get("message") || "").trim().slice(0, 2000);
  if (!name || !email || !message) return { error: "Lengkapi semua field." };
  const db = getDb();
  db.prepare(
    "INSERT INTO messages (id, name, email, message, created_at, is_read) VALUES (?, ?, ?, ?, ?, 0)"
  ).run(uid("msg_"), name, email, message, new Date().toISOString());
  return { ok: true };
}

// ---------- settings ----------
export async function saveSettings(form: FormData) {
  await requireAdmin();
  const keys = [
    "company_name", "tagline", "hero_title_id", "hero_title_en",
    "hero_text_id", "hero_text_en", "about_id", "about_en",
    "vision_id", "vision_en", "address", "phones", "email",
    "whatsapp", "maps_url",
  ];
  const patch: Record<string, string> = {};
  for (const k of keys) {
    const v = form.get(k);
    if (v !== null) patch[k] = String(v);
  }
  const slides = lines(String(form.get("hero_slides") || ""));
  if (slides.length) patch.hero_slides = JSON.stringify(slides);
  const { updateSettings } = await import("./db");
  updateSettings(patch);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- categories ----------
export async function saveCategory(form: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(form.get("id") || "");
  const data = {
    slug: String(form.get("slug") || "").trim(),
    title_id: String(form.get("title_id") || "").trim(),
    title_en: String(form.get("title_en") || "").trim(),
    description_id: String(form.get("description_id") || ""),
    description_en: String(form.get("description_en") || ""),
    logo: String(form.get("logo") || ""),
    sort: Number(form.get("sort") || 0),
  };
  if (!data.slug || !data.title_id) return { error: "Slug dan judul wajib diisi." };
  if (id) {
    db.prepare(
      "UPDATE service_categories SET slug=?, title_id=?, title_en=?, description_id=?, description_en=?, logo=?, sort=? WHERE id=?"
    ).run(data.slug, data.title_id, data.title_en, data.description_id, data.description_en, data.logo, data.sort, id);
  } else {
    db.prepare(
      "INSERT INTO service_categories (id, slug, title_id, title_en, description_id, description_en, logo, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(uid("cat_"), data.slug, data.title_id, data.title_en, data.description_id, data.description_en, data.logo, data.sort);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM service_categories WHERE id=?").run(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- services ----------
export async function saveService(form: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(form.get("id") || "");
  const itemsId = lines(String(form.get("items_id") || ""));
  const itemsEnRaw = String(form.get("items_en") || "");
  const itemsEn = itemsEnRaw.trim() ? lines(itemsEnRaw) : itemsId;
  const data = {
    category_id: String(form.get("category_id") || ""),
    title_id: String(form.get("title_id") || "").trim(),
    title_en: String(form.get("title_en") || "").trim(),
    sort: Number(form.get("sort") || 0),
  };
  if (!data.category_id || !data.title_id) return { error: "Kategori dan judul wajib diisi." };
  if (id) {
    db.prepare(
      "UPDATE services SET category_id=?, title_id=?, title_en=?, items_id=?, items_en=?, sort=? WHERE id=?"
    ).run(data.category_id, data.title_id, data.title_en, JSON.stringify(itemsId), JSON.stringify(itemsEn), data.sort, id);
  } else {
    db.prepare(
      "INSERT INTO services (id, category_id, title_id, title_en, items_id, items_en, sort) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(uid("svc_"), data.category_id, data.title_id, data.title_en, JSON.stringify(itemsId), JSON.stringify(itemsEn), data.sort);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM services WHERE id=?").run(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- schedules ----------
export async function saveSchedule(form: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(form.get("id") || "");
  const data = {
    title_id: String(form.get("title_id") || "").trim(),
    title_en: String(form.get("title_en") || "").trim(),
    body_id: String(form.get("body_id") || ""),
    body_en: String(form.get("body_en") || ""),
    badge_id: String(form.get("badge_id") || ""),
    badge_en: String(form.get("badge_en") || ""),
    image: String(form.get("image") || ""),
    pdf_url: String(form.get("pdf_url") || ""),
    sort: Number(form.get("sort") || 0),
    is_active: form.get("is_active") ? 1 : 0,
  };
  if (!data.title_id) return { error: "Judul wajib diisi." };
  if (id) {
    db.prepare(
      "UPDATE schedules SET title_id=?, title_en=?, body_id=?, body_en=?, badge_id=?, badge_en=?, image=?, pdf_url=?, sort=?, is_active=? WHERE id=?"
    ).run(data.title_id, data.title_en, data.body_id, data.body_en, data.badge_id, data.badge_en, data.image, data.pdf_url, data.sort, data.is_active, id);
  } else {
    db.prepare(
      "INSERT INTO schedules (id, title_id, title_en, body_id, body_en, badge_id, badge_en, image, pdf_url, sort, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(uid("sch_"), data.title_id, data.title_en, data.body_id, data.body_en, data.badge_id, data.badge_en, data.image, data.pdf_url, data.sort, data.is_active);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteSchedule(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM schedules WHERE id=?").run(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- gallery ----------
export async function saveGallery(form: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(form.get("id") || "");
  const title = String(form.get("title") || "");
  const category = String(form.get("category") || "training");
  const image = String(form.get("image") || "");
  const sort = Number(form.get("sort") || 0);
  if (!image) return { error: "Foto wajib diunggah." };
  if (id) {
    db.prepare("UPDATE gallery SET title=?, category=?, image=?, sort=? WHERE id=?").run(title, category, image, sort, id);
  } else {
    db.prepare("INSERT INTO gallery (id, title, category, image, sort) VALUES (?, ?, ?, ?, ?)").run(uid("gal_"), title, category, image, sort);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteGallery(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM gallery WHERE id=?").run(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- clients ----------
export async function saveClient(form: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "").trim();
  const logo = String(form.get("logo") || "");
  const sort = Number(form.get("sort") || 0);
  if (!name || !logo) return { error: "Nama dan logo wajib diisi." };
  if (id) {
    db.prepare("UPDATE clients SET name=?, logo=?, sort=? WHERE id=?").run(name, logo, sort, id);
  } else {
    db.prepare("INSERT INTO clients (id, name, logo, sort) VALUES (?, ?, ?, ?)").run(uid("cli_"), name, logo, sort);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteClient(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM clients WHERE id=?").run(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- messages ----------
export async function markMessage(id: string, read: boolean) {
  await requireAdmin();
  getDb().prepare("UPDATE messages SET is_read=? WHERE id=?").run(read ? 1 : 0, id);
  revalidatePath("/admin/pesan");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  getDb().prepare("DELETE FROM messages WHERE id=?").run(id);
  revalidatePath("/admin/pesan");
}
