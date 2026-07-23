import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Universities table
export const universities = pgTable("universities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  shortName: varchar("short_name", { length: 20 }).notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  type: text("type").notNull(), // "public" | "private"
  nationalRank: integer("national_rank"),
  globalRank: integer("global_rank"),
  matricWeight: real("matric_weight").notNull(),
  interWeight: real("inter_weight").notNull(),
  testWeight: real("test_weight").notNull(),
  testName: text("test_name").notNull(),
  testMaxScore: integer("test_max_score").default(200),
  website: text("website"),
  feesRange: text("fees_range"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Programs per university
export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  universityId: uuid("university_id")
    .notNull()
    .references(() => universities.id),
  name: text("name").notNull(),
  cutoffTypical: real("cutoff_typical"),
  eligibility: text("eligibility"),
  seats: integer("seats"),
});

// Saved calculations
export const calculations = pgTable("calculations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  matricObtained: real("matric_obtained").notNull(),
  matricTotal: real("matric_total").notNull(),
  interObtained: real("inter_obtained").notNull(),
  interTotal: real("inter_total").notNull(),
  isHafiz: boolean("is_hafiz").default(false),
  stream: text("stream").default("Pre-Engineering"),
  testScores: jsonb("test_scores").$type<Record<string, number>>(),
  selectedPrograms: jsonb("selected_programs").$type<string[]>(),
  selectedUniversities: jsonb("selected_universities").$type<string[]>(),
  results: jsonb("results").$type<CalculationResult[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface CalculationResult {
  universityId: string;
  universityName: string;
  programName: string;
  aggregate: number;
  cutoff: number;
  likelihood: "Safe" | "Likely" | "Borderline" | "Reach" | "Unlikely";
  testScoreNeeded: number;
}
