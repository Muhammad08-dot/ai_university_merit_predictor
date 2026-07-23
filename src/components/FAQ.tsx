"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How accurate are the merit predictions?",
    a: "Our calculations use official university formulas from 2025-2026 admissions data. The merit aggregate calculation is mathematically precise. However, actual cutoffs can vary year-to-year based on competition, seats, and policy changes. Use our predictions as a strong guideline, not a guarantee.",
  },
  {
    q: "What universities are currently supported?",
    a: "We support 12+ major Pakistani universities including NUST, FAST-NUCES, LUMS, University of Punjab, UET Lahore, COMSATS, Bahria University, Air University, GIKI, NED University, Quaid-i-Azam University, and University of Lahore. More universities are being added regularly.",
  },
  {
    q: "How is the 'Likelihood' rating determined?",
    a: "We compare your calculated aggregate against the university's typical cutoff: Safe (8%+ above cutoff), Likely (3-8% above), Borderline (within ±2%), Reach (3-8% below), and Unlikely (8%+ below). These thresholds are based on historical merit list analysis.",
  },
  {
    q: "Does the Hafiz-e-Quran bonus apply to all universities?",
    a: "Most public universities in Pakistan provide 20 additional marks (approximately +2% aggregate) for Hafiz-e-Quran students as per HEC guidelines. Some private universities may not offer this bonus. We apply a standard +2% equivalent to all calculations when enabled.",
  },
  {
    q: "I have A-Level results. Can I use this calculator?",
    a: "Currently, the calculator is optimized for FSc/HSSC students. For A-Level students, you can convert your grades to IBCC equivalence marks and enter those. We plan to add direct A-Level support in a future update.",
  },
  {
    q: "What entry tests are supported?",
    a: "We support all major entry tests: NET (NUST), ECAT (UET/engineering), NAT/NTS (COMSATS, Bahria, Air), FAST-NU Test, LUMS LCAT, GIKI Admission Test, NED Entry Test, PU Entry Test, and QAU Entry Test. Enter your predicted score as a percentage.",
  },
  {
    q: "Can I save and compare multiple scenarios?",
    a: "Yes! Each calculation is automatically saved. You can go back and modify your test scores to see how different scenarios affect your admission chances. This 'What-If' analysis helps you plan your preparation strategy.",
  },
  {
    q: "Is this service free?",
    a: "Yes, UniMatch Pakistan is completely free to use. Our goal is to help Pakistani students make informed decisions about university admissions without any cost barrier. Education guidance should be accessible to everyone! 💚",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4 border border-green-200">
            <span className="text-sm font-bold text-green-700">❓ Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500">
            Everything you need to know, answered with care
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-green-100 overflow-hidden transition-all hover:shadow-md hover:border-green-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-5 flex items-start justify-between gap-4"
              >
                <span className="font-bold text-slate-800">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-slate-600 leading-relaxed border-t border-green-50 pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
