import { useEffect, useRef, useState, type ReactNode } from "react";
import { compressImage } from "../utils";

export type IconName = "home" | "layers" | "briefcase" | "users" | "phone" | "mail" | "whatsapp" | "facebook" | "moon" | "sun" | "menu" | "close" | "arrow" | "plus" | "edit" | "trash" | "chart" | "image" | "settings" | "lock" | "logout" | "check" | "star" | "upload" | "eye" | "send" | "external" | "spark";

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 11a16 16 0 0 0 5 5l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.8Z" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></>,
  whatsapp: <><path d="M21 11.5a8.4 8.4 0 0 1-12.7 7.2L3 21l2.3-5.2A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 9.2c.2 2.1 2.5 4.4 4.6 4.7.7.1 1.2-.2 1.4-.6l.5-1.1-1.7-.8-.7.8c-1-.4-1.7-1.2-2.2-2.2l.8-.7-.8-1.7-1.1.5c-.5.2-.8.7-.8 1.4Z" /></>,
  facebook: <><path d="M14 9h3l1-4h-4V4a1 1 0 0 1 1-1h3V0h-4a5 5 0 0 0-5 5v4H6v4h3v8h5v-8h3l1-4z" transform="translate(1 1) scale(.92)" /></>,
  moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M18 6 6 18M6 6l12 12" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6" /><path d="M10 11v6M14 11v6" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 15 4-5 4 3 5-7" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1-2.8 2.8-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21h-4v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1L4.2 17l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3v-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8L4.2 7 7 4.2l.1.1a1.6 1.6 0 0 0 1.8.3A1.6 1.6 0 0 0 10 3.1V3h4v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1L19.8 7l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21v4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15" r="1" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  check: <><path d="m5 12 5 5L20 7" /></>,
  star: <><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1Z" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  spark: <><path d="m12 2 2 7 7 3-7 2-2 8-2-8-7-2 7-3Z" /></>,
};

export function Icon({ name, className = "w-5 h-5", fill = false }: { name: IconName; className?: string; fill?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("is-visible"); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function SectionHeading({ kicker, title, description, center = false }: { kicker: string; title: ReactNode; description?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <div className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="h-px w-10 bg-[var(--gold)]" />
        <span className="text-xs font-bold tracking-[.25em] text-[var(--gold)]">{kicker}</span>
      </div>
      <h2 className="text-3xl font-black leading-[1.35] sm:text-4xl lg:text-[42px]">{title}</h2>
      {description && <p className={`mt-4 max-w-2xl text-[15px] leading-8 text-[var(--muted)] ${center ? "mx-auto" : ""}`}>{description}</p>}
    </div>
  );
}

export function Stars({ count }: { count: number }) {
  return <div className="flex gap-1 text-[var(--gold)]">{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" fill={i < count} className={`h-3.5 w-3.5 ${i < count ? "" : "opacity-25"}`} />)}</div>;
}

export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl ${wide ? "max-w-4xl" : "max-w-lg"}`} onMouseDown={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90" aria-label="إغلاق"><Icon name="close" className="h-5 w-5" /></button>
        {children}
      </div>
    </div>
  );
}

export function ImagePicker({ value, onChange, label = "الصورة" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("يرجى اختيار ملف صورة"); return; }
    setBusy(true); setError("");
    try { onChange(await compressImage(file)); }
    catch { setError("تعذر معالجة الصورة، جرّب ملفاً أصغر"); }
    setBusy(false);
  };
  return (
    <div>
      <label className="mb-2 block text-sm font-bold">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)] sm:w-44">
          {value ? <img src={value} alt="معاينة" className="h-full w-full" /> : <div className="flex h-full flex-col items-center justify-center gap-1 text-[var(--muted)]"><Icon name="image" className="h-7 w-7" /><span className="text-xs">لا توجد صورة</span></div>}
        </div>
        <div className="flex-1 space-y-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-bold transition hover:border-[var(--blue)]">
            <Icon name="upload" className="h-4 w-4" /> {busy ? "جارٍ المعالجة..." : "رفع صورة من الجهاز"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
          <input value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value)} placeholder="أو الصق رابط صورة https://..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm outline-none focus:border-[var(--blue)]" dir="ltr" />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
