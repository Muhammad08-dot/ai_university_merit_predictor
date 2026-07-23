import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { universities, programs } from "@/db/schema";
import { UNIVERSITY_SEED_DATA } from "@/lib/seed-data";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Rate limit public GET requests (60 per minute)
    const rateLimit = checkRateLimit(request, 60, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    try {
      const unis = await db.select().from(universities).orderBy(universities.nationalRank);
      const progs = await db.select().from(programs);

      if (unis && unis.length > 0) {
        const result = unis.map((uni) => ({
          ...uni,
          programs: progs.filter((p) => p.universityId === uni.id),
        }));
        return NextResponse.json(result);
      }
    } catch (dbError) {
      console.warn("DB fetch failed, falling back to static seed data:", dbError);
    }

    // Fallback to static seed data formatted as Array
    const fallback = UNIVERSITY_SEED_DATA.map((uni, i) => ({
      id: `uni-${i + 1}`,
      name: uni.name,
      shortName: uni.shortName,
      city: uni.city,
      province: uni.province,
      type: uni.type,
      nationalRank: uni.nationalRank,
      globalRank: uni.globalRank,
      matricWeight: uni.matricWeight,
      interWeight: uni.interWeight,
      testWeight: uni.testWeight,
      testName: uni.testName,
      testMaxScore: uni.testMaxScore,
      website: uni.website,
      feesRange: uni.feesRange,
      programs: uni.programs.map((prog, j) => ({
        id: `prog-${i + 1}-${j + 1}`,
        universityId: `uni-${i + 1}`,
        name: prog.name,
        cutoffTypical: prog.cutoffTypical,
        eligibility: prog.eligibility,
        seats: prog.seats,
      })),
    }));

    return NextResponse.json(fallback);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json([]);
  }
}
