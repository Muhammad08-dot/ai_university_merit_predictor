import type { MeritResult } from "./calculator";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

/**
 * Calls the Google Gemini API to generate personalized university admission advice.
 * Supports deep query analysis, context awareness, and Roman Urdu language responses.
 */
export async function getGeminiAdvice(
  query: string,
  results: MeritResult[],
  matricPct: number,
  interPct: number
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Signals fallback to local intelligent advisor
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Format student summary and options for prompt context
  const safeOptions = results.filter((r) => r.likelihood === "Safe").map((r) => `${r.universityShortName} (${r.programName}): Agg ${r.aggregate}% vs Cutoff ${r.cutoff}%`);
  const likelyOptions = results.filter((r) => r.likelihood === "Likely").map((r) => `${r.universityShortName} (${r.programName}): Agg ${r.aggregate}% vs Cutoff ${r.cutoff}%`);
  const borderlineOptions = results.filter((r) => r.likelihood === "Borderline").map((r) => `${r.universityShortName} (${r.programName}): Agg ${r.aggregate}% vs Cutoff ${r.cutoff}% (Test Needed: ${r.testScoreNeeded}%)`);
  const reachOptions = results.filter((r) => r.likelihood === "Reach").map((r) => `${r.universityShortName} (${r.programName}): Agg ${r.aggregate}% vs Cutoff ${r.cutoff}% (Test Needed: ${r.testScoreNeeded}%)`);

  const systemInstruction = `You are UniMatch AI, an intelligent, empathetic, and expert university admissions advisor and web guide for students in Pakistan.

Your Responsibilities:
1. Deeply analyze the student's message, intent, questions, numbers (marks, test scores), and sentiment.
2. LANGUAGE FLEXIBILITY (CRITICAL):
   - If the student writes in Roman Urdu (e.g. "Mera aggregate kitna banega", "NUST ke liye kitne marks chahiye", "Step 1 me kya karna hai", "AoA / Salam"), YOU MUST RESPOND IN NATURAL ROMAN URDU!
   - If the student writes in English, respond in English.
   - If the student uses a mix, respond in a natural Roman Urdu / English hybrid.
3. Provide accurate guidance on Pakistan university admission criteria (NUST NET, FAST Test, GIKI, COMSATS NTS, ECAT, NUMS, PU, etc.).
4. Explain how to use the UniMatch web app step-by-step when asked.
5. Format with bolding, bullet points, and clean emojis. Keep under 250 words.

Student Academic Context:
- Matriculation Percentage: ${matricPct > 0 ? matricPct.toFixed(1) + "%" : "Not entered yet"}
- Intermediate Percentage: ${interPct > 0 ? interPct.toFixed(1) + "%" : "Not entered yet"}
- Safe Options: ${safeOptions.length > 0 ? safeOptions.join("; ") : "None calculated yet"}
- Likely Options: ${likelyOptions.length > 0 ? likelyOptions.join("; ") : "None calculated yet"}
- Borderline Options: ${borderlineOptions.length > 0 ? borderlineOptions.join("; ") : "None calculated yet"}
- Reach Options: ${reachOptions.length > 0 ? reachOptions.join("; ") : "None calculated yet"}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemInstruction}\n\nStudent Query: "${query}"`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API HTTP Error ${response.status}:`, errText);
      return null;
    }

    const data: GeminiResponse = await response.json();
    if (data.error) {
      console.error("Gemini API returned error:", data.error);
      return null;
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer?.trim() || null;
  } catch (error) {
    console.error("Gemini API Network/Fetch Error:", error);
    return null;
  }
}
