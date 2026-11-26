import type { SiteData } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function useStorageStateFallback<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<T>;
    if (parsed && typeof parsed === "object") return { ...fallback, ...parsed };
    return fallback;
  } catch {
    return fallback;
  }
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("967")) return digits;
  if (digits.startsWith("0") && digits.length > 9) return "967" + digits.slice(1);
  return digits;
}

export function waLink(phone: string, message?: string) {
  const base = `https://wa.me/${normalizePhone(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function compressImage(file: File, maxSize = 1500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذر قراءة الملف"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("تعذر فتح الصورة"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("تعذر معالجة الصورة"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatArabicDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function resetData(): SiteData {
  localStorage.removeItem("nibras-site-data");
  return structuredClone(DEFAULT_DATA);
}

import { defaultData as DEFAULT_DATA } from "./data";
