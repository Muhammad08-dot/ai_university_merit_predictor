import type { MeritResult } from "./calculator";

export interface AdvisorInsight {
  type: "recommendation" | "tip" | "warning" | "info" | "alternative";
  title: string;
  message: string;
  icon: string;
}

export function generateInsights(
  results: MeritResult[],
  matricPct: number,
  interPct: number
): AdvisorInsight[] {
  const insights: AdvisorInsight[] = [];

  if (results.length === 0) {
    insights.push({
      type: "info",
      title: "No Results",
      message: "Please select universities and programs to see your admission analysis.",
      icon: "ℹ️",
    });
    return insights;
  }

  // Overall academic score
  const avgAcademic = (matricPct + interPct) / 2;

  // Top recommendations
  const safe = results.filter((r) => r.likelihood === "Safe");
  const likely = results.filter((r) => r.likelihood === "Likely");
  const borderline = results.filter((r) => r.likelihood === "Borderline");
  const reach = results.filter((r) => r.likelihood === "Reach");
  const unlikely = results.filter((r) => r.likelihood === "Unlikely");

  // Summary insight
  insights.push({
    type: "info",
    title: "Profile Summary",
    message: `Your Matric: ${matricPct.toFixed(1)}% | Intermediate: ${interPct.toFixed(1)}% | Academic Average: ${avgAcademic.toFixed(1)}%. You're analyzing ${results.length} program options across ${new Set(results.map((r) => r.universityId)).size} universities.`,
    icon: "📊",
  });

  // Best match
  if (safe.length > 0) {
    const best = safe[0];
    insights.push({
      type: "recommendation",
      title: "Top Safe Pick",
      message: `${best.universityShortName} — ${best.programName} is a strong safe option with your aggregate of ${best.aggregate}% vs cutoff ${best.cutoff}%. You're ${(best.aggregate - best.cutoff).toFixed(1)}% above the typical cutoff.`,
      icon: "✅",
    });
  }

  if (likely.length > 0) {
    const best = likely[0];
    insights.push({
      type: "recommendation",
      title: "Strong Likely Match",
      message: `${best.universityShortName} — ${best.programName} looks promising! Your aggregate ${best.aggregate}% is close to the cutoff ${best.cutoff}%. Focus on maintaining or improving your entry test score.`,
      icon: "🎯",
    });
  }

  // Borderline advice
  if (borderline.length > 0) {
    const b = borderline[0];
    const improvementNeeded = b.cutoff - b.aggregate + 3;
    insights.push({
      type: "tip",
      title: "Borderline — You Can Make It!",
      message: `${b.universityShortName} — ${b.programName}: You need ~${Math.max(0, improvementNeeded).toFixed(1)}% more on your ${b.testName} to move from Borderline to Likely. Every mark counts! Focus your preparation on this test.`,
      icon: "💪",
    });
  }

  // Reach targets
  if (reach.length > 0) {
    const r = reach[0];
    insights.push({
      type: "warning",
      title: "Ambitious Reach",
      message: `${r.universityShortName} — ${r.programName} is a reach target. You'd need a ${r.testName} score of ~${r.testScoreNeeded}% to have a realistic chance. Consider this as a stretch goal alongside safer options.`,
      icon: "🚀",
    });
  }

  // Test improvement tips
  const needsImprovement = results.filter(
    (r) => r.likelihood === "Borderline" || r.likelihood === "Reach"
  );
  if (needsImprovement.length > 0) {
    const tests = [...new Set(needsImprovement.map((r) => r.testName))];
    insights.push({
      type: "tip",
      title: "Test Preparation Focus",
      message: `Focus on these entry tests for best impact: ${tests.join(", ")}. Even a 5-10% improvement in test scores can shift 2-3 universities from 'Reach' to 'Likely'. Practice previous years' papers and focus on weak subjects.`,
      icon: "📚",
    });
  }

  // Academic strength/weakness
  if (matricPct > interPct + 5) {
    insights.push({
      type: "info",
      title: "Academic Trend",
      message: `Your Matric score (${matricPct.toFixed(1)}%) is notably higher than your Intermediate (${interPct.toFixed(1)}%). Since most universities weigh Intermediate 40-50%, improving your FSc performance (if still in progress) will have the biggest impact.`,
      icon: "📈",
    });
  } else if (interPct > matricPct + 5) {
    insights.push({
      type: "info",
      title: "Strong Improvement",
      message: `Great improvement from Matric (${matricPct.toFixed(1)}%) to Intermediate (${interPct.toFixed(1)}%)! This upward trend is positive. Universities with higher Inter weightage will benefit you most.`,
      icon: "📈",
    });
  }

  // Alternative suggestions
  if (unlikely.length > 0 && safe.length === 0 && likely.length === 0) {
    insights.push({
      type: "alternative",
      title: "Consider These Alternatives",
      message: `Most of your selected options are challenging given current scores. Consider universities like COMSATS, Bahria University, Air University, or University of Lahore which often have lower cutoffs and excellent programs. Also explore programs with lower typical cutoffs.`,
      icon: "🔄",
    });
  }

  // Portfolio balance check
  if (safe.length === 0 && results.length > 0) {
    insights.push({
      type: "warning",
      title: "Add Safety Options",
      message: `You don't have any 'Safe' options in your list. It's recommended to have at least 2-3 safe backup universities. Consider adding universities with lower cutoffs to ensure you have secure admission options.`,
      icon: "⚠️",
    });
  }

  if (safe.length > 0 && reach.length > 0) {
    insights.push({
      type: "info",
      title: "Well-Balanced Portfolio",
      message: `Good strategy! You have a mix of Safe (${safe.length}), Likely (${likely.length}), Borderline (${borderline.length}), and Reach (${reach.length}) options. This gives you both security and aspirational targets.`,
      icon: "⚖️",
    });
  }

  // Hafiz bonus
  const hasHafiz = results.some((r) => r.hafizBonus > 0);
  if (hasHafiz) {
    insights.push({
      type: "info",
      title: "Hafiz-e-Quran Bonus Applied",
      message: `Your Hafiz-e-Quran bonus (+20 marks equivalent ≈ +2% aggregate) has been applied to all calculations. This may help in borderline cases.`,
      icon: "🌙",
    });
  }

  return insights;
}

function isRomanUrduAdvisor(text: string): boolean {
  const urduWords = [
    "kia", "kya", "kaise", "kaisay", "kitne", "kitni", "kitna", "mera", "meri",
    "mere", "batao", "bataen", "batai", "kahan", "konsi", "kon", "uni", "sab",
    "chahiye", "karo", "karna", "ho", "hai", "hain", "salam", "aoa", "shukriya",
    "me", "mein", "par", "se", "ko", "marks", "tayari", "options", "best", "achay"
  ];
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => urduWords.includes(w));
}

export function generateChatResponse(
  query: string,
  results: MeritResult[],
  matricPct: number,
  interPct: number
): string {
  const q = query.toLowerCase().trim();
  const isUrdu = isRomanUrduAdvisor(q);

  // 1. What-if scenario or numerical score query
  if (q.includes("what if") || q.includes("score") || q.includes("if i get") || q.includes("marks") || q.includes("kitne")) {
    const numMatch = q.match(/(\d+)/);
    const newScore = numMatch ? parseInt(numMatch[1]) : 85;

    if (results.length > 0) {
      if (isUrdu) {
        return `📊 **Simulated Scenario (${newScore}% Entry Test Score Par):**\n\n${results
          .slice(0, 5)
          .map((r) => {
            const testW = parseFloat(
              ((r.testContribution / (r.testPct || 1)) * 100).toFixed(0)
            );
            const diff = ((newScore - r.testPct) * testW) / 100;
            const newAgg = r.aggregate + diff;
            const newLikelihood =
              newAgg >= r.cutoff + 8
                ? "Safe"
                : newAgg >= r.cutoff + 3
                ? "Likely"
                : newAgg >= r.cutoff - 2
                ? "Borderline"
                : newAgg >= r.cutoff - 8
                ? "Reach"
                : "Unlikely";
            return `• **${r.universityShortName} ${r.programName}**: ${r.aggregate.toFixed(1)}% → **${newAgg.toFixed(1)}%** (${newLikelihood})`;
          })
          .join("\n")}\n\n💡 *Tip: Entry test mein ${newScore}% score karne se aap ka aggregate kafi behtar ho jayega!*`;
      }

      return `📊 **Simulated Scenario (${newScore}% Entry Test Score):**\n\n${results
        .slice(0, 5)
        .map((r) => {
          const testW = parseFloat(
            ((r.testContribution / (r.testPct || 1)) * 100).toFixed(0)
          );
          const diff = ((newScore - r.testPct) * testW) / 100;
          const newAgg = r.aggregate + diff;
          const newLikelihood =
            newAgg >= r.cutoff + 8
              ? "Safe"
              : newAgg >= r.cutoff + 3
              ? "Likely"
              : newAgg >= r.cutoff - 2
              ? "Borderline"
              : newAgg >= r.cutoff - 8
              ? "Reach"
              : "Unlikely";
          return `• **${r.universityShortName} ${r.programName}**: ${r.aggregate.toFixed(1)}% → **${newAgg.toFixed(1)}%** (${newLikelihood})`;
        })
        .join("\n")}\n\n💡 *Tip: Scoring ${newScore}% significantly boosts your chances across competitive universities!*`;
    }
  }

  // 2. Hafiz-e-Quran bonus
  if (q.includes("hafiz") || q.includes("quran") || q.includes("bonus")) {
    if (isUrdu) {
      return `🌙 **Hafiz-e-Quran Bonus (+20 Marks / +2% Aggregate):**\n\nPakistan ki tamam universities mein Hafiz-e-Quran candidates ko **20 extra marks** (≈ **+2% aggregate boost**) milta hai.\n\nAap Step 1 mein Hafiz bonus switch ko ON karke cutoffs check kar sakte hain!`;
    }
    return `🌙 **Hafiz-e-Quran Bonus (+20 Marks / +2% Aggregate):**\n\nPakistani university admission criteria grant **20 additional marks** (≈ **+2% aggregate boost**) for certified Hafiz-e-Quran candidates.\n\nYou can enable the Hafiz bonus switch in Step 1 of the calculator to see the boost reflected in all cutoffs!`;
  }

  // 3. Formula or weighting queries
  if (q.includes("formula") || q.includes("weight") || q.includes("percentage") || q.includes("nust") || q.includes("fast")) {
    if (isUrdu) {
      return `📐 **Universities Ke Aggregate Formulas:**\n\n• **NUST (NET)**: 75% Entry Test + 15% FSc + 10% Matric\n• **FAST-NUCES**: 50% Entry Test + 40% FSc + 10% Matric\n• **GIKI**: 85% Test + 15% FSc\n• **COMSATS**: 50% NTS NAT + 40% FSc + 10% Matric\n• **UET Lahore**: 33% ECAT + 50% FSc + 17% Matric\n\nUniMatch automatically inhi formulas ke mutabiq aggregate calculate karta hai!`;
    }
    return `📐 **Popular University Weighting Formulas:**\n\n• **NUST (NET)**: 75% Entry Test + 15% FSc + 10% Matric\n• **FAST-NUCES**: 50% Entry Test + 40% FSc + 10% Matric\n• **GIKI**: 85% Test + 15% FSc\n• **COMSATS**: 50% NTS NAT + 40% FSc + 10% Matric\n• **UET Lahore**: 33% ECAT + 50% FSc + 17% Matric\n\nUniMatch automatically calculates your aggregate using these exact formulas!`;
  }

  // 4. Improve chances
  if (q.includes("improve") || q.includes("better") || q.includes("increase") || q.includes("chance") || q.includes("behtar")) {
    const borderline = results.filter(
      (r) => r.likelihood === "Borderline" || r.likelihood === "Reach"
    );
    if (borderline.length > 0) {
      if (isUrdu) {
        return `🎯 **Admission Chances Behtar Karne Ka Tarika:**\n\n${borderline
          .slice(0, 4)
          .map(
            (r) =>
              `📌 **${r.universityShortName} ${r.programName}**: Entry Test (${r.testName}) mein kam az kam **${r.testScoreNeeded.toFixed(0)}%+** score karein.`
          )
          .join("\n\n")}\n\n💡 **Ahem Hidayat:**\n• Past papers ke zariye practice karein.\n• Math aur Physics ke MCQs par khas tawajah dein.\n• Time management sikhne ke liye timed tests dein.`;
      }
      return `🎯 **How to Improve Your Admission Chances:**\n\n${borderline
        .slice(0, 4)
        .map(
          (r) =>
            `📌 **${r.universityShortName} ${r.programName}**: Score **${r.testScoreNeeded.toFixed(0)}%+** on ${r.testName} to reach typical cutoff.`
        )
        .join("\n\n")}\n\n💡 **Actionable Tips:**\n• Solve at least 5 years of past entry test MCQs.\n• Focus heavily on Mathematics & Physics sections.\n• Time yourself: aim for 1-1.5 mins per MCQ.`;
    }
    return isUrdu
      ? "Aap ka profile kafi behtar hai! Entry test ki tayari jari rakhein aur past papers solve karein."
      : "Your profile looks competitive! Focus on maintaining high marks in your entry test and practicing past papers.";
  }

  // 5. Backup / alternative options
  if (q.includes("backup") || q.includes("alternative") || q.includes("other") || q.includes("suggest") || q.includes("doosri")) {
    const safe = results.filter(
      (r) => r.likelihood === "Safe" || r.likelihood === "Likely"
    );
    if (safe.length > 0) {
      if (isUrdu) {
        return `✅ **Aap Ke Liye Safe Aur Backup Options:**\n\n${safe
          .slice(0, 4)
          .map(
            (r) =>
              `• **${r.universityShortName} — ${r.programName}** (${r.city})\n  Aggregate: ${r.aggregate}% vs Cutoff: ${r.cutoff}% → **${r.likelihood}**`
          )
          .join("\n\n")}\n\nIs ke ilawa COMSATS, Bahria University, Air University, aur UMT bhi ache safe backup options hain.`;
      }
      return `✅ **Recommended Safe & Backup Options:**\n\n${safe
        .slice(0, 4)
        .map(
          (r) =>
            `• **${r.universityShortName} — ${r.programName}** (${r.city})\n  Aggregate: ${r.aggregate}% vs Cutoff: ${r.cutoff}% → **${r.likelihood}**`
        )
        .join("\n\n")}\n\nAlso consider COMSATS, Bahria University, Air University, and UMT for accessible cutoffs and strong programs.`;
    }
    return isUrdu
      ? "COMSATS, Bahria University, Air University aur University of Lahore jaise universities explore karein, in ke programs aur cutoffs kafi behtar hain."
      : "Consider universities like COMSATS, Bahria University, Air University, and University of Lahore. They offer excellent accredited programs with accessible aggregate cutoffs.";
  }

  // 6. Best options
  if (q.includes("best") || q.includes("top") || q.includes("recommend") || q.includes("option") || q.includes("achay")) {
    if (results.length > 0) {
      const top = results.slice(0, 5);
      if (isUrdu) {
        return `🏆 **Aap Ke Academic Profile Ke Mutabiq Top Recommendations:**\n\n${top
          .map(
            (r, i) =>
              `${i + 1}. **${r.universityShortName} — ${r.programName}**\n   📍 ${r.city} | Rank: #${r.nationalRank || "N/A"}\n   Aggregate: ${r.aggregate}% | Cutoff: ${r.cutoff}% → **${r.likelihood}**`
          )
          .join("\n\n")}`;
      }
      return `🏆 **Top Recommended Options for Your Profile:**\n\n${top
        .map(
          (r, i) =>
            `${i + 1}. **${r.universityShortName} — ${r.programName}**\n   📍 ${r.city} | Rank: #${r.nationalRank || "N/A"}\n   Merit: ${r.aggregate}% | Cutoff: ${r.cutoff}% → **${r.likelihood}**`
        )
        .join("\n\n")}`;
    }
  }

  // 7. General Catch-All Summary (Bilingual)
  if (isUrdu) {
    return `📊 **Aap Ka Academic Profile:**\n• Matriculation: **${matricPct.toFixed(1)}%**\n• Intermediate: **${interPct.toFixed(1)}%**\n\n${
      results.length > 0
        ? `Aap ke **${results.length}** options analyze kiye gaye hain (${results.filter((r) => r.likelihood === "Safe").length} Safe, ${results.filter((r) => r.likelihood === "Likely").length} Likely, ${results.filter((r) => r.likelihood === "Borderline").length} Borderline).`
        : "Complete cutoffs dekhne ke liye calculator run karein!"
    }\n\n💡 **Mera se puchiein:**\n• *"Agar mere 85% score aya to kya hoga?"*\n• *"Admission chances kaise behtar karun?"*\n• *"Safe backup universities konsi hain?"*`;
  }

  return `📊 **Your Academic Profile:**\n• Matriculation: **${matricPct.toFixed(1)}%**\n• Intermediate: **${interPct.toFixed(1)}%**\n\n${
    results.length > 0
      ? `Analyzing **${results.length}** program options (${results.filter((r) => r.likelihood === "Safe").length} Safe, ${results.filter((r) => r.likelihood === "Likely").length} Likely, ${results.filter((r) => r.likelihood === "Borderline").length} Borderline).`
      : "Select your target universities in the calculator to view detailed aggregate cutoffs!"
  }\n\n💡 **Try Asking Me:**\n• *"What if I score 85 on the entry test?"*\n• *"How can I improve my chances?"*\n• *"Suggest backup universities"*\n• *"What are the weighting formulas?"*`;
}
