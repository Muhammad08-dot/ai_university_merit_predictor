import { NextRequest, NextResponse } from "next/server";
import { runManagerAgentOrchestrator } from "@/lib/manager-agent";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const AgentRequestSchema = z.object({
  query: z.string().max(500).default("guide"),
  studentProvince: z.string().optional(),
  studentCity: z.string().optional(),
  currentStep: z.number().min(1).max(5).optional(),
  matricPct: z.number().min(0).max(100).optional(),
  interPct: z.number().min(0).max(100).optional(),
  results: z.array(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit agent calls (25 requests per minute)
    const rateLimit = checkRateLimit(request, 25, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 2. Validate Body
    const body = await request.json();
    const parsed = AgentRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { query, studentProvince, studentCity, currentStep, matricPct, interPct, results } = parsed.data;

    // 3. Execute High-Level Multi-Agent Orchestrator
    const agentResult = await runManagerAgentOrchestrator(query, {
      studentProvince,
      studentCity,
      currentStep,
      matricPct,
      interPct,
      results,
    });

    return NextResponse.json({
      text: agentResult.managerResponse,
      subAgentsExecuted: agentResult.subAgentsExecuted,
      suggestedAction: agentResult.suggestedAction,
    });
  } catch (error) {
    console.error("Agent API endpoint error:", error);
    return NextResponse.json(
      { error: "Manager agent orchestration failed" },
      { status: 500 }
    );
  }
}
