import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { universities, programs, calculations } from "@/db/schema";
import { calculateResults, type UniversityData } from "@/lib/calculator";
import { UNIVERSITY_SEED_DATA } from "@/lib/seed-data";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const CalculateSchema = z.object({
  matricObtained: z.number().min(0).max(2000),
  matricTotal: z.number().min(1).max(2000),
  interObtained: z.number().min(0).max(2000),
  interTotal: z.number().min(1).max(2000),
  isHafiz: z.boolean().default(false),
  stream: z.string().max(100).default("Pre-Engineering"),
  testScores: z.record(z.string(), z.number().min(0).max(100)),
  selectedPrograms: z.array(z.string().max(150)).max(50),
  selectedUniversityIds: z.array(z.string().max(100)).max(50),
  sessionId: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check (30 requests per minute)
    const rateLimit = checkRateLimit(request, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 2. Parse & Validate Body
    const body = await request.json();
    const input = CalculateSchema.parse(body);

    let universityData: UniversityData[] = [];

    // 3. Fetch university data safely from DB
    try {
      const unis = await db.select().from(universities);
      const progs = await db.select().from(programs);

      if (unis && unis.length > 0) {
        universityData = unis.map((uni) => ({
          id: uni.id,
          name: uni.name,
          shortName: uni.shortName,
          city: uni.city,
          province: uni.province,
          type: uni.type,
          nationalRank: uni.nationalRank,
          matricWeight: uni.matricWeight,
          interWeight: uni.interWeight,
          testWeight: uni.testWeight,
          testName: uni.testName,
          programs: progs
            .filter((p) => p.universityId === uni.id)
            .map((p) => ({
              id: p.id,
              name: p.name,
              cutoffTypical: p.cutoffTypical,
              seats: p.seats,
            })),
        }));
      }
    } catch (dbErr) {
      console.warn("DB calculation fetch failed, using seed data fallback:", dbErr);
    }

    // Static fallback if DB is empty or offline
    if (universityData.length === 0) {
      universityData = UNIVERSITY_SEED_DATA.map((uni, i) => ({
        id: `uni-${i + 1}`,
        name: uni.name,
        shortName: uni.shortName,
        city: uni.city,
        province: uni.province,
        type: uni.type,
        nationalRank: uni.nationalRank,
        matricWeight: uni.matricWeight,
        interWeight: uni.interWeight,
        testWeight: uni.testWeight,
        testName: uni.testName,
        programs: uni.programs.map((prog, j) => ({
          id: `prog-${i + 1}-${j + 1}`,
          name: prog.name,
          cutoffTypical: prog.cutoffTypical,
          seats: prog.seats,
        })),
      }));
    }

    const results = calculateResults(input, universityData);

    // 4. Save anonymous calculation session if DB is active
    try {
      const sessionId = input.sessionId || crypto.randomUUID();
      await db.insert(calculations).values({
        sessionId,
        matricObtained: input.matricObtained,
        matricTotal: input.matricTotal,
        interObtained: input.interObtained,
        interTotal: input.interTotal,
        isHafiz: input.isHafiz,
        stream: input.stream,
        testScores: input.testScores,
        selectedPrograms: input.selectedPrograms,
        selectedUniversities: input.selectedUniversityIds,
        results: results.map((r) => ({
          universityId: r.universityId,
          universityName: r.universityName,
          programName: r.programName,
          aggregate: r.aggregate,
          cutoff: r.cutoff,
          likelihood: r.likelihood,
          testScoreNeeded: r.testScoreNeeded,
        })),
      });
    } catch {
      // Non-blocking log save
    }

    return NextResponse.json({ results, sessionId: input.sessionId || "demo-session" });
  } catch (error) {
    console.error("Calculation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input parameters", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Calculation process failed" },
      { status: 500 }
    );
  }
}
