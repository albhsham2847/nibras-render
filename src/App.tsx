import { useEffect, useState } from "react";
import Admin from "./components/Admin";
import Site from "./components/Site";
import { defaultData } from "./data";
import type { RequestItem, SiteData, Testimonial } from "./types";
import { todayKey, useStorageStateFallback } from "./utils";

export default function App() {
  const [data, setData] = useState<SiteData>(() => useStorageStateFallback<SiteData>("nibras-site-data", defaultData));
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("nibras-theme") as "dark" | "light") || "dark");
  const [route, setRoute] = useState(() => window.location.hash === "#/admin" ? "admin" : "site");
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("nibras-admin-auth") === "1");

  useEffect(() => {
    try { localStorage.setItem("nibras-site-data", JSON.stringify(data)); }
    catch { console.warn("تعذر حفظ البيانات: المساحة المتاحة في المتصفح غير كافية."); }
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nibras-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (sessionStorage.getItem("nibras-visited")) return;
    sessionStorage.setItem("nibras-visited", "1");
    setData((prev) => {
      const key = todayKey();
      return { ...prev, analytics: { ...prev.analytics, totalVisits: prev.analytics.totalVisits + 1, daily: { ...prev.analytics.daily, [key]: (prev.analytics.daily[key] || 0) + 1 } } };
    });
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash === "#/admin" ? "admin" : "site");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = route === "admin" ? "لوحة التحكم | المصمم نبراس منبه" : "المصمم نبراس منبه | للتصميم والتسويق والإعلان";
  }, [route]);

  const update = (patch: Partial<SiteData>) => setData((prev) => ({ ...prev, ...patch }));

  const goAdmin = () => { window.location.hash = "/admin"; window.scrollTo({ top: 0, behavior: "instant" }); };
  const goSite = () => { window.location.hash = "/"; window.scrollTo({ top: 0, behavior: "instant" }); };

  const submitRequest = (request: RequestItem) => setData((prev) => ({
    ...prev,
    requests: [request, ...prev.requests],
    analytics: { ...prev.analytics, requestCount: prev.analytics.requestCount + 1 },
  }));

  const addTestimonial = (testimonial: Testimonial) => setData((prev) => ({ ...prev, testimonials: [testimonial, ...prev.testimonials] }));

  const login = () => { sessionStorage.setItem("nibras-admin-auth", "1"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem("nibras-admin-auth"); setAuthed(false); goSite(); };

  return route === "admin" ? (
    <Admin
      data={data}
      update={update}
      authed={authed}
      onLogin={login}
      onLogout={logout}
      onExit={goSite}
    />
  ) : (
    <Site
      data={data}
      theme={theme}
      toggleTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}
      onAdmin={goAdmin}
      submitRequest={submitRequest}
      addTestimonial={addTestimonial}
      trackWorkView={() => setData((prev) => ({ ...prev, analytics: { ...prev.analytics, lightboxViews: prev.analytics.lightboxViews + 1 } }))}
    />
  );
}
