"use client";

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden gradient-hero-glow text-white">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-300/8 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-2xl" />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/15 shadow-lg">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-200">🇵🇰 2026 Admissions — Data Updated</span>
          </div>

          {/* Motivational headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            Dream Big.{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-green">
              Know Where You Stand.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-green-100/90 max-w-2xl mx-auto mb-4 leading-relaxed">
            Your marks are more than numbers — they&apos;re your ticket to the future.
            Instantly calculate your merit for{" "}
            <strong className="text-white font-semibold">NUST, FAST, UET, LUMS, COMSATS</strong> and 7+ top universities.
          </p>

          <p className="text-base text-green-200/70 max-w-xl mx-auto mb-10 italic">
            &ldquo;Success is where preparation meets opportunity.&rdquo; — Let&apos;s prepare together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <button
              onClick={onGetStarted}
              className="group px-10 py-5 bg-white text-green-800 font-extrabold rounded-2xl shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-green-900/40 transition-all duration-300 text-lg flex items-center justify-center gap-3"
            >
              <span className="text-2xl group-hover:animate-bounce">🚀</span>
              Calculate My Merit Now
            </button>
            <a
              href="#how-it-works"
              className="px-10 py-5 glass text-white font-semibold rounded-2xl hover:bg-white/15 transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              <span>📖</span> How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
            {[
              { num: "12+", label: "Top Universities", icon: "🏫" },
              { num: "79+", label: "BS Programs", icon: "📋" },
              { num: "100%", label: "Free Forever", icon: "💚" },
              { num: "AI", label: "Smart Advisor", icon: "🤖" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-all group">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.num}</div>
                <div className="text-xs sm:text-sm text-green-200/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational banner strip */}
      <div className="relative bg-green-500/20 backdrop-blur-sm border-t border-b border-green-400/20 py-3 overflow-hidden">
        <div className="flex items-center justify-center gap-8 text-sm font-medium text-green-200/90">
          <span>✨ Every expert was once a beginner</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">📈 Your hard work will pay off</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">🎯 Aim high, prepare smart</span>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 -mb-px">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 sm:h-24">
          <path
            d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z"
            fill="#f0fdf4"
          />
        </svg>
      </div>
    </section>
  );
}
