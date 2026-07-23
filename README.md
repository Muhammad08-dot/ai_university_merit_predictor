# 🇵🇰 AI University Merit Predictor & Admission Guide

> **A high-performance, AI-orchestrated web application that calculates university admission merit aggregates across all provinces of Pakistan, powered by Google Gemini API and a High-Level Multi-Agent Manager Architecture.**

![AI University Merit Predictor Preview](./public/readme_hero_preview.png)

---

## 🌟 Overview

The **AI University Merit Predictor** is designed to provide Pakistani high school and college students with a frictionless, highly accurate, and intelligent platform to calculate aggregate scores and assess admission likelihood across all major universities in Pakistan.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Drizzle ORM**, **Tailwind CSS v4**, and **Google Gemini 2.5 Flash**, the platform eliminates the need for user accounts/login barriers, offering instant merit calculations, province-specific location matching, Hafiz-e-Quran bonus additions, and a floating **Roman Urdu AI Web Guide**.

---

## ✨ Key Features

### 🇵🇰 1. All-Pakistan Universities Dataset
Includes top public and private universities across all provinces and regions of Pakistan:
- **Federal / ICT**: NUST Islamabad, COMSATS, PIEAS, Air University, Bahria University.
- **Punjab**: LUMS, UET Lahore, Punjab University (PU), FAST Lahore.
- **Sindh**: NED Karachi, IBA Karachi, Aga Khan University (AKU), Mehran UET.
- **Khyber Pakhtunkhwa (KPK)**: GIKI Swabi, UET Peshawar, IMSciences.
- **Balochistan**: BUITEMS Quetta, University of Balochistan.
- **Azad Jammu & Kashmir (AJK)**: MUST Mirpur.
- **Gilgit-Baltistan**: Karakoram International University (KIU Gilgit).

### 📍 2. Student Home Location Integration
- **Province Selection**: Punjab, Sindh, KPK, Balochistan, Federal/ICT, AJK, and Gilgit-Baltistan.
- **Complete Cities List**: Dynamic province-based dropdown listing all cities for every province in Pakistan.
- **Nationwide Comparison**: Match provincial quota seats while still comparing merit cutoffs nationwide.

### 🤖 3. High-Level Multi-Agent Manager Architecture
Powered by an in-app **Manager-Worker Agent Framework** (`src/lib/manager-agent.ts`):
```
                  +--------------------------------+
                  |    High-Level Manager Agent    |
                  |    (Orchestrator & Synthesizer)|
                  +--------------------------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
|  LocationAgent   |     |    MeritAgent    |     |  StrategyAgent   |
| (Province/City   |     | (Formulas,       |     | (Admission Odds, |
|  Matching &      |     |  Aggregates &    |     |  Portfolio       |
|  Local Quotas)   |     |  Hafiz Bonus)    |     |  Recommendations)|
+------------------+     +------------------+     +------------------+
```

### 🗣️ 4. Bilingual Roman Urdu AI Assistant
- Floating AI Assistant with smooth cubic-bezier popup cards.
- Understands and communicates fluently in **Roman Urdu** (e.g. *"NUST ke liye kitne marks chahiye?"*) or **English**.

### 🌙 5. Hafiz-e-Quran Bonus Calculator
- Automatically calculates the standard Pakistani admission criteria bonus of **+20 marks** (≈ **+2% aggregate boost**).

### 🔄 6. Frictionless Student UX
- **No Login Required**: Students enter credentials directly without creating accounts.
- **Reset Form**: One-click **🔄 Reset Form** button clears all previous marks and resets state instantly.

### 🔐 7. Security & Resilience
- **Rate Limiting**: In-memory sliding window rate limiters protect all API endpoints (`/api/calculate`, `/api/agent`, `/api/advisor`).
- **HTTP Security Headers**: Strict CSP, X-Frame-Options, and X-Content-Type-Options configured.
- **100% Zero-Downtime Fallback**: Automatic fallback to static seed data if PostgreSQL is offline, ensuring zero runtime crashes.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript (Strict Type Checking) |
| **Styling** | Tailwind CSS v4 + Vanilla CSS animations |
| **Database** | Drizzle ORM + PostgreSQL (with fallback) |
| **AI API** | Google Gemini 2.5 Flash API + Custom Multi-Agent Manager |
| **Data Viz** | Recharts |
| **Validation** | Zod Schema Validation |

---

## 📁 Project Structure

```
ai-university-merit-predictor/
├── public/
│   └── readme_hero_preview.png    # Preview screenshot
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── advisor/route.ts   # AI Advisor route
│   │   │   ├── agent/route.ts     # Multi-Agent Manager route
│   │   │   ├── calculate/route.ts # Merit Calculation engine route
│   │   │   ├── seed/route.ts      # Protected Database seed route
│   │   │   └── universities/route.ts # Universities API route
│   │   ├── globals.css            # Custom animations & styles
│   │   ├── layout.tsx             # Main layout
│   │   └── page.tsx               # Homepage
│   ├── components/
│   │   ├── AIGuideAssistant.tsx   # Floating Roman Urdu AI Agent
│   │   ├── CalculatorApp.tsx      # Main Step Calculator component
│   │   ├── ResultsDashboard.tsx   # Interactive Merit Results dashboard
│   │   └── StepWizard.tsx         # Interactive Step navigation header
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   └── schema.ts              # Drizzle ORM schema
│   └── lib/
│       ├── advisor.ts             # Local Advisor heuristics engine
│       ├── agent-orchestrator.ts  # Worker Agent tools & intent parser
│       ├── calculator.ts          # Aggregate math & likelihood algorithms
│       ├── cities.ts              # All-Pakistan Cities per province dataset
│       ├── gemini.ts              # Google Gemini API client
│       ├── manager-agent.ts       # High-Level Multi-Agent Manager
│       ├── rate-limit.ts          # Sliding-window rate limiter
│       └── seed-data.ts           # All-Pakistan Universities seed data
├── .env.example                   # Environment variable template
├── .gitignore                      # Git ignore rules (Secured)
├── next.config.ts                 # Next.js security headers & Turbopack config
├── package.json                   # Project dependencies
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/Muhammad08-dot/ai_university_merit_predictor.git
cd ai_university_merit_predictor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env
```

Add your credentials to `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/university_merit_db"
GEMINI_API_KEY="your-google-gemini-api-key"
SEED_SECRET="your-optional-seed-secret"
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 📊 Admission Likelihood Tiers

The predictor categorizes student admission odds into 5 transparent tiers:
- 🟢 **Safe**: Aggregate is **+8% or higher** above typical cutoff.
- 🔵 **Likely**: Aggregate is **+3% to +7.9%** above typical cutoff.
- 🟡 **Borderline**: Aggregate is **-2% to +2.9%** around typical cutoff.
- 🟠 **Reach**: Aggregate is **-8% to -2.1%** below typical cutoff.
- 🔴 **Unlikely**: Aggregate is **more than -8%** below typical cutoff.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
