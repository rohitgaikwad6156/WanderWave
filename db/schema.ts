import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  companyName: text("company_name").notNull().default(""),
  industry: text("industry").notNull().default(""),
  hrEmail: text("hr_email").notNull().default(""),
  city: text("city").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tripPlans = pgTable("trip_plans", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  dest: text("dest").notNull(),
  destId: text("dest_id").notNull().default(""),
  destEmoji: text("dest_emoji").notNull().default("✈️"),
  route: text("route").notNull().default(""),
  days: integer("days").notNull().default(1),
  startDate: text("start_date").notNull().default(""),
  teamSize: integer("team_size").notNull().default(10),
  sentTo: integer("sent_to").notNull().default(0),
  dayPlans: jsonb("day_plans"),
  routeDetails: jsonb("route_details"),
  company: text("company").notNull().default(""),
  date: text("date").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentRecords = pgTable("payment_records", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  destId: text("dest_id").notNull(),
  startDate: text("start_date").notNull(),
  ref: text("ref").notNull(),
  amount: integer("amount").notNull().default(0),
  paidAt: text("paid_at").notNull(),
  isPaid: boolean("is_paid").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
