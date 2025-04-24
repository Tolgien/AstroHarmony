import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  author: text("author").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

// Zodiac signs table
export const zodiacSigns = pgTable("zodiac_signs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  symbol: text("symbol").notNull(),
  element: text("element").notNull(),
  planet: text("planet").notNull(),
  dateRange: text("date_range").notNull(),
  traits: text("traits").notNull(),
  strengths: text("strengths").notNull(),
  weaknesses: text("weaknesses").notNull(),
  description: text("description").notNull(),
  compatibility: text("compatibility").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertZodiacSignSchema = createInsertSchema(zodiacSigns).omit({
  id: true,
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  birthDate: timestamp("birth_date"),
  birthTime: text("birth_time"),
  birthPlace: text("birth_place"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

// Saved birth charts table
export const birthCharts = pgTable("birth_charts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  birthDate: timestamp("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  birthPlace: text("birth_place").notNull(),
  chartData: jsonb("chart_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBirthChartSchema = createInsertSchema(birthCharts).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertZodiacSign = z.infer<typeof insertZodiacSignSchema>;
export type ZodiacSign = typeof zodiacSigns.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBirthChart = z.infer<typeof insertBirthChartSchema>;
export type BirthChart = typeof birthCharts.$inferSelect;

// Astrologer appointment table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  appointmentType: text("appointment_type").notNull(),
  notes: text("notes"),
  confirmed: boolean("confirmed").notNull().default(false),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  confirmed: true,
  completed: true,
  createdAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
