import { calculateAggregate, type MeritResult } from "./calculator";
import { getGeminiAdvice } from "./gemini";

export interface AgentContext {
  studentProvince?: string;
  studentCity?: string;
  currentStep?: number;
  matricPct?: number;
  interPct?: number;
  results?: MeritResult[];
}

export interface SubAgentResponse {
  agentName: string;
  output: string;
  metadata?: Record<string, unknown>;
}

export interface ManagerAgentResponse {
  managerResponse: string;
  subAgentsExecuted: SubAgentResponse[];
  suggestedAction?: string;
}

/**
 * Worker Agent 1: Location & Provincial Quota Agent
 */
export function runLocationAgent(context: AgentContext, query: string): SubAgentResponse {
  const prov = context.studentProvince || "Federal";
  const city = context.studentCity || "Islamabad";
  const q = query.toLowerCase();

  const provinceUniversities: Record<string, string[]> = {
    Punjab: ["UET Lahore", "PU Lahore", "LUMS", "FAST Lahore", "COMSATS Sahiwal/Wah"],
    Sindh: ["NED Karachi", "IBA Karachi", "AKU Karachi", "Mehran UET Jamshoro", "SZABIST"],
    KPK: ["GIKI Swabi", "UET Peshawar", "IMSciences Peshawar", "FAST Peshawar"],
    Balochistan: ["BUITEMS Quetta", "University of Balochistan"],
    Federal: ["NUST Islamabad", "COMSATS Islamabad", "PIEAS", "Air University", "Bahria"],
    AJK: ["MUST Mirpur", "Poonch University"],
    "Gilgit-Baltistan": ["Karakoram International University Gilgit"],
  };

  const localUnis = provinceUniversities[prov] || provinceUniversities["Federal"];

  let output = `📍 **Location Analysis (${prov} / ${city}):**\n\n`;
  output += `• **Home Province Top Universities:** ${localUnis.join(", ")}\n`;
  output += `• **Nationwide Access:** As a student from ${prov}, you are eligible to apply to all universities across Pakistan (NUST, FAST, GIKI, NED, UET, etc.).\n`;

  if (q.includes("quota") || q.includes("seat") || q.includes("province")) {
    output += `• **Provincial Quotas:** Public engineering and medical universities (e.g., UET, NED, UET Peshawar, BUITEMS) reserve specific seat quotas for domicile holders of ${prov}!`;
  }

  return {
    agentName: "LocationAgent",
    output,
    metadata: { province: prov, city, localUnis },
  };
}

/**
 * Worker Agent 2: Merit & Calculation Agent
 */
export function runMeritAgent(context: AgentContext, query: string): SubAgentResponse {
  const matric = context.matricPct || 85;
  const inter = context.interPct || 85;

  const sim50 = calculateAggregate(matric, inter, 80, 10, 40, 50, false);
  const sim75 = calculateAggregate(matric, inter, 80, 10, 15, 75, false);

  let output = `⚡ **Merit & Aggregate Calculations:**\n\n`;
  output += `• **50% Test Formula (FAST/COMSATS):** **${sim50.aggregate}%** (with 80% entry test)\n`;
  output += `• **75% Test Formula (NUST NET):** **${sim75.aggregate}%** (with 80% entry test)\n`;
  output += `• **Hafiz-e-Quran Addition:** Adds +2% aggregate equivalent (+20 marks on 1100 scale).\n`;

  return {
    agentName: "MeritAgent",
    output,
    metadata: { sim50: sim50.aggregate, sim75: sim75.aggregate },
  };
}

/**
 * Worker Agent 3: Admissions & Portfolio Strategy Agent
 */
export function runStrategyAgent(context: AgentContext, query: string): SubAgentResponse {
  const results = context.results || [];
  const safe = results.filter((r) => r.likelihood === "Safe");
  const likely = results.filter((r) => r.likelihood === "Likely");
  const borderline = results.filter((r) => r.likelihood === "Borderline");
  const reach = results.filter((r) => r.likelihood === "Reach");

  let output = `🎯 **Admissions Strategy & Portfolio Balance:**\n\n`;
  if (results.length > 0) {
    output += `• **Portfolio Breakdown:** ${safe.length} Safe | ${likely.length} Likely | ${borderline.length} Borderline | ${reach.length} Reach\n`;
    if (safe.length === 0) {
      output += `⚠️ **Strategy Warning:** You have 0 Safe backup options. Consider adding COMSATS, Air, or Bahria to secure admission.\n`;
    } else {
      output += `✅ **Strategy Note:** Well-balanced portfolio! You have secure safe options and aspirational reach targets.\n`;
    }
  } else {
    output += `• Recommended Strategy: Select at least 4-5 universities across Pakistan to compare Safe vs Reach cutoffs.\n`;
  }

  return {
    agentName: "StrategyAgent",
    output,
    metadata: { safeCount: safe.length, reachCount: reach.length },
  };
}

/**
 * High-Level Central Manager Agent (Synthesizer & Multi-Agent Router)
 */
export async function runManagerAgentOrchestrator(
  userQuery: string,
  context: AgentContext
): Promise<ManagerAgentResponse> {
  const subAgentsExecuted: SubAgentResponse[] = [];

  // 1. Try Gemini API first if API Key is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiText = await getGeminiAdvice(
        `[Manager Agent Mode - Student Location: ${context.studentProvince || "Pakistan"}, ${context.studentCity || "City"}]: "${userQuery}"`,
        context.results || [],
        context.matricPct || 0,
        context.interPct || 0
      );
      if (geminiText) {
        // Execute worker sub-agents in background to enrich metadata
        subAgentsExecuted.push(runLocationAgent(context, userQuery));
        subAgentsExecuted.push(runMeritAgent(context, userQuery));
        subAgentsExecuted.push(runStrategyAgent(context, userQuery));

        return {
          managerResponse: geminiText,
          subAgentsExecuted,
          suggestedAction: "Run Full Merit Calculation",
        };
      }
    } catch {
      // Fall through to local multi-agent synthesis
    }
  }

  // 2. Local Multi-Agent Execution & Synthesis
  const locResponse = runLocationAgent(context, userQuery);
  const meritResponse = runMeritAgent(context, userQuery);
  const stratResponse = runStrategyAgent(context, userQuery);

  subAgentsExecuted.push(locResponse);
  subAgentsExecuted.push(meritResponse);
  subAgentsExecuted.push(stratResponse);

  const managerResponse = `🤖 **High-Level Multi-Agent System Report:**\n\n${locResponse.output}\n${meritResponse.output}\n${stratResponse.output}`;

  return {
    managerResponse,
    subAgentsExecuted,
    suggestedAction: "Guide me through Step 1",
  };
}
