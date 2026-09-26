"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is preferred or previously set
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 flex flex-col">
      {/* Beta / Development Notice Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 text-xs sm:text-sm py-1.5 px-4 text-center font-medium">
        ⚠️ <strong className="font-bold">Beta Version:</strong> This web app is still in the developing stage. Please counter-check all merits with official university sources.
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-200">
              <span className="text-white text-lg">🎓</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                Uni<span className="text-green-600">Match</span>
              </h1>
              <p className="text-[10px] text-emerald-600 -mt-0.5 font-semibold tracking-wide uppercase">
                Your Future Starts Here
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#calculator" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
              Calculator
            </a>
            <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
              How It Works
            </a>
            <a href="#faq" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
              FAQ
            </a>
            <a
              href="#calculator"
              className="ml-2 px-5 py-2 text-sm font-bold text-white gradient-green-btn rounded-lg shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 transition-all"
            >
              Get Started →
            </a>
            
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shadow-sm"
              title="Toggle Dark Mode"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-50 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="md:hidden ml-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-green-100 pt-3 space-y-1">
            <a href="#calculator" className="block py-2.5 px-3 text-sm font-medium text-slate-600 hover:bg-green-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              🧮 Calculator
            </a>
            <a href="#how-it-works" className="block py-2.5 px-3 text-sm font-medium text-slate-600 hover:bg-green-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              📖 How It Works
            </a>
            <a href="#faq" className="block py-2.5 px-3 text-sm font-medium text-slate-600 hover:bg-green-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              ❓ FAQ
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
