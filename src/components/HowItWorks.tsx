"use client";

const STEPS = [
  {
    icon: "📝",
    title: "Enter Your Marks",
    desc: "Input your Matric & Inter marks. We auto-calculate percentages. Every mark is a step forward!",
    color: "from-green-500 to-green-600",
    num: "01",
  },
  {
    icon: "🎯",
    title: "Select Programs & Unis",
    desc: "Choose from 79+ BS programs and 12+ universities. Filter by city, type, and ranking.",
    color: "from-emerald-500 to-emerald-600",
    num: "02",
  },
  {
    icon: "📊",
    title: "Predict Test Scores",
    desc: "Set your expected entry test scores. Aim high — those who dare to dream achieve the most!",
    color: "from-teal-500 to-teal-600",
    num: "03",
  },
  {
    icon: "🏆",
    title: "Get Smart Insights",
    desc: "Receive AI-powered merit calculations, likelihood ratings, and personalized recommendations.",
    color: "from-green-600 to-emerald-700",
    num: "04",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4 border border-green-200">
            <span className="text-sm font-bold text-green-700">📖 Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Your Path to{" "}
            <span className="text-green-600">Clarity</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Get from confusion to confidence in 4 simple steps
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative group">
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-200 group-hover:scale-110 transition-transform`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-green-100">{step.num}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-green-300 text-2xl font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formula Explanation */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200 shadow-sm">
          <h3 className="text-xl font-extrabold text-green-900 mb-4 flex items-center gap-2">
            📐 How Merit Aggregates Work
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Pakistani universities calculate merit using weighted formulas. Understanding these formulas is your first step to a winning strategy! 💪
              </p>
              <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                <p className="text-xs text-green-700 font-bold mb-2 uppercase tracking-wide">Standard Formula</p>
                <div className="font-mono text-sm text-slate-800 leading-relaxed">
                  <strong className="text-green-700">Aggregate =</strong><br />
                  (Matric% × W₁) + (Inter% × W₂) + (Test% × W₃)
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                W₁, W₂, W₃ are university-specific weights that sum to 100%.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-green-800 mb-3">🏫 Common Weight Patterns:</h4>
              <div className="space-y-2 text-sm">
                {[
                  { uni: "NUST", m: 10, i: 40, t: 50, test: "NET", emoji: "🟢" },
                  { uni: "FAST", m: 10, i: 40, t: 50, test: "FAST Test", emoji: "🔵" },
                  { uni: "UET", m: 25, i: 45, t: 30, test: "ECAT", emoji: "🟠" },
                  { uni: "PU", m: 25, i: 50, t: 25, test: "PU Test", emoji: "🟡" },
                  { uni: "LUMS", m: 0, i: 40, t: 60, test: "LCAT/SAT", emoji: "🟣" },
                ].map((f) => (
                  <div
                    key={f.uni}
                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition"
                  >
                    <span className="font-bold text-slate-700">{f.emoji} {f.uni}</span>
                    <span className="text-green-700 text-xs font-mono font-bold">
                      M:{f.m}% · I:{f.i}% · T:{f.t}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <div className="mt-8 text-center">
          <blockquote className="text-lg sm:text-xl italic text-green-700 font-medium max-w-xl mx-auto">
            &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
          </blockquote>
          <p className="text-sm text-slate-400 mt-2">— Nelson Mandela</p>
        </div>
      </div>
    </section>
  );
}
