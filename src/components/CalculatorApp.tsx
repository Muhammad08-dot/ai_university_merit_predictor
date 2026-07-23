"use client";

import { useState, useEffect, useCallback } from "react";
import StepWizard from "./StepWizard";
import ResultsDashboard from "./ResultsDashboard";
import AIChatPanel from "./AIChatPanel";
import type { MeritResult } from "@/lib/calculator";
import { UNIVERSITY_SEED_DATA } from "@/lib/seed-data";
import { PROVINCE_CITIES } from "@/lib/cities";

interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: string;
  type: string;
  nationalRank: number | null;
  matricWeight: number;
  interWeight: number;
  testWeight: number;
  testName: string;
  testMaxScore: number;
  website: string;
  feesRange: string;
  programs: Program[];
}

interface Program {
  id: string;
  name: string;
  cutoffTypical: number | null;
  eligibility: string | null;
  seats: number | null;
  universityId: string;
}

const STEP_LABELS = ["Academic", "Programs", "Universities", "Test Scores", "Results"];

const PROGRAM_CATEGORIES = [
  {
    name: "Computer Science & IT",
    icon: "💻",
    programs: [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Artificial Intelligence",
      "BS Data Science",
      "BS Cyber Security",
      "BS Information Technology",
      "BS Computer Engineering",
      "BS Bioinformatics",
    ],
  },
  {
    name: "Electrical & Electronics Engineering",
    icon: "⚡",
    programs: [
      "BS Electrical Engineering",
      "BS Electronic Engineering",
      "BS Telecommunication Engineering",
      "BS Avionics Engineering",
      "BS Electronics",
    ],
  },
  {
    name: "Mechanical & Aerospace Engineering",
    icon: "✈️",
    programs: [
      "BS Mechanical Engineering",
      "BS Mechatronics Engineering",
      "BS Aerospace Engineering",
      "BS Automotive Engineering",
      "BS Industrial Engineering",
    ],
  },
  {
    name: "Civil & Architecture",
    icon: "🏗️",
    programs: [
      "BS Civil Engineering",
      "BS Architectural Engineering",
      "BS Architecture",
      "BS Urban Planning",
      "BS Transportation Engineering",
      "BS Environmental Engineering",
    ],
  },
  {
    name: "Chemical, Petroleum & Materials",
    icon: "🧪",
    programs: [
      "BS Chemical Engineering",
      "BS Petroleum Engineering",
      "BS Mining Engineering",
      "BS Metallurgical Engineering",
      "BS Polymer Engineering",
      "BS Materials Engineering",
      "BS Textile Engineering",
      "BS Geological Engineering",
    ],
  },
  {
    name: "Biomedical & Health Sciences",
    icon: "🏥",
    programs: [
      "BS Biomedical Engineering",
      "BS Pharmacy",
      "Doctor of Physical Therapy",
      "BS Nursing",
      "BS Medical Lab Technology",
      "BS Radiology",
      "BS Optometry",
    ],
  },
  {
    name: "Business & Management",
    icon: "💼",
    programs: [
      "BS Business Administration",
      "BS Accounting & Finance",
      "BSc Accounting & Finance",
      "BS Commerce",
      "BS Economics",
      "BS Hospitality Management",
    ],
  },
  {
    name: "Natural Sciences",
    icon: "🔬",
    programs: [
      "BS Physics",
      "BS Chemistry",
      "BS Mathematics",
      "BS Statistics",
      "BS Biology",
      "BS Biochemistry",
      "BS Biotechnology",
      "BS Microbiology",
      "BS Zoology",
      "BS Botany",
      "BS Environmental Science",
      "BS Earth Sciences",
      "BS Geology",
      "BS Geography",
    ],
  },
  {
    name: "Social Sciences",
    icon: "🌍",
    programs: [
      "BS Psychology",
      "BS Sociology",
      "BS Political Science",
      "BS International Relations",
      "BS History",
      "BS Anthropology",
      "BS Gender Studies",
      "BS Defense & Strategic Studies",
      "BS Pakistan Studies",
      "BS Development Studies",
    ],
  },
  {
    name: "Arts, Humanities & Communication",
    icon: "📚",
    programs: [
      "BS English",
      "BS Urdu",
      "BS Mass Communication",
      "BS Media Studies",
      "BS Education",
      "BS Islamic Studies",
      "BS Library & Information Science",
    ],
  },
  {
    name: "Law & Other",
    icon: "⚖️",
    programs: [
      "BS Law (LLB)",
      "BS Maritime Studies",
      "BS Engineering Sciences",
    ],
  },
];

export default function CalculatorApp() {
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<MeritResult[]>([]);
  const [showChat, setShowChat] = useState(false);

  // Form state
  const [matricObtained, setMatricObtained] = useState(920);
  const [matricTotal, setMatricTotal] = useState(1100);
  const [interObtained, setInterObtained] = useState(965);
  const [interTotal, setInterTotal] = useState(1100);
  const [isHafiz, setIsHafiz] = useState(false);
  const [stream, setStream] = useState("Pre-Engineering");
  const [studentProvince, setStudentProvince] = useState("Punjab");
  const [studentCity, setStudentCity] = useState("Lahore");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([
    "BS Computer Science",
  ]);
  const [selectedUnis, setSelectedUnis] = useState<string[]>([]);
  const [testScores, setTestScores] = useState<Record<string, number>>({});

  // Filter state
  const [cityFilter, setCityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [provinceFilter, setProvinceFilter] = useState("All");

  const matricPct = matricTotal > 0 ? (matricObtained / matricTotal) * 100 : 0;
  const interPct = interTotal > 0 ? (interObtained / interTotal) * 100 : 0;

  useEffect(() => {
    async function loadData() {
      try {
        await fetch("/api/seed", { method: "POST" });
        const res = await fetch("/api/universities");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUniversities(data);
          const top6 = data.slice(0, 6).map((u: University) => u.id);
          setSelectedUnis(top6);
          const scores: Record<string, number> = {};
          data.forEach((u: University) => {
            scores[u.id] = 70;
          });
          setTestScores(scores);
          return;
        }
        throw new Error("API did not return a valid universities array");
      } catch (err) {
        console.warn("Using in-memory seed data fallback for universities:", err);
        const fallbackData: University[] = UNIVERSITY_SEED_DATA.map((u, i) => ({
          ...u,
          id: `uni-${i + 1}`,
          programs: u.programs.map((p, j) => ({
            ...p,
            id: `prog-${i + 1}-${j + 1}`,
            universityId: `uni-${i + 1}`,
          })),
        }));
        setUniversities(fallbackData);
        const top6 = fallbackData.slice(0, 6).map((u) => u.id);
        setSelectedUnis(top6);
        const scores: Record<string, number> = {};
        fallbackData.forEach((u) => {
          scores[u.id] = 70;
        });
        setTestScores(scores);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const safeUnis = Array.isArray(universities) ? universities : [];

  const allProgramNames = Array.from(
    new Set(safeUnis.flatMap((u) => (Array.isArray(u.programs) ? u.programs.map((p) => p.name) : [])))
  ).sort();

  const cities = Array.from(new Set(safeUnis.map((u) => u.city))).sort();

  const filteredUnis = safeUnis.filter((u) => {
    if (cityFilter !== "All" && u.city !== cityFilter) return false;
    if (typeFilter !== "All" && u.type !== typeFilter) return false;
    if (provinceFilter !== "All" && u.province !== provinceFilter) return false;
    return true;
  });

  const toggleProgram = (name: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

  const toggleUni = (id: string) => {
    setSelectedUnis((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : prev.length < 12
        ? [...prev, id]
        : prev
    );
  };

  const handleResetAll = useCallback(() => {
    setMatricObtained(0);
    setMatricTotal(1100);
    setInterObtained(0);
    setInterTotal(1100);
    setIsHafiz(false);
    setStream("Pre-Engineering");
    setSelectedPrograms(["BS Computer Science"]);
    if (universities.length > 0) {
      const top6 = universities.slice(0, 6).map((u) => u.id);
      setSelectedUnis(top6);
      const scores: Record<string, number> = {};
      universities.forEach((u) => {
        scores[u.id] = 70;
      });
      setTestScores(scores);
    } else {
      setSelectedUnis([]);
      setTestScores({});
    }
    setResults([]);
    setStep(1);
  }, [universities]);

  const handleCalculate = useCallback(async () => {
    setCalculating(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricObtained,
          matricTotal,
          interObtained,
          interTotal,
          isHafiz,
          stream,
          testScores,
          selectedPrograms,
          selectedUniversityIds: selectedUnis,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        setStep(5);
      }
    } catch (err) {
      console.error("Calculation failed:", err);
    } finally {
      setCalculating(false);
    }
  }, [matricObtained, matricTotal, interObtained, interTotal, isHafiz, stream, testScores, selectedPrograms, selectedUnis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-700 font-semibold">Loading universities data...</p>
          <p className="text-sm text-slate-400 mt-1">Preparing your future insights ✨</p>
        </div>
      </div>
    );
  }

  return (
    <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Motivational message */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-green-700 bg-green-50 inline-block px-4 py-2 rounded-full border border-green-200">
          🌟 Believe in yourself — every great journey begins with a single step
        </p>
      </div>

      <StepWizard
        currentStep={step}
        totalSteps={5}
        stepLabels={STEP_LABELS}
        onStepClick={(targetStep) => setStep(targetStep)}
      />

      <div className="bg-white rounded-2xl shadow-xl shadow-green-100/50 border border-green-100 overflow-hidden">
        {/* Step 1: Academic Input */}
        {step === 1 && (
          <div className="p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">📝 Academic Profile</h2>
                <p className="text-slate-500">Enter your Matric and Intermediate marks — your foundation matters!</p>
              </div>
              <button
                onClick={handleResetAll}
                className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition border border-red-100 flex items-center gap-1.5"
                title="Clear all fields and reset calculator"
              >
                🔄 Reset Form
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Matric */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-9 h-9 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-700 text-sm font-bold border border-green-200">M</span>
                  Matriculation / SSC
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Obtained Marks</label>
                  <input
                    type="number"
                    value={matricObtained}
                    onChange={(e) => setMatricObtained(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-400 outline-none transition text-lg"
                    min={0}
                    max={matricTotal}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={matricTotal}
                    onChange={(e) => setMatricTotal(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-400 outline-none transition text-lg"
                    min={1}
                  />
                </div>
                <div className="gradient-green-light rounded-xl p-4 text-center border border-green-200">
                  <span className="text-sm text-green-700 font-medium">Percentage</span>
                  <div className="text-3xl font-extrabold text-green-700">{matricPct.toFixed(1)}%</div>
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-emerald-700 text-sm font-bold border border-emerald-200">I</span>
                  Intermediate / HSSC
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Obtained Marks</label>
                  <input
                    type="number"
                    value={interObtained}
                    onChange={(e) => setInterObtained(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 outline-none transition text-lg"
                    min={0}
                    max={interTotal}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={interTotal}
                    onChange={(e) => setInterTotal(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 outline-none transition text-lg"
                    min={1}
                  />
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-200">
                  <span className="text-sm text-emerald-700 font-medium">Percentage</span>
                  <div className="text-3xl font-extrabold text-emerald-700">{interPct.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Stream & Hafiz */}
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Subject Stream</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-white"
                >
                  {["Pre-Engineering", "Pre-Medical", "ICS", "General Science", "FA / Arts", "Commerce"].map(
                    (s) => (
                      <option key={s} value={s}>{s}</option>
                    )
                  )}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <button
                  onClick={() => setIsHafiz(!isHafiz)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    isHafiz ? "bg-green-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      isHafiz ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-700">
                  🌙 Hafiz-e-Quran Bonus (+20 marks)
                </span>
              </div>
            </div>

            {/* Student Location Section */}
            <div className="mt-8 p-5 bg-gradient-to-br from-green-50/60 to-emerald-50/60 rounded-2xl border border-green-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <span>📍 Student Home Location</span>
                <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                  Matches provincial quotas & nearby campuses
                </span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Home Province</label>
                  <select
                    value={studentProvince}
                    onChange={(e) => setStudentProvince(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-white text-sm font-semibold text-slate-800"
                  >
                    {["Punjab", "Sindh", "KPK", "Balochistan", "Federal", "AJK", "Gilgit-Baltistan"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Home City</label>
                  <select
                    value={studentCity}
                    onChange={(e) => setStudentCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition text-sm text-slate-800 font-semibold bg-white"
                  >
                    {(PROVINCE_CITIES[studentProvince] || PROVINCE_CITIES["Punjab"]).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2.5">
                🌐 <em>Note: You can view and calculate merit for universities across <strong>all provinces of Pakistan</strong>!</em>
              </p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 gradient-green-btn text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
              >
                Next: Select Programs <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Programs */}
        {step === 2 && (
          <div className="p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">🎯 Select Programs</h2>
            <p className="text-slate-500 mb-4">
              Choose your dream programs — {selectedPrograms.length} selected
            </p>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedPrograms([])}
                className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-100"
              >
                ✕ Clear All
              </button>
              <button
                onClick={() => setSelectedPrograms(["BS Computer Science", "BS Software Engineering", "BS Artificial Intelligence", "BS Data Science", "BS Cyber Security"])}
                className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-200"
              >
                💻 IT / CS Programs
              </button>
              <button
                onClick={() => setSelectedPrograms(["BS Electrical Engineering", "BS Mechanical Engineering", "BS Civil Engineering", "BS Chemical Engineering"])}
                className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition border border-amber-200"
              >
                ⚙️ Core Engineering
              </button>
              <button
                onClick={() => setSelectedPrograms(["BS Business Administration", "BS Accounting & Finance", "BS Economics", "BS Commerce"])}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition border border-emerald-200"
              >
                💼 Business
              </button>
              <button
                onClick={() => setSelectedPrograms(["BS Pharmacy", "Doctor of Physical Therapy", "BS Nursing", "BS Medical Lab Technology"])}
                className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition border border-rose-200"
              >
                🏥 Health Sciences
              </button>
              <button
                onClick={() => setSelectedPrograms(["BS Psychology", "BS Sociology", "BS Mass Communication", "BS English"])}
                className="px-3 py-1.5 text-xs font-bold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition border border-purple-200"
              >
                📚 Arts & Social
              </button>
            </div>

            {/* Categorized programs */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {PROGRAM_CATEGORIES.map((category) => {
                const categoryPrograms = allProgramNames.filter((p) =>
                  category.programs.includes(p)
                );
                if (categoryPrograms.length === 0) return null;
                return (
                  <div key={category.name}>
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 border-b border-green-50 pb-2">
                      <span className="text-lg">{category.icon}</span> {category.name}
                      <span className="text-xs text-green-500 font-normal bg-green-50 px-2 py-0.5 rounded-full">
                        {categoryPrograms.length}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryPrograms.map((prog) => {
                        const selected = selectedPrograms.includes(prog);
                        const count = universities.filter((u) =>
                          u.programs.some((p) => p.name === prog)
                        ).length;
                        return (
                          <button
                            key={prog}
                            onClick={() => toggleProgram(prog)}
                            className={`text-left p-3 rounded-xl border-2 transition-all ${
                              selected
                                ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                                : "border-slate-200 hover:border-green-300 hover:bg-green-50/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                                  selected
                                    ? "bg-green-600 border-green-600"
                                    : "border-slate-300"
                                }`}
                              >
                                {selected && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-slate-800 text-sm truncate">{prog}</div>
                                <div className="text-xs text-slate-400">{count} {count === 1 ? "uni" : "unis"}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t border-green-50">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-green-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedPrograms.length === 0}
                className="px-8 py-3.5 gradient-green-btn text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Universities →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Universities */}
        {step === 3 && (
          <div className="p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">🏫 Select Universities</h2>
            <p className="text-slate-500 mb-4">
              Pick your target universities — {selectedUnis.length}/12 selected
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none font-semibold text-slate-700"
              >
                <option value="All">🇵🇰 All Pakistan (Nationwide)</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Federal">Federal / Islamabad</option>
                <option value="AJK">AJK</option>
                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
              </select>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="All">📍 All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="All">🏛️ All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <button
                onClick={() => {
                  setSelectedUnis(filteredUnis.map((u) => u.id));
                }}
                className="px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition border border-green-200"
              >
                ✅ Select All
              </button>
              <button
                onClick={() => setSelectedUnis([])}
                className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100"
              >
                ✕ Clear
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnis.map((uni) => {
                const selected = selectedUnis.includes(uni.id);
                const matchingProgs = uni.programs.filter((p) =>
                  selectedPrograms.includes(p.name)
                );
                return (
                  <button
                    key={uni.id}
                    onClick={() => toggleUni(uni.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selected
                        ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
                        : "border-slate-200 hover:border-green-300 hover:bg-green-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-slate-800 text-lg">{uni.shortName}</div>
                        <div className="text-xs text-slate-500 leading-tight">{uni.name}</div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected
                            ? "bg-green-600 border-green-600"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-medium">
                        📍 {uni.city}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        uni.type === "public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {uni.type}
                      </span>
                      {uni.nationalRank && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 rounded-full text-amber-700 font-medium">
                          🏅 #{uni.nationalRank}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {matchingProgs.length} matching program{matchingProgs.length !== 1 ? "s" : ""}
                      {" · "}{uni.testName}
                    </div>
                    <div className="text-xs text-green-600/70 mt-1 font-medium">
                      M{uni.matricWeight}% + I{uni.interWeight}% + T{uni.testWeight}%
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-green-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={selectedUnis.length === 0}
                className="px-8 py-3.5 gradient-green-btn text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Predict Test Scores →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Test Scores */}
        {step === 4 && (
          <div className="p-6 sm:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">📊 Predict Entry Test Scores</h2>
            <p className="text-slate-500 mb-6">
              Set your predicted scores — aim high, prepare smart! 💪
            </p>

            <div className="space-y-4">
              {universities
                .filter((u) => selectedUnis.includes(u.id))
                .map((uni) => (
                  <div
                    key={uni.id}
                    className="p-5 rounded-xl border border-green-100 bg-gradient-to-br from-green-50/30 to-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-slate-800">{uni.shortName}</span>
                        <span className="text-sm text-green-600 ml-2 font-medium">— {uni.testName}</span>
                      </div>
                      <div className={`text-2xl font-black ${
                        (testScores[uni.id] ?? 70) >= 80 ? "text-green-600" :
                        (testScores[uni.id] ?? 70) >= 60 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {testScores[uni.id] ?? 70}%
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={testScores[uni.id] ?? 70}
                      onChange={(e) =>
                        setTestScores((prev) => ({
                          ...prev,
                          [uni.id]: Number(e.target.value),
                        }))
                      }
                      className="w-full h-3 bg-green-100 rounded-full appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Quick set */}
            <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="text-sm font-bold text-green-800 mb-3">⚡ Quick Set All Tests:</p>
              <div className="flex flex-wrap gap-2">
                {[50, 60, 70, 75, 80, 85, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => {
                      const newScores: Record<string, number> = {};
                      selectedUnis.forEach((id) => {
                        newScores[id] = score;
                      });
                      setTestScores((prev) => ({ ...prev, ...newScores }));
                    }}
                    className="px-4 py-2 text-sm font-bold bg-white text-green-700 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-400 transition shadow-sm"
                  >
                    {score}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-green-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleCalculate}
                disabled={calculating}
                className="px-8 py-3.5 gradient-green-btn text-white font-extrabold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-200 disabled:opacity-50 flex items-center gap-2 text-lg"
              >
                {calculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>🚀 Calculate My Merit</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 5 && (
          <div className="animate-fade-in">
            <ResultsDashboard
              results={results}
              matricPct={matricPct}
              interPct={interPct}
              onBack={() => setStep(4)}
              onShowChat={() => setShowChat(true)}
              onRecalculate={handleResetAll}
            />
          </div>
        )}
      </div>

      {/* AI Chat Overlay */}
      {showChat && (
        <AIChatPanel
          results={results}
          matricPct={matricPct}
          interPct={interPct}
          onClose={() => setShowChat(false)}
        />
      )}
    </section>
  );
}
