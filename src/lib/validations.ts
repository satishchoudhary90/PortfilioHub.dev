import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Username can only contain lowercase letters, numbers, and hyphens"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Username can only contain lowercase letters, numbers, and hyphens"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  headline: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  techStack: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(0).max(100),
  category: z.string().default("general"),
  icon: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  grade: z.string().optional(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().min(1, "URL is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const themeSchema = z.object({
  template: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  fontFamily: z.string(),
  layout: z.string(),
  darkMode: z.boolean(),
  customCss: z.string().nullable().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ThemeInput = z.infer<typeof themeSchema>;
