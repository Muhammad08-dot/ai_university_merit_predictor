import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniMatch Pakistan — AI University Merit Predictor",
  description:
    "Predict your university admission chances in Pakistan. Calculate merit aggregates for NUST, FAST, UET, PU, LUMS, COMSATS and more with AI-powered recommendations.",
  keywords:
    "university admissions pakistan, merit calculator, NUST, FAST, UET, aggregate calculator, entry test predictor",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f0fdf4] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
