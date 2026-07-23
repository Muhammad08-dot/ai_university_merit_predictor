import { calculateAggregate } from "./calculator";
import { getGeminiAdvice } from "./gemini";

export interface AgentToolResult {
  toolName: string;
  output: string;
  data?: Record<string, unknown>;
}

export interface AgentStepGuide {
  step: number;
  title: string;
  explanation: string;
  tips: string[];
}

/**
 * Roman Urdu Keyword Detector
 */
function isRomanUrdu(text: string): boolean {
  const urduWords = [
    "kia", "kya", "kaise", "kaisay", "kitne", "kitni", "kitna", "mera", "meri",
    "mere", "batao", "bataen", "batai", "batao", "kahan", "konsi", "kon", "uni",
    "aggregate", "chahiye", "karo", "karna", "ho", "hai", "hain", "salam", "aoa",
    "assalam", "shukriya", "me", "mein", "par", "se", "ko", "parh", "marks", "tayari"
  ];
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => urduWords.includes(w));
}

/**
 * Extract marks or numbers from text
 */
function extractNumbers(text: string): number[] {
  const matches = text.match(/\b\d+\b/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Step Explanations (Bilingual)
 */
export function explainAppStep(step: number, isUrdu: boolean = false): AgentStepGuide {
  if (isUrdu) {
    switch (step) {
      case 1:
        return {
          step: 1,
          title: "Step 1: Academic Marks Enter Karein 📝",
          explanation: "Yahan apne Matric (SSC) aur Intermediate (HSSC/FSc) ke obtained aur total marks enter karein. Apni stream (Pre-Engineering, ICS, Medical) select karein.",
          tips: [
            "Agar 2nd year ka result nahi aya to 1st year ke expected marks enter karein.",
            "Agar aap Hafiz-e-Quran hain to Hafiz bonus switch ON karein (+20 marks / +2% aggregate addition).",
            "Total marks board format ke mutabiq enter karein (e.g. 1100)."
          ],
        };
      case 2:
        return {
          step: 2,
          title: "Step 2: Degree Programs Choose Karein 🎯",
          explanation: "Apne pasandida degree programs select karein (BS Computer Science, Software Engineering, Electrical, Business wagaira).",
          tips: [
            "Quick category buttons (IT/CS, Engineering, Business) se jaldi select karein.",
            "Ziyada programs select karne se aap mukhtalif cutoffs compare kar sakte hain."
          ],
        };
      case 3:
        return {
          step: 3,
          title: "Step 3: Target Universities Select Karein 🏫",
          explanation: "Pakistan ki top universities (NUST, FAST, GIKI, COMSATS, UET, PU) select karein jin mein aap apply karna chahte hain.",
          tips: [
            "City (Islamabad, Lahore) aur Type (Public/Private) ke mutabiq filter karein.",
            "NUST/FAST ke sath COMSATS aur Air Uni jaise safe backup options bhi zaroor rakhein."
          ],
        };
      case 4:
        return {
          step: 4,
          title: "Step 4: Entry Test Marks Predict Karein 📊",
          explanation: "Har university ke entry test (NET, FAST Test, ECAT, NAT) ke expected score percentage slider se set karein.",
          tips: [
            "Quick set buttons (75%, 80%, 85%) se tamam tests ke marks ek sath set karein.",
            "'Calculate My Merit' button par click karke apna complete dashboard dekhein."
          ],
        };
      default:
        return {
          step: 1,
          title: "UniMatch App Kaise Use Karein 🧭",
          explanation: "UniMatch aap ka exact merit aggregate calculate karta hai.",
          tips: ["Step 1 se shuru karein aur marks enter karein."],
        };
    }
  }

  switch (step) {
    case 1:
      return {
        step: 1,
        title: "Step 1: Academic Profile Input",
        explanation: "Enter your Matriculation (SSC) and Intermediate (HSSC/FSc) obtained and total marks. Select your stream (Pre-Engineering, ICS, Pre-Medical, etc.).",
        tips: [
          "If 2nd-year results are awaited, enter your 1st-year expected percentage.",
          "Check 'Hafiz-e-Quran' if applicable (+20 marks / +2% aggregate equivalent).",
          "Ensure total marks match your board format (e.g. 1100)."
        ],
      };
    case 2:
      return {
        step: 2,
        title: "Step 2: Select Academic Programs",
        explanation: "Choose your target degree programs (BS Computer Science, Software Engineering, Electrical Engineering, Business, etc.).",
        tips: [
          "Use quick category buttons (IT/CS, Core Engineering, Business) for fast selection.",
          "Selecting multiple programs allows easy cutoff comparison."
        ],
      };
    case 3:
      return {
        step: 3,
        title: "Step 3: Target Universities Selection",
        explanation: "Select your target universities in Pakistan (NUST, FAST, GIKI, COMSATS, UET, PU, etc.) to analyze.",
        tips: [
          "Filter by City (Islamabad, Lahore) or Type (Public / Private).",
          "Include a mix of high-cutoff (NUST, FAST) and safe backup options (COMSATS, Bahria, Air)."
        ],
      };
    case 4:
      return {
        step: 4,
        title: "Step 4: Entry Test Score Prediction",
        explanation: "Set your predicted score percentage slider for each university's entry test.",
        tips: [
          "Use 'Quick Set All Tests' buttons (e.g. 75%, 80%) to set scores across all universities.",
          "Click 'Calculate My Merit' to generate your admissions dashboard."
        ],
      };
    default:
      return {
        step: 1,
        title: "Overview of UniMatch Predictor",
        explanation: "UniMatch calculates your exact merit aggregate across top universities in Pakistan using official weighting formulas.",
        tips: ["Start by filling out your Matric and Intermediate marks in Step 1."],
      };
  }
}

/**
 * Formula Breakdowns
 */
export function getFormulaBreakdown(uniName?: string, isUrdu: boolean = false): string {
  if (isUrdu) {
    const urduFormulas: Record<string, string> = {
      nust: "🏛️ NUST (NET): 75% Entry Test (NET) + 15% FSc + 10% Matric",
      fast: "💻 FAST-NUCES: 50% Entry Test + 40% FSc + 10% Matric",
      giki: "⚙️ GIKI: 85% GIKI Test + 15% FSc",
      comsats: "🌐 COMSATS: 50% NTS NAT + 40% FSc + 10% Matric",
      pu: "🎓 Punjab University (PU): 70% FSc + 30% Entry Test",
      uet: "🏗️ UET Lahore (ECAT): 33% ECAT + 50% FSc + 17% Matric",
    };
    return Object.values(urduFormulas).join("\n\n");
  }

  const formulas: Record<string, string> = {
    nust: "🏛️ NUST (NET): 75% Entry Test (NET) + 15% HSSC/FSc + 10% SSC/Matric",
    fast: "💻 FAST-NUCES: 50% Entry Test / SAT + 40% HSSC/FSc + 10% SSC/Matric",
    giki: "⚙️ GIKI: 85% GIKI Admission Test + 15% HSSC/FSc",
    comsats: "🌐 COMSATS: 50% NTS NAT Test + 40% HSSC/FSc + 10% SSC/Matric",
    pu: "🎓 Punjab University (PU): 70% HSSC/FSc + 30% Entry Test",
    uet: "🏗️ UET Lahore (ECAT): 33% ECAT + 50% HSSC/FSc + 17% SSC/Matric",
  };
  return Object.values(formulas).join("\n\n");
}

/**
 * Orchestration Agent Core Loop with Deep Analysis & Roman Urdu Support
 */
export async function runAgentOrchestrator(
  userQuery: string,
  currentStep?: number,
  matricPct?: number,
  interPct?: number
): Promise<{ text: string; toolsExecuted: AgentToolResult[]; suggestedAction?: string }> {
  const q = userQuery.toLowerCase().trim();
  const toolsExecuted: AgentToolResult[] = [];
  const isUrdu = isRomanUrdu(q);
  const nums = extractNumbers(q);

  // 1. Try Gemini API first if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiText = await getGeminiAdvice(
        `[Student Query Analysis: Language=${isUrdu ? "Roman Urdu" : "English"}]: "${userQuery}"`,
        [],
        matricPct || 0,
        interPct || 0
      );
      if (geminiText) {
        return {
          text: geminiText,
          toolsExecuted: [{ toolName: "geminiAI", output: "Gemini deep analysis and Roman Urdu response generated" }],
          suggestedAction: isUrdu ? "Step 1 Par Jaein" : "Guide me through Step 1",
        };
      }
    } catch {
      // Fall through to local intelligent agent
    }
  }

  // 2. Dynamic Numerical Marks Extraction
  if (nums.length >= 2) {
    const extractedMatric = Math.min(...nums) > 100 ? (Math.min(...nums) / 1100) * 100 : Math.min(...nums);
    const extractedInter = Math.max(...nums) > 100 ? (Math.max(...nums) / 1100) * 100 : Math.max(...nums);
    const result = calculateAggregate(extractedMatric, extractedInter, 80, 10, 40, 50, false);

    toolsExecuted.push({
      toolName: "extractAndCalculate",
      output: `Calculated aggregate for extracted marks: ${result.aggregate}%`,
    });

    if (isUrdu) {
      return {
        text: `📊 **Aap Ke Marks Ka Aggregate Preview:**\n\n• **Matric Percentage:** ${extractedMatric.toFixed(1)}%\n• **FSc Percentage:** ${extractedInter.toFixed(1)}%\n• **Estimated Aggregate (80% Entry Test Par):** **${result.aggregate}%**\n\n💡 Full details aur tamam universities ke cutoffs dekhne ke liye calculator run karein!`,
        toolsExecuted,
        suggestedAction: "Full Aggregate Calculate Karein",
      };
    }

    return {
      text: `📊 **Extracted Profile Aggregate Preview:**\n\n• **Matric:** ${extractedMatric.toFixed(1)}%\n• **Intermediate:** ${extractedInter.toFixed(1)}%\n• **Estimated Aggregate (with 80% Entry Test):** **${result.aggregate}%**\n\nRun the full calculator to see your exact odds across NUST, FAST, COMSATS, GIKI, and UET!`,
      toolsExecuted,
      suggestedAction: "Run Full Merit Calculation",
    };
  }

  // 3. Step Guidance (Bilingual)
  if (q.includes("step") || q.includes("kaise") || q.includes("how to use") || q.includes("guide") || q.includes("start") || q.includes("karo")) {
    const targetStep = currentStep || (q.includes("1") ? 1 : q.includes("2") ? 2 : q.includes("3") ? 3 : q.includes("4") ? 4 : 1);
    const stepGuide = explainAppStep(targetStep, isUrdu);
    
    toolsExecuted.push({
      toolName: "explainAppStep",
      output: `Explained Step ${targetStep} (Urdu=${isUrdu})`,
      data: stepGuide as unknown as Record<string, unknown>,
    });

    if (isUrdu) {
      return {
        text: `🧭 **${stepGuide.title}**\n\n${stepGuide.explanation}\n\n💡 **Hidayat / Pro Tips:**\n${stepGuide.tips.map((t) => `• ${t}`).join("\n")}`,
        toolsExecuted,
        suggestedAction: targetStep < 4 ? `Step ${targetStep + 1} Par Jaein` : "Results Dashboard Dekhein",
      };
    }

    return {
      text: `🧭 **${stepGuide.title}**\n\n${stepGuide.explanation}\n\n💡 **Pro Tips:**\n${stepGuide.tips.map((t) => `• ${t}`).join("\n")}`,
      toolsExecuted,
      suggestedAction: targetStep < 4 ? `Proceed to Step ${targetStep + 1}` : "View Results Dashboard",
    };
  }

  // 4. Formulas (Bilingual)
  if (q.includes("formula") || q.includes("weight") || q.includes("nust") || q.includes("fast") || q.includes("giki") || q.includes("comsats") || q.includes("uet") || q.includes("pu")) {
    const breakdown = getFormulaBreakdown(q, isUrdu);
    toolsExecuted.push({
      toolName: "getFormulaBreakdown",
      output: "Retrieved formula breakdown",
    });

    if (isUrdu) {
      return {
        text: `📐 **Universities Ke Aggregate Formulas:**\n\n${breakdown}\n\nUniMatch predictor aap ka aggregate inhi official percentage weightages ke mutabiq calculate karta hai!`,
        toolsExecuted,
        suggestedAction: "Universities Select Karein",
      };
    }

    return {
      text: `📐 **University Aggregate Weighting Formulas:**\n\n${breakdown}\n\nUniMatch automatically applies these exact formulas when calculating your merit aggregate!`,
      toolsExecuted,
      suggestedAction: "Select Target Universities",
    };
  }

  // 5. Hafiz Bonus (Bilingual)
  if (q.includes("hafiz") || q.includes("quran") || q.includes("bonus")) {
    if (isUrdu) {
      return {
        text: `🌙 **Hafiz-e-Quran Bonus (+20 Marks / +2% Aggregate):**\n\nPakistan ki university admission rules ke tehat Hafiz-e-Quran candidates ko **20 extra marks** (ya **+2% aggregate boost**) milta hai.\n\nIs bonus ko apply karne ke liye Step 1 mein **'Hafiz-e-Quran Bonus'** switch ko ON karein!`,
        toolsExecuted,
        suggestedAction: "Step 1 Mein Hafiz Bonus ON Karein",
      };
    }

    return {
      text: `🌙 **Hafiz-e-Quran Bonus (+20 Marks / +2% Aggregate):**\n\nUnder Pakistani university admission regulations, certified Hafiz-e-Quran candidates receive **20 additional marks** (≈ **+2% aggregate boost**).\n\nToggle the **'Hafiz-e-Quran Bonus'** switch in Step 1 to apply this boost to all your aggregate cutoffs!`,
      toolsExecuted,
      suggestedAction: "Toggle Hafiz Bonus in Step 1",
    };
  }

  // 6. Catch-All Intelligent Bilingual Response
  if (isUrdu) {
    return {
      text: `🤖 **UniMatch AI Web Guide Agent (Roman Urdu)**\n\nAssalam-o-Alaikum! Main aap ki university admissions aur aggregate calculation mein madad karne ke liye hazir hun.\n\n Aap mujh se ye puch sakte hain:\n1. 🧭 *"Step 1 me marks kaise enter karun?"*\n2. 📐 *"NUST aur FAST ka formula kya hai?"*\n3. 🌙 *"Hafiz bonus kaise add hoga?"*\n4. 📊 *"Safe aur Reach categories ka kya matlab hai?"*`,
      toolsExecuted: [{ toolName: "romanUrduGuide", output: "Responded in Roman Urdu" }],
      suggestedAction: "Step 1 Se Shuru Karein",
    };
  }

  return {
    text: `🤖 **UniMatch AI Web Guide Agent**\n\nI analyze your messages to provide personalized admissions guidance and app navigation in both English and Roman Urdu!\n\nHow can I assist you today?\n• *"How do I enter my marks in Step 1?"*\n• *"What is NUST NET weighting formula?"*\n• *"Mera aggregate kitna banega?"*\n• *"Explain Hafiz-e-Quran bonus"`,
    toolsExecuted: [{ toolName: "generalGuide", output: "Provided general intelligent guide" }],
    suggestedAction: "Guide me through Step 1",
  };
}
