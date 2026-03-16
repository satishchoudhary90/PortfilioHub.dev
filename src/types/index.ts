import { User, Project, Skill, Experience, Education, SocialLink, ThemeSettings } from "@prisma/client";

export type FullUser = User & {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  socialLinks: SocialLink[];
  themeSettings: ThemeSettings | null;
};

export type PortfolioData = {
  user: FullUser;
  analytics?: {
    totalViews: number;
    totalClicks: number;
  };
};

export type Template = "minimal" | "dark-hacker" | "modern-tech" | "creative-designer";

export interface TemplateProps {
  data: PortfolioData;
}

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

export type AnalyticsEvent = "page_view" | "project_click" | "contact_form" | "resume_download";

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  viewsByDay: { date: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
}
