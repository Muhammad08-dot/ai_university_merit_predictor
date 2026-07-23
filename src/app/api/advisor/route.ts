import { NextRequest, NextResponse } from "next/server";
import { generateInsights, generateChatResponse } from "@/lib/advisor";
import { getGeminiAdvice } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import type { MeritResult } from "@/lib/calculator";
import { z } from "zod";

const AdvisorSchema = z.object({
  results: z.array(z.any()),
  matricPct: z.number().min(0).max(100),
  interPct: z.number().min(0).max(100),
  query: z.string().max(500, "Query cannot exceed 500 characters").optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check (20 requests per minute)
    const rateLimit = checkRateLimit(request, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 2. Body Validation & Sanitization
    const body = await request.json();
    const parsed = AdvisorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input format", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { results, matricPct, interPct, query } = parsed.data as {
      results: MeritResult[];
      matricPct: number;
      interPct: number;
      query?: string;
    };

    // 3. Process Chat Query if provided
    if (query && query.trim().length > 0) {
      const sanitizedQuery = query.trim().slice(0, 500);

      // Attempt AI response with Google Gemini API first
      const geminiResponse = await getGeminiAdvice(
        sanitizedQuery,
        results,
        matricPct,
        interPct
      );

      if (geminiResponse) {
        return NextResponse.json({ response: geminiResponse, engine: "gemini" });
      }

      // Fallback to local heuristic response generator
      const fallbackResponse = generateChatResponse(
        sanitizedQuery,
        results,
        matricPct,
        interPct
      );
      return NextResponse.json({ response: fallbackResponse, engine: "heuristic" });
    }

    // 4. Return Insights if no specific query
    const insights = generateInsights(results, matricPct, interPct);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Advisor endpoint error:", error);
    return NextResponse.json(
      { error: "Advisor processing failed" },
      { status: 500 }
    );
  }
}
