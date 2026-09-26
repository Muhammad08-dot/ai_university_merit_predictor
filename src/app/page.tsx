"use client";

import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CalculatorApp from "@/components/CalculatorApp";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import AIGuideAssistant from "@/components/AIGuideAssistant";

export default function HomePage() {
  const calculatorRef = useRef<HTMLDivElement>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen relative">
      <Header />
      <HeroSection onGetStarted={scrollToCalculator} />
      <div ref={calculatorRef}>
        <CalculatorApp />
      </div>
      <HowItWorks />
      <FAQ />
      <Feedback />
      <Footer />
      {/* Floating AI Web Guide Agent */}
      <AIGuideAssistant />
    </main>
  );
}
