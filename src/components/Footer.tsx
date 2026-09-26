"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-lg shadow-md">
                🎓
              </div>
              <div>
                <span className="font-extrabold text-lg">UniMatch</span>
                <span className="text-green-400 font-extrabold text-lg ml-0.5">PK</span>
              </div>
            </div>
            <p className="text-sm text-green-200/70 leading-relaxed mb-4">
              AI-powered university merit predictor for Pakistani students.
              Your dreams are valid — let us help you get there.
            </p>
            <p className="text-xs text-green-300/50 italic">
              &ldquo;Success is not final, failure is not fatal: it is the courage to continue that counts.&rdquo;
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-green-300">🏫 Universities</h4>
            <ul className="space-y-2 text-sm text-green-200/70">
              <li>NUST Islamabad</li>
              <li>FAST-NUCES</li>
              <li>LUMS Lahore</li>
              <li>UET Lahore</li>
              <li>COMSATS Islamabad</li>
              <li className="text-green-400 font-medium">+ 7 more</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-green-300">📋 Entry Tests</h4>
            <ul className="space-y-2 text-sm text-green-200/70">
              <li>NET (NUST)</li>
              <li>ECAT (UET)</li>
              <li>NAT / NTS</li>
              <li>FAST NU Test</li>
              <li>LUMS LCAT</li>
              <li className="text-green-400 font-medium">+ more</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-green-300">✨ Features</h4>
            <ul className="space-y-2 text-sm text-green-200/70">
              <li>✅ Merit Calculation</li>
              <li>✅ AI Smart Advisor</li>
              <li>✅ What-If Analysis</li>
              <li>✅ 79+ BS Programs</li>
              <li>✅ University Comparison</li>
              <li className="text-green-400 font-bold">💚 100% Free Forever</li>
            </ul>
          </div>
        </div>

        {/* Motivational banner */}
        <div className="bg-green-800/30 rounded-xl p-5 mb-8 border border-green-700/30 text-center">
          <p className="text-green-200 font-bold text-sm sm:text-base">
            🌟 &ldquo;Your future is created by what you do today, not tomorrow.&rdquo; — Keep striving for excellence!
          </p>
        </div>

        {/* Open Source Notice */}
        <div className="bg-emerald-950/50 rounded-xl p-5 mb-8 border border-emerald-800/50 text-center flex flex-col items-center justify-center">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>💖</span> Open Source Project
          </h4>
          <p className="text-green-200/80 text-sm max-w-2xl mx-auto">
            This is a 100% open-source project created to help Pakistani students. 
            Anyone is free to use, copy, modify, and improve this calculator. 
            Let's build a better future together!
          </p>
        </div>

        <div className="border-t border-green-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-green-300/50">
            © 2026 UniMatch Pakistan. Built with 💚 for Pakistani students. Data: 2025-2026 admissions.
          </p>
          <p className="text-xs text-green-300/50">
            ⚠️ Estimates only — verify with official university portals.
          </p>
        </div>
      </div>
    </footer>
  );
}
