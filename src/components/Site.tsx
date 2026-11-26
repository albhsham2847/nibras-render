import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { RequestItem, SiteData, Testimonial, Work } from "../types";
import { scrollToSection, uid, waLink } from "../utils";
import { Icon, Modal, Reveal, SectionHeading, Stars } from "./UI";

type Props = {
  data: SiteData;
  theme: "dark" | "light";
  toggleTheme: () => void;
  onAdmin: () => void;
  submitRequest: (r: RequestItem) => void;
  addTestimonial: (t: Testimonial) => void;
  trackWorkView: () => void;
};

const navItems = [
  { label: "الرئيسية", id: "home" },
  { label: "الخدمات", id: "services" },
  { label: "الأعمال", id: "works" },
  { label: "لماذا تختارنا", id: "why" },
  { label: "آراء العملاء", id: "testimonials" },
  { label: "تواصل معنا", id: "contact" },
];

const advantages = [
  { icon: "✨", title: "الإبداع والتميز", text: "كل مشروع يبدأ بفكرة مختلفة ونرى في التفاصيل فرصة لصنع انطباع استثنائي." },
  { icon: "🎯", title: "جودة عالية", text: "دقة في التنفيذ واهتمام بكل عنصر لضمان خروج التصميم بالصورة التي تتوقعها." },
  { icon: "⏱️", title: "الالتزام بالمواعيد", text: "جدول واضح وتواصل مستمر لتسليم أعمالك في الوقت المتفق عليه." },
  { icon: "💡", title: "أفكار تسويقية مبتكرة", text: "نربط بين الجمال والهدف التجاري لنقدم حلولاً تعمل فعلاً على أرض الواقع." },
  { icon: "🤝", title: "تعامل احترافي", text: "استماع حقيقي لاحتياجاتك وشفافية كاملة في كل مرحلة من مراحل العمل." },
  { icon: "🚀", title: "أفكارك واقع بصري", text: "نحوّل ما في ذهنك إلى هوية مرئية قادرة على المنافسة والبقاء." },
];

const steps = [
  { n: "01", title: "نتعرف على فكرتك", text: "نبدأ بحوار قصير لفهم رؤيتك وجمهورك وهدفك." },
  { n: "02", title: "نصيغ الاستراتيجية", text: "نبني الاتجاه البصري والرسالة المناسبة لعلامتك." },
  { n: "03", title: "نصمم باحتراف", text: "ننتج تصاميم متقنة ونراجعها معك حتى الوصول للكمال." },
  { n: "04", title: "نسلّم الأثر", text: "تستلم ملفاتك جاهزة للاستخدام مع دعم مستمر." },
];

export default function Site({ data, theme, toggleTheme, onAdmin, submitRequest, addTestimonial, trackWorkView }: Props) {
  const { settings, services, works, testimonials } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("الكل");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [review, setReview] = useState({ name: "", role: "", text: "", rating: 5 });
  const [request, setRequest] = useState({ name: "", phone: "", service: "", details: "", files: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredWorks = useMemo(() => filter === "الكل" ? works : works.filter((w) => w.category === filter), [works, filter]);
  const categories = useMemo(() => ["الكل", ...Array.from(new Set(works.map((w) => w.category)))], [works]);

  const go = (id: string) => { setMenuOpen(false); scrollToSection(id); };

  const openWork = (index: number) => { setLightbox(index); trackWorkView(); };

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!review.name.trim() || !review.text.trim()) return;
    addTestimonial({ ...review, id: uid(), date: new Date().toISOString().slice(0, 10) });
    setReview({ name: "", role: "", text: "", rating: 5 });
    setReviewOpen(false);
  };

  const submitOrder = (e: FormEvent) => {
    e.preventDefault();
    const message = `مرحباً نبراس منبه، أود طلب خدمة تصميم:\n\n👤 الاسم: ${request.name}\n📞 الهاتف: ${request.phone}\n🎯 الخدمة: ${request.service}\n📝 تفاصيل المشروع: ${request.details}\n📎 الملفات: ${request.files || "لا توجد ملفات"}`;
    submitRequest({ ...request, id: uid(), date: new Date().toISOString(), status: "new" });
    window.open(waLink(settings.whatsapp, message), "_blank", "noopener,noreferrer");
    setSent(true);
    setRequest({ name: "", phone: "", service: "", details: "", files: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* announcement */}
      <div className="relative z-50 overflow-hidden border-b border-[var(--border)] bg-[var(--bg-soft)] py-2 text-center text-[11px] font-bold tracking-wide text-[var(--gold)] sm:text-xs">
        «إبداع يلفت الأنظار... وتصميم يصنع الانطباع» <span className="mx-2 opacity-40">•</span> {settings.siteName}
      </div>

      {/* header */}
      <header className={`sticky top-0 z-40 border-b transition-all duration-500 ${scrolled ? "glass shadow-lg" : "border-transparent bg-[var(--bg)]/80 backdrop-blur-md"}`}>
        <div className="container mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => go("home")} className="flex items-center gap-3 text-right" aria-label="الصفحة الرئيسية">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl blue-gradient text-white shadow-lg shadow-blue-500/25">
              <Icon name="spark" className="h-6 w-6" />
              <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full gold-gradient ring-2 ring-[var(--bg)]" />
            </span>
            <span>
              <span className="block text-[15px] font-black leading-tight sm:text-base">{settings.siteName}</span>
              <span className="block text-[10px] font-bold text-[var(--gold)] sm:text-[11px]">{settings.slogan}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => go(item.id)} className="rounded-lg px-3 py-2 text-[13px] font-bold text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]">{item.label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--blue)]" aria-label="تبديل الوضع الليلي والنهاري">
              <Icon name={theme === "dark" ? "sun" : "moon"} className="h-[18px] w-[18px] text-[var(--gold)]" />
            </button>
            <button onClick={() => go("request")} className="blue-gradient hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 sm:block">اطلب تصميمك</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] lg:hidden" aria-label="القائمة">
              <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="glass border-t border-[var(--border)] px-5 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
              {navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className="rounded-xl bg-[var(--surface-2)] px-4 py-3 text-right text-sm font-bold">{item.label}</button>)}
              <button onClick={() => go("request")} className="blue-gradient rounded-xl px-4 py-3 text-sm font-bold text-white">اطلب تصميمك الآن</button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
          <div className="grid-pattern absolute inset-0" />
          <div className="animate-pulseGlow absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="animate-pulseGlow absolute -left-40 bottom-10 h-[380px] w-[380px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="container relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <Reveal className="order-2 text-right lg:order-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--gold)]">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
                متاحون لاستقبال مشاريع جديدة
              </div>
              <h1 className="text-4xl font-black leading-[1.28] sm:text-5xl lg:text-[58px]">
                {settings.heroTitle.split(" ").slice(0, 3).join(" ")} <span className="text-gradient">{settings.heroTitle.split(" ").slice(3).join(" ")}</span>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-9 text-[var(--muted)] sm:text-base">{settings.heroSubtitle}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => go("works")} className="blue-gradient group inline-flex items-center gap-3 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1">
                  استعرض أعمالنا <Icon name="arrow" className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" />
                </button>
                <button onClick={() => go("request")} className="inline-flex items-center gap-3 rounded-xl border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-6 py-3.5 text-sm font-bold text-[var(--gold)] transition hover:-translate-y-1 hover:bg-[var(--gold)]/20">
                  اطلب تصميمك الآن <Icon name="spark" className="h-4 w-4" />
                </button>
                <a href={waLink(settings.whatsapp, "مرحباً نبراس، أود التواصل معك عبر واتساب.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold transition hover:-translate-y-1 hover:border-emerald-500/60">
                  <Icon name="whatsapp" className="h-5 w-5 text-emerald-400" /> تواصل عبر واتساب
                </a>
              </div>
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--border)] pt-7">
                {[{ n: "+120", l: "مشروعاً منجزاً" }, { n: "+50", l: "عميلاً سعيداً" }, { n: "8", l: "خدمات إبداعية" }].map((s) => (
                  <div key={s.l}><div className="text-2xl font-black text-[var(--gold)] sm:text-3xl">{s.n}</div><div className="mt-1 text-xs text-[var(--muted)]">{s.l}</div></div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180} className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-4 rounded-[3rem] blue-gradient opacity-20 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
                  <img src={settings.heroImage || "/images/hero-visual.png"} alt="تصميم إبداعي لاستوديو نبراس منبه" className="aspect-[4/3.6] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-6 right-6 right-6 text-right">
                    <div className="text-xs font-bold text-[var(--gold)]">NIBRAS MUNABAH</div>
                    <div className="mt-1 text-lg font-black text-white">إبداع يلفت الأنظار</div>
                  </div>
                </div>
                <div className="animate-float absolute -right-3 top-10 rounded-2xl border border-[var(--border)] glass px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient text-black">🎨</span><div><div className="text-xs font-bold">تصميم احترافي</div><div className="text-[10px] text-[var(--muted)]">بكل تفاصيله</div></div></div>
                </div>
                <div className="animate-floatSlow absolute -bottom-5 -left-4 rounded-2xl border border-[var(--border)] glass px-5 py-4 shadow-xl">
                  <div className="text-2xl font-black text-gradient">100%</div><div className="text-[11px] text-[var(--muted)]">رضا العملاء</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--bg-soft)] py-4">
          <div className="marquee-mask flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...services, ...services].map((s, i) => (
              <span key={i} className="flex items-center gap-8 text-sm font-bold text-[var(--muted)]"><Icon name="spark" className="h-4 w-4 text-[var(--gold)]" />{s.title}</span>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" className="container mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8">
          <Reveal>
            <SectionHeading kicker="ما نقدمه" title={<>خدماتنا <span className="text-gradient">الإبداعية</span></>} description="حلول تصميم وتسويق متكاملة، مصممة خصيصاً لتجعل علامتك التجارية أكثر حضوراً وتأثيراً." />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 4) * 70}>
                <button onClick={() => go("request")} className="card-hover group relative h-full w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-right">
                  <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />
                  {works[i % Math.max(works.length, 1)] && <img src={works[i % works.length].image} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full opacity-[.07] transition duration-500 group-hover:scale-110 group-hover:opacity-[.14]" />}
                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-2xl shadow-lg">{s.icon}</div>
                    <h3 className="min-h-[52px] text-[15px] font-black leading-6">{s.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{s.description}</p>
                    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[var(--blue-bright)]">اطلب الخدمة <Icon name="arrow" className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /></div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WORKS */}
        <section id="works" className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--bg-soft)] py-24">
          <div className="container mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <SectionHeading kicker="معرض الأعمال" title={<>أعمال <span className="text-gradient">صنعت الفرق</span></>} description="نماذج من مشاريعنا التي مزجت بين الإبداع والهدف، انقر على أي عمل لعرضه بحجم كامل." center={false} />
                <button onClick={() => go("request")} className="mb-12 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-bold transition hover:border-[var(--blue)]">ابدأ مشروعك <Icon name="arrow" className="h-4 w-4 rotate-180" /></button>
              </div>
            </Reveal>
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((c) => <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${filter === c ? "blue-gradient text-white shadow-lg shadow-blue-600/20" : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"}`}>{c}</button>)}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorks.map((w, i) => (
                <Reveal key={w.id} delay={(i % 3) * 80}>
                  <button onClick={() => openWork(works.indexOf(w))} className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-right">
                    <img src={w.image} alt={w.title} loading="lazy" className="aspect-[4/3] w-full transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition group-hover:opacity-95" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">{w.category}</div>
                      <h3 className="text-lg font-black text-white">{w.title}</h3>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-white/70"><span>{w.client} · {w.year}</span><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition group-hover:bg-[var(--blue)]"><Icon name="eye" className="h-4 w-4" /></span></div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
            {filteredWorks.length === 0 && <p className="py-16 text-center text-[var(--muted)]">لا توجد أعمال في هذا التصنيف بعد.</p>}
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="container mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2.5rem] gold-gradient opacity-10 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)]">
                  <img src="/images/work-branding.png" alt="جودة التصميم" loading="lazy" className="aspect-[4/4.8] w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-7 right-7 left-7">
                    <Stars count={5} />
                    <p className="mt-3 text-lg font-black leading-8 text-white">«نصنع الإبداع، ونمنح أفكارك هوية تستحق أن تُرى.»</p>
                    <p className="mt-2 text-xs text-white/70">{settings.siteName}</p>
                  </div>
                </div>
                <div className="animate-float absolute -left-5 top-8 rounded-2xl gold-gradient px-5 py-3 text-center text-black shadow-xl"><div className="text-2xl font-black">+50</div><div className="text-[10px] font-bold">عميل سعيد</div></div>
              </div>
            </Reveal>
            <div>
              <Reveal><SectionHeading kicker="لماذا نحن" title={<>لماذا تختار <span className="text-gradient">نبراس؟</span></>} description="لأننا لا نكتفي بتصميم شيء جميل، بل نصنع أثراً بصرياً يخدم علامتك ويعكس قيمتها." /></Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {advantages.map((a, i) => (
                  <Reveal key={a.title} delay={i * 60}>
                    <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-xl">{a.icon}</div>
                      <h3 className="text-sm font-black">{a.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{a.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-soft)] py-20">
          <div className="container mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal><SectionHeading kicker="طريقة العمل" title="من الفكرة إلى النتيجة" description="خطوات واضحة وبسيطة لنصل معاً إلى أفضل نتيجة ممكنة." center /></Reveal>
            <div className="grid gap-5 md:grid-cols-4">
              {steps.map((s, i) => <Reveal key={s.n} delay={i * 80}><div className="relative h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><div className="mb-4 text-3xl font-black text-[var(--gold)]/35">{s.n}</div><h3 className="text-sm font-black">{s.title}</h3><p className="mt-2 text-xs leading-6 text-[var(--muted)]">{s.text}</p>{i < 3 && <Icon name="arrow" className="absolute -left-3 top-1/2 hidden h-5 w-5 rotate-180 text-[var(--blue)] md:block" />}</div></Reveal>)}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="container mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
              <SectionHeading kicker="آراء العملاء" title={<>ثقة عملائنا <span className="text-gradient">أكبر إنجازاتنا</span></>} description="كلمات حقيقية من عملاء تعاونا معهم في مشاريع مختلفة." />
              <button onClick={() => setReviewOpen(true)} className="mb-12 inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-5 py-3 text-sm font-bold text-[var(--gold)] transition hover:bg-[var(--gold)]/20"><Icon name="plus" className="h-4 w-4" /> أضف تقييمك</button>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <div className="card-hover flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <div className="mb-4 flex items-center justify-between"><Stars count={t.rating} /><span className="text-3xl font-black text-[var(--blue)]/20">”</span></div>
                  <p className="flex-1 text-sm leading-8 text-[var(--muted)]">{t.text}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient text-sm font-black text-black">{t.name.charAt(0)}</div>
                    <div><div className="text-sm font-bold">{t.name}</div><div className="text-[11px] text-[var(--muted)]">{t.role || "عميل"}</div></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT + REQUEST */}
        <section id="contact" className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--bg-soft)] py-24">
          <div className="container mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal><SectionHeading kicker="لنتواصل" title={<>لنبدأ <span className="text-gradient">مشروعك اليوم</span></>} description="تواصل معنا مباشرة أو أرسل تفاصيل طلبك وسنعود إليك في أقرب وقت." center /></Reveal>
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <Reveal>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
                  <h3 className="mb-1 text-xl font-black">معلومات التواصل</h3>
                  <a href={`tel:+${settings.phone1.replace(/\D/g, "")}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--blue)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl blue-gradient text-white"><Icon name="phone" className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] text-[var(--muted)]">اتصل بنا</span><span className="block font-bold" dir="ltr">{settings.phone1}</span></span>
                  </a>
                  <a href={`tel:+${settings.phone2.replace(/\D/g, "")}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--blue)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--blue-bright)]"><Icon name="phone" className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] text-[var(--muted)]">رقم إضافي</span><span className="block font-bold" dir="ltr">{settings.phone2}</span></span>
                  </a>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--blue)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--gold)]"><Icon name="mail" className="h-5 w-5" /></span>
                    <span className="min-w-0"><span className="block text-[11px] text-[var(--muted)]">البريد الإلكتروني</span><span className="block truncate font-bold" dir="ltr">{settings.email}</span></span>
                  </a>
                  <a href={waLink(settings.whatsapp, "مرحباً نبراس منبه، أود التواصل معك.")} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition hover:border-emerald-500">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white"><Icon name="whatsapp" className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] text-[var(--muted)]">واتساب</span><span className="block font-bold">راسلنا الآن مباشرة</span></span>
                  </a>
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:border-[var(--blue)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877f2] text-white"><Icon name="facebook" className="h-5 w-5" /></span>
                    <span><span className="block text-[11px] text-[var(--muted)]">فيسبوك</span><span className="block font-bold">صفحتنا على فيسبوك</span></span>
                  </a>
                  <div className="mt-auto rounded-2xl border border-[var(--gold)]/25 bg-[var(--gold)]/5 p-4 text-center text-xs font-bold leading-6 text-[var(--gold)]">نصنع الإبداع، ونمنح أفكارك هوية تستحق أن تُرى.</div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div id="request" className="scroll-mt-24 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xl sm:p-9">
                  <div className="mb-7 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl blue-gradient text-white"><Icon name="send" className="h-6 w-6" /></span><div><h3 className="text-xl font-black">طلب خدمة تصميم</h3><p className="text-xs text-[var(--muted)]">املأ البيانات وسنرسل طلبك مباشرة عبر واتساب</p></div></div>
                  <form onSubmit={submitOrder} className="grid gap-4 sm:grid-cols-2">
                    <label className="block"><span className="mb-2 block text-xs font-bold">اسم العميل *</span><input required value={request.name} onChange={(e) => setRequest({ ...request, name: e.target.value })} placeholder="اسمك الكريم" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" /></label>
                    <label className="block"><span className="mb-2 block text-xs font-bold">رقم الهاتف *</span><input required value={request.phone} onChange={(e) => setRequest({ ...request, phone: e.target.value })} placeholder="05xxxxxxxx" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" dir="ltr" /></label>
                    <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-bold">نوع الخدمة المطلوبة *</span><select required value={request.service} onChange={(e) => setRequest({ ...request, service: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]"><option value="">اختر الخدمة</option>{services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}<option value="خدمة أخرى">خدمة أخرى</option></select></label>
                    <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-bold">وصف المشروع والتفاصيل *</span><textarea required rows={4} value={request.details} onChange={(e) => setRequest({ ...request, details: e.target.value })} placeholder="اشرح لنا فكرتك، الجمهور المستهدف، والموعد المطلوب..." className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" /></label>
                    <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-bold">إرفاق صور وملفات (اختياري)</span><input type="file" multiple accept="image/*,.pdf,.ai,.psd" onChange={(e) => setRequest({ ...request, files: Array.from(e.target.files || []).map((f) => f.name).join("، ") })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs outline-none focus:border-[var(--blue)]" /><span className="mt-1 block text-[11px] text-[var(--muted)]">سيتم إرسال أسماء الملفات مع الطلب، ويمكن إرسال الملفات نفسها في محادثة واتساب بعد فتحها.</span></label>
                    <div className="sm:col-span-2"><button type="submit" className="blue-gradient flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1"><Icon name="whatsapp" className="h-5 w-5" /> إرسال الطلب عبر واتساب</button></div>
                  </form>
                  {sent && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-400"><Icon name="check" className="h-4 w-4" /> تم فتح واتساب، أرسل الرسالة لإكمال طلبك. شكراً لك!</div>}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0"><img src="/images/work-motion.png" alt="" className="h-full w-full opacity-20" /><div className="absolute inset-0 bg-gradient-to-l from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/60" /></div>
          <div className="container relative mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <Icon name="spark" className="mx-auto mb-5 h-9 w-9 text-[var(--gold)]" />
              <h2 className="text-3xl font-black leading-[1.4] sm:text-5xl">إبداع يلفت الأنظار... <span className="text-gradient">وتصميم يصنع الانطباع</span></h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[var(--muted)]">لا تترك فكرتك في الانتظار. تواصل معنا الآن ودعنا نصنع لك هوية تستحق أن تُرى.</p>
              <a href={waLink(settings.whatsapp, "مرحباً نبراس، أريد مناقشة مشروع تصميم جديد.")} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-xl blue-gradient px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1"><Icon name="whatsapp" className="h-5 w-5" /> تواصل معنا عبر واتساب</a>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-soft)] pb-8 pt-14">
        <div className="container mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl blue-gradient text-white"><Icon name="spark" className="h-6 w-6" /></span><div><div className="font-black">{settings.siteName}</div><div className="text-[11px] text-[var(--gold)]">{settings.slogan}</div></div></div>
              <p className="mt-5 max-w-sm text-xs leading-7 text-[var(--muted)]">نصنع الإبداع، ونمنح أفكارك هوية تستحق أن تُرى. استوديو متخصص في التصميم والتسويق والدعاية والإعلان.</p>
            </div>
            <div><h4 className="mb-4 text-sm font-black">روابط سريعة</h4><div className="grid grid-cols-2 gap-2">{navItems.map((n) => <button key={n.id} onClick={() => go(n.id)} className="text-right text-xs text-[var(--muted)] transition hover:text-[var(--blue-bright)]">{n.label}</button>)}</div></div>
            <div><h4 className="mb-4 text-sm font-black">تواصل معنا</h4><div className="space-y-2 text-xs text-[var(--muted)]"><a href={`tel:+${settings.phone1.replace(/\D/g, "")}`} className="block transition hover:text-[var(--text)]" dir="ltr">{settings.phone1}</a><a href={`tel:+${settings.phone2.replace(/\D/g, "")}`} className="block transition hover:text-[var(--text)]" dir="ltr">{settings.phone2}</a><a href={`mailto:${settings.email}`} className="block break-all transition hover:text-[var(--text)]" dir="ltr">{settings.email}</a><a href={settings.facebook} target="_blank" rel="noreferrer" className="block transition hover:text-[var(--text)]">صفحتنا على فيسبوك</a></div></div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-[11px] text-[var(--muted)]"><span>© {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة.</span><button onClick={onAdmin} className="inline-flex items-center gap-2 transition hover:text-[var(--gold)]"><Icon name="lock" className="h-3.5 w-3.5" /> لوحة تحكم الإدارة</button></div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <Modal open={lightbox !== null && works.length > 0} onClose={() => setLightbox(null)} wide>
        {lightbox !== null && works[lightbox] && (() => {
          const w: Work = works[lightbox];
          return <div>
            <img src={w.image} alt={w.title} className="max-h-[62vh] w-full bg-black object-contain" />
            <div className="p-6 sm:p-8">
              <div className="mb-3 inline-block rounded-full bg-[var(--blue)]/15 px-3 py-1 text-[11px] font-bold text-[var(--blue-bright)]">{w.category}</div>
              <h3 className="text-2xl font-black">{w.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{w.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]"><span>{w.client} · {w.year}</span><div className="flex gap-2"><button onClick={() => setLightbox((lightbox - 1 + works.length) % works.length)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]"><Icon name="arrow" className="h-4 w-4" /></button><button onClick={() => setLightbox((lightbox + 1) % works.length)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]"><Icon name="arrow" className="h-4 w-4 rotate-180" /></button></div></div>
            </div>
          </div>;
        })()}
      </Modal>

      {/* REVIEW MODAL */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <form onSubmit={submitReview} className="p-7">
          <h3 className="mb-1 text-xl font-black">أضف تقييمك</h3>
          <p className="mb-6 text-xs text-[var(--muted)]">شاركنا تجربتك معنا، سيظهر تقييمك في الموقع مباشرة.</p>
          <div className="space-y-4">
            <input required value={review.name} onChange={(e) => setReview({ ...review, name: e.target.value })} placeholder="الاسم الكريم *" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" />
            <input value={review.role} onChange={(e) => setReview({ ...review, role: e.target.value })} placeholder="الصفة الوظيفية (اختياري)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" />
            <textarea required rows={4} value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} placeholder="اكتب تجربتك معنا..." className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" />
            <div><span className="mb-2 block text-xs font-bold">التقييم</span><div className="flex gap-2">{Array.from({ length: 5 }).map((_, i) => <button type="button" key={i} onClick={() => setReview({ ...review, rating: i + 1 })} className={i < review.rating ? "text-[var(--gold)]" : "text-[var(--muted)] opacity-40"}><Icon name="star" fill className="h-7 w-7" /></button>)}</div></div>
            <button type="submit" className="blue-gradient w-full rounded-xl px-5 py-3.5 text-sm font-bold text-white">إرسال التقييم</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
