import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, text, boolean } from "drizzle-orm/pg-core";

// Session storage table for connect-pg-simple
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const httpSessions = pgTable(
  "http_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table - combines Replit Auth fields + VHUB-3 extended profile
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // VHUB-3 extended fields
  displayName: text("display_name"),
  fullName: text("full_name"),
  artistName: text("artist_name"),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  altPhone: text("alt_phone"),
  birthDate: text("birth_date"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  mainLanguage: text("main_language"),
  additionalLanguages: text("additional_languages"),
  experience: text("experience"),
  specialty: text("specialty"),
  bio: text("bio"),
  portfolioUrl: text("portfolio_url"),
  status: text("status").notNull().default("approved"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
