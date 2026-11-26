export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type Work = {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  year: string;
  description: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
};

export type RequestItem = {
  id: string;
  name: string;
  phone: string;
  service: string;
  details: string;
  files: string;
  date: string;
  status: "new" | "contacted" | "done";
};

export type Settings = {
  siteName: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  phone1: string;
  phone2: string;
  email: string;
  facebook: string;
  whatsapp: string;
  password: string;
};

export type Analytics = {
  totalVisits: number;
  daily: Record<string, number>;
  requestCount: number;
  lightboxViews: number;
};

export type SiteData = {
  services: Service[];
  works: Work[];
  testimonials: Testimonial[];
  requests: RequestItem[];
  settings: Settings;
  analytics: Analytics;
};
