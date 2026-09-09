"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createMessage,
  deleteCategoryData,
  deleteClientData,
  deleteGalleryData,
  deleteMessageRow,
  deleteScheduleData,
  deleteServiceData,
  saveCategoryData,
  saveClientData,
  saveGalleryData,
  saveScheduleData,
  saveServiceData,
  setMessageRead,
  updateSettings,
} from "./db";
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
  await createMessage(name, email, message);
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
  await updateSettings(patch);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- categories ----------
export async function saveCategory(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "") || null;
  const slug = String(form.get("slug") || "").trim();
  const title_id = String(form.get("title_id") || "").trim();
  if (!slug || !title_id) return { error: "Slug dan judul wajib diisi." };
  await saveCategoryData(id, {
    slug,
    title_id,
    title_en: String(form.get("title_en") || "").trim(),
    description_id: String(form.get("description_id") || ""),
    description_en: String(form.get("description_en") || ""),
    logo: String(form.get("logo") || ""),
    sort: Number(form.get("sort") || 0),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await deleteCategoryData(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- services ----------
export async function saveService(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "") || null;
  const category_id = String(form.get("category_id") || "");
  const title_id = String(form.get("title_id") || "").trim();
  if (!category_id || !title_id) return { error: "Kategori dan judul wajib diisi." };
  const itemsId = lines(String(form.get("items_id") || ""));
  const itemsEnRaw = String(form.get("items_en") || "");
  await saveServiceData(id, {
    category_id,
    title_id,
    title_en: String(form.get("title_en") || "").trim(),
    itemsId,
    itemsEn: itemsEnRaw.trim() ? lines(itemsEnRaw) : itemsId,
    sort: Number(form.get("sort") || 0),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  await deleteServiceData(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- schedules ----------
export async function saveSchedule(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "") || null;
  const title_id = String(form.get("title_id") || "").trim();
  if (!title_id) return { error: "Judul wajib diisi." };
  await saveScheduleData(id, {
    title_id,
    title_en: String(form.get("title_en") || "").trim(),
    body_id: String(form.get("body_id") || ""),
    body_en: String(form.get("body_en") || ""),
    badge_id: String(form.get("badge_id") || ""),
    badge_en: String(form.get("badge_en") || ""),
    image: String(form.get("image") || ""),
    pdf_url: String(form.get("pdf_url") || ""),
    sort: Number(form.get("sort") || 0),
    is_active: form.get("is_active") ? 1 : 0,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteSchedule(id: string) {
  await requireAdmin();
  await deleteScheduleData(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- gallery ----------
export async function saveGallery(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "") || null;
  const image = String(form.get("image") || "");
  if (!image) return { error: "Foto wajib diunggah." };
  await saveGalleryData(id, {
    title: String(form.get("title") || ""),
    category: String(form.get("category") || "training"),
    image,
    sort: Number(form.get("sort") || 0),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteGallery(id: string) {
  await requireAdmin();
  await deleteGalleryData(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- clients ----------
export async function saveClient(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "") || null;
  const name = String(form.get("name") || "").trim();
  const logo = String(form.get("logo") || "");
  if (!name || !logo) return { error: "Nama dan logo wajib diisi." };
  await saveClientData(id, {
    name,
    logo,
    sort: Number(form.get("sort") || 0),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteClient(id: string) {
  await requireAdmin();
  await deleteClientData(id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- messages ----------
export async function markMessage(id: string, read: boolean) {
  await requireAdmin();
  await setMessageRead(id, read);
  revalidatePath("/admin/pesan");
  return { ok: true };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await deleteMessageRow(id);
  revalidatePath("/admin/pesan");
  return { ok: true };
}
