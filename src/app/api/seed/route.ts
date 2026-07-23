import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { universities, programs } from "@/db/schema";
import { UNIVERSITY_SEED_DATA } from "@/lib/seed-data";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check (max 5 requests per 5 minutes)
    const rateLimit = checkRateLimit(request, 5, 300000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many seed attempts." },
        { status: 429 }
      );
    }

    // 2. Security Check: Protect seed endpoint in production
    const seedSecret = process.env.SEED_SECRET;
    if (process.env.NODE_ENV === "production" || seedSecret) {
      const authHeader = request.headers.get("x-seed-secret");
      if (authHeader !== seedSecret) {
        return NextResponse.json(
          { error: "Unauthorized. Valid x-seed-secret header required." },
          { status: 401 }
        );
      }
    }

    // 3. Check if data already exists
    const existing = await db.select().from(universities).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existing.length });
    }

    for (const uni of UNIVERSITY_SEED_DATA) {
      const [inserted] = await db
        .insert(universities)
        .values({
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
        })
        .returning();

      for (const prog of uni.programs) {
        await db.insert(programs).values({
          universityId: inserted.id,
          name: prog.name,
          cutoffTypical: prog.cutoffTypical,
          eligibility: prog.eligibility,
          seats: prog.seats,
        });
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      count: UNIVERSITY_SEED_DATA.length,
    });
  } catch (error) {
    console.error("Seed endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
