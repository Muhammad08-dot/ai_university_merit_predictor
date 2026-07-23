"use client";

import { useState, useEffect } from "react";
import type { MeritResult, Likelihood } from "@/lib/calculator";
import type { AdvisorInsight } from "@/lib/advisor";
import MeritChart from "./MeritChart";

interface Props {
  results: MeritResult[];
  matricPct: number;
  interPct: number;
  onBack: () => void;
  onShowChat: () => void;
  onRecalculate: () => void;
}

const likelihoodConfig: Record<Likelihood, { color: string; bg: string; border: string; label: string; emoji: string; barColor: string }> = {
  Safe: { color: "text-green-800", bg: "bg-green-50", border: "border-green-300", label: "Safe", emoji: "✅", barColor: "bg-green-500" },
  Likely: { color: "text-teal-800", bg: "bg-teal-50", border: "border-teal-300", label: "Likely", emoji: "🎯", barColor: "bg-teal-500" },
  Borderline: { color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-300", label: "Borderline", emoji: "⚡", barColor: "bg-amber-500" },
  Reach: { color: "text-orange-800", bg: "bg-orange-50", border: "border-orange-300", label: "Reach", emoji: "🚀", barColor: "bg-orange-500" },
  Unlikely: { color: "text-red-800", bg: "bg-red-50", border: "border-red-300", label: "Unlikely", emoji: "⛔", barColor: "bg-red-500" },
};

export default function ResultsDashboard({
  results,
  matricPct,
  interPct,
  onBack,
  onShowChat,
  onRecalculate,
}: Props) {
  const [insights, setInsights] = useState<AdvisorInsight[]>([]);
  const [filterLikelihood, setFilterLikelihood] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results, matricPct, interPct }),
        });
        const data = await res.json();
        setInsights(data.insights || []);
      } catch (err) {
        console.error("Failed to load insights:", err);
      }
    }
    loadInsights();
  }, [results, matricPct, interPct]);

  const safeCount = results.filter((r) => r.likelihood === "Safe").length;
  const likelyCount = results.filter((r) => r.likelihood === "Likely").length;
  const borderlineCount = results.filter((r) => r.likelihood === "Borderline").length;
  const reachCount = results.filter((r) => r.likelihood === "Reach").length;
  const unlikelyCount = results.filter((r) => r.likelihood === "Unlikely").length;

  const filteredResults =
    filterLikelihood === "All"
      ? results
      : results.filter((r) => r.likelihood === filterLikelihood);

  return (
    <div className="p-6 sm:p-8">
      {/* Motivational Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4 border border-green-200">
          <span className="text-green-600 font-bold text-sm">🏆 Results Ready!</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Your Merit Dashboard</h2>
        <p className="text-slate-500">
          Matric <span className="font-bold text-green-700">{matricPct.toFixed(1)}%</span> · Inter <span className="font-bold text-green-700">{interPct.toFixed(1)}%</span> — Every mark counts towards your dreams! 🌟
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200 shadow-sm">
          <div className="text-2xl font-black text-green-700">{safeCount}</div>
          <div className="text-xs text-green-800 font-bold">✅ Safe</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 text-center border border-teal-200 shadow-sm">
          <div className="text-2xl font-black text-teal-700">{likelyCount}</div>
          <div className="text-xs text-teal-800 font-bold">🎯 Likely</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center border border-amber-200 shadow-sm">
          <div className="text-2xl font-black text-amber-700">{borderlineCount}</div>
          <div className="text-xs text-amber-800 font-bold">⚡ Borderline</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200 shadow-sm">
          <div className="text-2xl font-black text-orange-700">{reachCount}</div>
          <div className="text-xs text-orange-800 font-bold">🚀 Reach</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200 shadow-sm">
          <div className="text-2xl font-black text-red-700">{unlikelyCount}</div>
          <div className="text-xs text-red-800 font-bold">⛔ Unlikely</div>
        </div>
      </div>

      {/* Chart */}
      {results.length > 0 && (
        <div className="mb-8 bg-gradient-to-br from-green-50/50 to-white rounded-2xl p-4 sm:p-6 border border-green-100 shadow-sm">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            <span>📊</span> Aggregate vs Cutoff Comparison
          </h3>
          <MeritChart results={results.slice(0, 10)} />
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-lg">
            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">🤖</span>
            AI Advisor Insights
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {insights.slice(0, 6).map((insight, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  insight.type === "recommendation"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "tip"
                    ? "bg-teal-50 border-teal-200"
                    : insight.type === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : insight.type === "alternative"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{insight.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{insight.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Safe", "Likely", "Borderline", "Reach", "Unlikely"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterLikelihood(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                filterLikelihood === f
                  ? "bg-green-600 text-white shadow-md shadow-green-200"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              {f} {f !== "All" && `(${results.filter((r) => f === "All" || r.likelihood === f).length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-green-50 rounded-lg p-1 border border-green-200">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              viewMode === "cards" ? "bg-white shadow text-green-800" : "text-green-600"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              viewMode === "table" ? "bg-white shadow text-green-800" : "text-green-600"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Results Cards */}
      {viewMode === "cards" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredResults.map((r, i) => {
            const config = likelihoodConfig[r.likelihood];
            const pct = Math.min(100, Math.max(0, (r.aggregate / Math.max(r.cutoff, 1)) * 100));
            return (
              <div
                key={`${r.universityId}-${r.programId}-${i}`}
                className={`rounded-2xl border-2 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-200 ${config.border} bg-white`}
              >
                <div className={`h-1.5 ${config.barColor}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg">{r.universityShortName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{r.programName}</p>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                      {config.emoji} {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <span>📍 {r.city}</span>
                    <span>·</span>
                    <span className={r.type === "public" ? "text-green-600 font-medium" : "text-purple-600 font-medium"}>{r.type}</span>
                    {r.nationalRank && (
                      <>
                        <span>·</span>
                        <span className="font-medium">🏅 #{r.nationalRank}</span>
                      </>
                    )}
                  </div>

                  {/* Merit comparison */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Your Merit</span>
                      <span className="font-extrabold text-slate-800">{r.aggregate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Cutoff</span>
                      <span className="font-extrabold text-slate-800">{r.cutoff}%</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-green-50/60 rounded-lg p-3 space-y-1 text-xs border border-green-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Matric ({r.matricPct.toFixed(0)}%)</span>
                      <span className="font-bold text-green-800">{r.matricContribution.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inter ({r.interPct.toFixed(0)}%)</span>
                      <span className="font-bold text-green-800">{r.interContribution.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Test ({r.testPct}%)</span>
                      <span className="font-bold text-green-800">{r.testContribution.toFixed(1)}</span>
                    </div>
                    {r.hafizBonus > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>🌙 Hafiz Bonus</span>
                        <span>+{r.hafizBonus}</span>
                      </div>
                    )}
                  </div>

                  {r.likelihood !== "Safe" && r.likelihood !== "Likely" && (
                    <div className="mt-3 text-xs text-slate-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                      💪 Need <strong className="text-amber-800">{r.testScoreNeeded}%</strong> on {r.testName} — You can do it!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Table */}
      {viewMode === "table" && (
        <div className="overflow-x-auto mb-8 rounded-xl border border-green-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
              <tr>
                <th className="text-left p-3 font-bold text-green-800">University</th>
                <th className="text-left p-3 font-bold text-green-800">Program</th>
                <th className="text-center p-3 font-bold text-green-800">Aggregate</th>
                <th className="text-center p-3 font-bold text-green-800">Cutoff</th>
                <th className="text-center p-3 font-bold text-green-800">Status</th>
                <th className="text-center p-3 font-bold text-green-800">Test Needed</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, i) => {
                const config = likelihoodConfig[r.likelihood];
                return (
                  <tr
                    key={`${r.universityId}-${r.programId}-${i}`}
                    className="border-t border-green-100 hover:bg-green-50/50 transition"
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{r.universityShortName}</div>
                      <div className="text-xs text-slate-500">{r.city}</div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{r.programName}</td>
                    <td className="p-3 text-center font-extrabold text-slate-800">{r.aggregate}%</td>
                    <td className="p-3 text-center text-slate-600 font-medium">{r.cutoff}%</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-black px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                        {config.emoji} {config.label}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-600 font-medium">{r.testScoreNeeded}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between items-center pt-4 border-t border-green-100">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-green-50 transition"
        >
          ← Edit Scores
        </button>
        <div className="flex gap-3">
          <button
            onClick={onShowChat}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-green-200 flex items-center gap-2"
          >
            🤖 Ask AI Advisor
          </button>
          <button
            onClick={onRecalculate}
            className="px-6 py-3 gradient-green-btn text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-green-200"
          >
            🔄 New Calculation
          </button>
        </div>
      </div>

      {/* Motivational + Disclaimer */}
      <div className="mt-8 space-y-3">
        <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
          <p className="text-sm font-bold text-green-800">
            🌟 &ldquo;The future belongs to those who believe in the beauty of their dreams.&rdquo; — Keep pushing!
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-800">
            <strong>⚠️ Disclaimer:</strong> These are estimates based on 2025-2026 data.
            Actual cutoffs vary. Always verify with official university portals.
          </p>
        </div>
      </div>
    </div>
  );
}
