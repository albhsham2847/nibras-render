import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { RequestItem, Service, Settings, SiteData, Testimonial, Work } from "../types";
import { defaultData } from "../data";
import { formatArabicDate, todayKey, uid, waLink } from "../utils";
import { Icon, ImagePicker, type IconName } from "./UI";

type Tab = "overview" | "requests" | "works" | "services" | "testimonials" | "content";
type Props = {
  data: SiteData;
  update: (patch: Partial<SiteData>) => void;
  authed: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onExit: () => void;
};

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: "overview", label: "نظرة عامة", icon: "chart" },
  { id: "requests", label: "طلبات العملاء", icon: "send" },
  { id: "works", label: "معرض الأعمال", icon: "image" },
  { id: "services", label: "الخدمات", icon: "layers" },
  { id: "testimonials", label: "آراء العملاء", icon: "users" },
  { id: "content", label: "المحتوى والإعدادات", icon: "settings" },
];

const field = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]";
const label = "mb-2 block text-xs font-bold";
const primaryBtn = "blue-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5";
const ghostBtn = "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold transition hover:border-[var(--blue)]";

function Login({ settings, onLogin, onExit }: { settings: Settings; onLogin: () => void; onExit: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password === settings.password) { setError(""); onLogin(); }
    else setError("كلمة المرور غير صحيحة، حاول مرة أخرى.");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-5">
      <div className="grid-pattern pointer-events-none absolute inset-0" />
      <div className="glow-blue absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <form onSubmit={submit} className="glass relative w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl blue-gradient text-white shadow-xl shadow-blue-600/30"><Icon name="lock" className="h-8 w-8" /></div>
          <h1 className="text-2xl font-black">لوحة تحكم الإدارة</h1>
          <p className="mt-2 text-xs text-[var(--muted)]">المصمم نبراس منبه للتصميم والتسويق والإعلان</p>
        </div>
        <label className="block"><span className={label}>كلمة المرور</span><input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" className={field} /></label>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-center text-xs font-bold text-red-400">{error}</p>}
        <button type="submit" className={`${primaryBtn} mt-6 w-full`}><Icon name="lock" className="h-4 w-4" /> تسجيل الدخول</button>
        {settings.password === "nibras2026" && <p className="mt-5 text-center text-[11px] text-[var(--muted)]">كلمة المرور الافتراضية: <span className="font-bold text-[var(--gold)]" dir="ltr">nibras2026</span><br />يمكنك تغييرها من الإعدادات بعد الدخول.</p>}
        <button type="button" onClick={onExit} className="mt-5 w-full text-center text-[11px] text-[var(--muted)] hover:text-[var(--text)]">العودة إلى الموقع</button>
      </form>
    </div>
  );
}

export default function Admin({ data, update, authed, onLogin, onLogout, onExit }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  if (!authed) return <Login settings={data.settings} onLogin={onLogin} onExit={onExit} />;

  const setRequests = (requests: RequestItem[]) => update({ requests });
  const setWorks = (works: Work[]) => update({ works });
  const setServices = (services: Service[]) => update({ services });
  const setTestimonials = (testimonials: Testimonial[]) => update({ testimonials });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex max-w-[1600px]">
        {/* sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] p-5 md:flex">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl blue-gradient text-white"><Icon name="spark" className="h-6 w-6" /></span>
            <div><div className="text-sm font-black">لوحة التحكم</div><div className="text-[10px] text-[var(--gold)]">Nibras Studio</div></div>
          </div>
          <nav className="mt-6 flex-1 space-y-1.5">
            {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "blue-gradient text-white shadow-lg shadow-blue-600/20" : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"}`}><Icon name={t.icon} className="h-[18px] w-[18px]" />{t.label}</button>)}
          </nav>
          <div className="space-y-2 border-t border-[var(--border)] pt-5">
            <button onClick={onExit} className={`${ghostBtn} w-full`}><Icon name="external" className="h-4 w-4" /> عرض الموقع</button>
            <button onClick={onLogout} className={`${ghostBtn} w-full border-red-500/30 text-red-400`}><Icon name="logout" className="h-4 w-4" /> تسجيل الخروج</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <div><h1 className="text-lg font-black">{tabs.find((t) => t.id === tab)?.label}</h1><p className="text-[11px] text-[var(--muted)]">مرحباً بك، تحكّم بكل محتوى موقعك من مكان واحد</p></div>
            <div className="flex items-center gap-2">
              <button onClick={onExit} className={`${ghostBtn} md:hidden`}><Icon name="external" className="h-4 w-4" /></button>
              <button onClick={onLogout} className={`${ghostBtn} md:hidden`}><Icon name="logout" className="h-4 w-4" /></button>
              <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 sm:block">● الموقع نشط</span>
            </div>
          </header>

          {/* mobile tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-[var(--border)] px-4 py-3 md:hidden">
            {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${tab === t.id ? "blue-gradient text-white" : "bg-[var(--surface)] text-[var(--muted)]"}`}>{t.label}</button>)}
          </div>

          <div className="p-5 md:p-8">
            {tab === "overview" && <Overview data={data} setTab={setTab} />}
            {tab === "requests" && <RequestsTab requests={data.requests} onChange={setRequests} settings={data.settings} />}
            {tab === "works" && <WorksTab works={data.works} onChange={setWorks} />}
            {tab === "services" && <ServicesTab services={data.services} onChange={setServices} />}
            {tab === "testimonials" && <TestimonialsTab testimonials={data.testimonials} onChange={setTestimonials} />}
            {tab === "content" && <ContentTab settings={data.settings} update={update} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"><h2 className="text-base font-black">{title}</h2>{subtitle && <p className="mt-1 mb-5 text-xs text-[var(--muted)]">{subtitle}</p>}<div className={subtitle ? "" : "mt-5"}>{children}</div></div>;
}

function Overview({ data, setTab }: { data: SiteData; setTab: (t: Tab) => void }) {
  const stats = [
    { label: "زيارات الموقع", value: data.analytics.totalVisits, icon: "eye" as IconName, color: "text-[var(--blue-bright)]" },
    { label: "طلبات جديدة", value: data.requests.filter((r) => r.status === "new").length, icon: "send" as IconName, color: "text-emerald-400" },
    { label: "الأعمال المعروضة", value: data.works.length, icon: "image" as IconName, color: "text-[var(--gold)]" },
    { label: "آراء العملاء", value: data.testimonials.length, icon: "users" as IconName, color: "text-purple-400" },
  ];
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { key: todayKey(d), label: new Intl.DateTimeFormat("ar", { weekday: "short" }).format(d) }; }), []);
  const max = Math.max(1, ...days.map((d) => data.analytics.daily[d.key] || 0));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center justify-between"><span className="text-xs text-[var(--muted)]">{s.label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] ${s.color}`}><Icon name={s.icon} className="h-5 w-5" /></span></div><div className="mt-3 text-3xl font-black">{s.value}</div></div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <Panel title="زيارات آخر 7 أيام" subtitle="متابعة أداء الموقع يوم بيوم">
          <div className="flex h-44 items-end gap-3">
            {days.map((d) => { const v = data.analytics.daily[d.key] || 0; return <div key={d.key} className="flex flex-1 flex-col items-center gap-2"><span className="text-[10px] font-bold text-[var(--muted)]">{v}</span><div className="w-full max-w-12 rounded-t-lg blue-gradient transition-all" style={{ height: `${Math.max(5, (v / max) * 100)}%` }} /><span className="text-[10px] text-[var(--muted)]">{d.label}</span></div>; })}
          </div>
        </Panel>
        <Panel title="إجراءات سريعة" subtitle="انتقل إلى ما تريد إدارته">
          <div className="space-y-2">{tabs.filter((t) => t.id !== "overview").map((t) => <button key={t.id} onClick={() => setTab(t.id)} className="flex w-full items-center justify-between rounded-xl bg-[var(--surface-2)] px-4 py-3 text-sm font-bold transition hover:border hover:border-[var(--blue)]"><span className="flex items-center gap-2"><Icon name={t.icon} className="h-4 w-4 text-[var(--blue-bright)]" />{t.label}</span><Icon name="arrow" className="h-4 w-4 rotate-180 text-[var(--muted)]" /></button>)}</div>
        </Panel>
      </div>
      <Panel title="أحدث طلبات العملاء" subtitle="آخر الطلبات الواردة من نموذج طلب الخدمة">
        {data.requests.length === 0 ? <p className="rounded-xl bg-[var(--surface-2)] p-6 text-center text-xs text-[var(--muted)]">لا توجد طلبات بعد. ستظهر هنا فور إرسال عميل لطلبه.</p> : <div className="space-y-2">{data.requests.slice(0, 5).map((r) => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--surface-2)] p-4"><div><div className="text-sm font-bold">{r.name} <span className="mr-2 text-xs font-normal text-[var(--muted)]">{r.service}</span></div><div className="mt-1 text-[11px] text-[var(--muted)]">{formatArabicDate(r.date)}</div></div><StatusBadge status={r.status} /></div>)}</div>}
      </Panel>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestItem["status"] }) {
  const map = { new: ["جديد", "bg-blue-500/15 text-[var(--blue-bright)]"], contacted: ["تم التواصل", "bg-amber-500/15 text-amber-400"], done: ["مكتمل", "bg-emerald-500/15 text-emerald-400"] };
  return <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${map[status][1]}`}>{map[status][0]}</span>;
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-[var(--border)] p-10 text-center text-xs text-[var(--muted)]">{text}</p>;
}

function RequestsTab({ requests, onChange, settings }: { requests: RequestItem[]; onChange: (v: RequestItem[]) => void; settings: Settings }) {
  const sorted = [...requests].sort((a, b) => b.date.localeCompare(a.date));
  return <Panel title={`طلبات العملاء (${requests.length})`} subtitle="تابع طلباتك، حدّث حالتها، وردّ على العملاء مباشرة عبر واتساب">
    {sorted.length === 0 ? <Empty text="لا توجد طلبات حتى الآن." /> : <div className="grid gap-4 xl:grid-cols-2">
      {sorted.map((r) => <div key={r.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-black">{r.name}</h3><p className="mt-1 text-[11px] text-[var(--muted)]" dir="ltr">{r.phone} · {formatArabicDate(r.date)}</p></div><StatusBadge status={r.status} /></div>
        <div className="mt-3 inline-block rounded-lg bg-[var(--blue)]/10 px-3 py-1 text-[11px] font-bold text-[var(--blue-bright)]">{r.service}</div>
        <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{r.details}</p>
        {r.files && <p className="mt-2 text-[11px] text-[var(--gold)]">📎 {r.files}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <select value={r.status} onChange={(e) => onChange(requests.map((x) => x.id === r.id ? { ...x, status: e.target.value as RequestItem["status"] } : x))} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs outline-none"><option value="new">جديد</option><option value="contacted">تم التواصل</option><option value="done">مكتمل</option></select>
          <a href={waLink(`967${r.phone.replace(/\D/g, "").replace(/^967/, "").replace(/^0/, "")}`, `مرحباً ${r.name}، شكراً لتواصلك مع نبراس منبه بخصوص طلبك: ${r.service}`)} target="_blank" rel="noreferrer" className={`${ghostBtn} border-emerald-500/30 text-emerald-400`}><Icon name="whatsapp" className="h-4 w-4" /> رد</a>
          <button onClick={() => { if (confirm("حذف هذا الطلب؟")) onChange(requests.filter((x) => x.id !== r.id)); }} className={`${ghostBtn} border-red-500/30 text-red-400`}><Icon name="trash" className="h-4 w-4" /></button>
        </div>
      </div>)}</div>}
    <p className="mt-4 text-[11px] text-[var(--muted)]">رقم الرد المستخدم: <span dir="ltr">{settings.whatsapp}</span></p>
  </Panel>;
}

function WorksTab({ works, onChange }: { works: Work[]; onChange: (v: Work[]) => void }) {
  const empty = { id: "", title: "", category: "هوية بصرية", image: "", client: "", year: "2026", description: "" };
  const [form, setForm] = useState<Work>(empty);
  const [editing, setEditing] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image) return;
    if (editing) onChange(works.map((w) => w.id === form.id ? form : w));
    else onChange([{ ...form, id: uid() }, ...works]);
    setForm(empty); setEditing(false);
  };
  return <div className="space-y-6">
    <Panel title={editing ? "تعديل العمل" : "إضافة عمل جديد"} subtitle="ارفع صورة العمل أو الصق رابطها، واختر التصنيف المناسب ليظهر في المعرض.">
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <label className="block"><span className={label}>عنوان العمل *</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder="مثال: هوية بصرية لعلامة تجارية" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className={label}>التصنيف</span><input list="work-cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field} /><datalist id="work-cats">{defaultData.works.map((w) => <option key={w.id} value={w.category} />)}</datalist></label>
            <label className="block"><span className={label}>العميل</span><input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={field} /></label>
          </div>
          <label className="block"><span className={label}>السنة</span><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={field} /></label>
          <label className="block"><span className={label}>وصف العمل</span><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} /></label>
        </div>
        <div className="space-y-4">
          <ImagePicker value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="صورة العمل *" />
          <div className="flex gap-2"><button type="submit" className={primaryBtn}><Icon name={editing ? "check" : "plus"} className="h-4 w-4" />{editing ? "حفظ التعديلات" : "إضافة العمل"}</button>{editing && <button type="button" onClick={() => { setForm(empty); setEditing(false); }} className={ghostBtn}>إلغاء</button>}</div>
        </div>
      </form>
    </Panel>
    <Panel title={`الأعمال المنشورة (${works.length})`}>
      {works.length === 0 ? <Empty text="لا توجد أعمال بعد." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{works.map((w) => <div key={w.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"><img src={w.image} alt={w.title} className="aspect-[4/3] w-full" /><div className="p-4"><div className="flex items-center justify-between gap-2"><h3 className="truncate text-sm font-bold">{w.title}</h3><span className="shrink-0 rounded-full bg-[var(--blue)]/10 px-2 py-1 text-[9px] font-bold text-[var(--blue-bright)]">{w.category}</span></div><div className="mt-4 flex gap-2"><button onClick={() => { setForm(w); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={ghostBtn}><Icon name="edit" className="h-4 w-4" /> تعديل</button><button onClick={() => { if (confirm("حذف هذا العمل؟")) onChange(works.filter((x) => x.id !== w.id)); }} className={`${ghostBtn} border-red-500/30 text-red-400`}><Icon name="trash" className="h-4 w-4" /></button></div></div></div>)}</div>}
    </Panel>
  </div>;
}

function ServicesTab({ services, onChange }: { services: Service[]; onChange: (v: Service[]) => void }) {
  const empty = { id: "", icon: "✨", title: "", description: "" };
  const [form, setForm] = useState<Service>(empty);
  const [editing, setEditing] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.title.trim()) return; if (editing) onChange(services.map((s) => s.id === form.id ? form : s)); else onChange([...services, { ...form, id: uid() }]); setForm(empty); setEditing(false); };
  return <div className="space-y-6">
    <Panel title={editing ? "تعديل الخدمة" : "إضافة خدمة جديدة"} subtitle="الرمز التعبيري يظهر داخل بطاقة الخدمة في الموقع.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-[100px_1fr_1.5fr_auto] md:items-end">
        <label className="block"><span className={label}>الأيقونة</span><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={`${field} text-center text-xl`} /></label>
        <label className="block"><span className={label}>عنوان الخدمة *</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>الوصف</span><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} /></label>
        <div className="flex gap-2"><button type="submit" className={primaryBtn}><Icon name={editing ? "check" : "plus"} className="h-4 w-4" />{editing ? "حفظ" : "إضافة"}</button>{editing && <button type="button" onClick={() => { setForm(empty); setEditing(false); }} className={ghostBtn}>إلغاء</button>}</div>
      </form>
    </Panel>
    <Panel title={`الخدمات المنشورة (${services.length})`}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{services.map((s) => <div key={s.id} className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl">{s.icon}</span><div className="min-w-0 flex-1"><h3 className="text-xs font-black">{s.title}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--muted)]">{s.description}</p><div className="mt-3 flex gap-2"><button onClick={() => { setForm(s); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-[11px] font-bold text-[var(--blue-bright)]">تعديل</button><button onClick={() => { if (confirm("حذف هذه الخدمة؟")) onChange(services.filter((x) => x.id !== s.id)); }} className="text-[11px] font-bold text-red-400">حذف</button></div></div></div>)}</div>
    </Panel>
  </div>;
}

function TestimonialsTab({ testimonials, onChange }: { testimonials: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  const empty = { id: "", name: "", role: "", text: "", rating: 5, date: "" };
  const [form, setForm] = useState<Testimonial>(empty);
  const [editing, setEditing] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.name.trim() || !form.text.trim()) return; const item = { ...form, date: form.date || new Date().toISOString().slice(0, 10) }; if (editing) onChange(testimonials.map((t) => t.id === item.id ? item : t)); else onChange([item, ...testimonials]); setForm(empty); setEditing(false); };
  return <div className="space-y-6">
    <Panel title={editing ? "تعديل التقييم" : "إضافة تقييم جديد"} subtitle="يمكن للزوار أيضاً إضافة تقييماتهم من الموقع، وستظهر هنا للإدارة.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <label className="block"><span className={label}>اسم العميل *</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>الصفة</span><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={field} /></label>
        <label className="block md:col-span-2"><span className={label}>نص التقييم *</span><textarea required rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>التقييم</span><select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={field}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} نجوم</option>)}</select></label>
        <div className="flex items-end gap-2"><button type="submit" className={primaryBtn}><Icon name={editing ? "check" : "plus"} className="h-4 w-4" />{editing ? "حفظ" : "إضافة"}</button>{editing && <button type="button" onClick={() => { setForm(empty); setEditing(false); }} className={ghostBtn}>إلغاء</button>}</div>
      </form>
    </Panel>
    <Panel title={`التقييمات المنشورة (${testimonials.length})`}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{testimonials.map((t) => <div key={t.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-black">{t.name}</h3><span className="text-xs text-[var(--gold)]">{'★'.repeat(t.rating)}</span></div><p className="mt-2 line-clamp-3 text-[11px] leading-6 text-[var(--muted)]">{t.text}</p><div className="mt-4 flex gap-2"><button onClick={() => { setForm(t); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-[11px] font-bold text-[var(--blue-bright)]">تعديل</button><button onClick={() => { if (confirm("حذف هذا التقييم؟")) onChange(testimonials.filter((x) => x.id !== t.id)); }} className="text-[11px] font-bold text-red-400">حذف</button></div></div>)}</div>
    </Panel>
  </div>;
}

function ContentTab({ settings, update }: { settings: Settings; update: (p: Partial<SiteData>) => void }) {
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setForm(settings); }, [settings]);
  const save = (e: FormEvent) => { e.preventDefault(); update({ settings: form }); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  return <form onSubmit={save} className="space-y-6">
    <Panel title="محتوى الصفحة الرئيسية" subtitle="عدّل العناوين والنصوص التي تظهر للزوار مباشرة.">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2"><label className="block"><span className={label}>اسم الموقع</span><input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className={field} /></label><label className="block"><span className={label}>الشعار الفرعي</span><input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} className={field} /></label></div>
        <label className="block"><span className={label}>العنوان الرئيسي</span><input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>النص التعريفي</span><textarea rows={3} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className={field} /></label>
        <ImagePicker value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} label="صورة الواجهة الرئيسية" />
      </div>
    </Panel>
    <Panel title="معلومات التواصل" subtitle="ستظهر هذه البيانات في قسم التواصل والتذييل وروابط الأزرار المباشرة.">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block"><span className={label}>رقم الهاتف الأول</span><input dir="ltr" value={form.phone1} onChange={(e) => setForm({ ...form, phone1: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>رقم الهاتف الثاني</span><input dir="ltr" value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>البريد الإلكتروني</span><input dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} /></label>
        <label className="block"><span className={label}>رقم واتساب (بالرمز الدولي)</span><input dir="ltr" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={field} /></label>
        <label className="block md:col-span-2"><span className={label}>رابط صفحة فيسبوك</span><input dir="ltr" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={field} /></label>
      </div>
    </Panel>
    <Panel title="الأمان والنسخ الاحتياطي" subtitle="كلمة مرور لوحة الإدارة محفوظة في متصفح هذا الجهاز.">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block"><span className={label}>كلمة مرور الإدارة الجديدة</span><input dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={field} /></label>
        <div className="flex items-end"><button type="button" onClick={() => { if (confirm("سيتم إعادة كل البيانات إلى الوضع الافتراضي. هل أنت متأكد؟")) { localStorage.removeItem("nibras-site-data"); location.reload(); } }} className={`${ghostBtn} border-red-500/30 text-red-400`}><Icon name="trash" className="h-4 w-4" /> إعادة ضبط البيانات</button></div>
      </div>
    </Panel>
    <div className="flex flex-wrap items-center gap-4"><button type="submit" className={primaryBtn}><Icon name="check" className="h-4 w-4" /> حفظ جميع التغييرات</button>{saved && <span className="text-xs font-bold text-emerald-400">✓ تم الحفظ بنجاح</span>}</div>
  </form>;
}
