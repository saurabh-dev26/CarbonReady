# CarbonReady — Implementation & Architecture Plan

**Target Architecture:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Zod + Vitest  
**AI Target:** Nugen Aligned Model (`api.nugen.in/api/v3/inference/chat/completions`) + Graceful Verified Demo Adapter  
**Regulatory Target:** EU CBAM Implementing Regulation (EU) 2023/1773 & (EU) 2025/2547, ISO 14064-1, EN 19694-2 Method C  
**Primary Target Scenario:** Apex Steels & Alloys Ltd (Facility ID: `IND-PB-7749`, Ludhiana / Mandi Gobindgarh Works) — EAF & Induction Furnace Route  

---

## 1. Architectural Blueprint & Folder Structure

We will preserve all original Stitch exports in `stitch_carbonready_msme_climate_intelligence_copilot/` and scaffold the production Next.js application at the workspace root:

```
c:\Users\Asus\OneDrive\Desktop\CARBONREADY\application\stitch_carbonready_msme_climate_intelligence_copilot\
├── .env.example
├── PROJECT_AUDIT.md
├── IMPLEMENTATION_PLAN.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── vitest.config.ts
├── public/
│   ├── brand/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx                     // Global root layout with dark-mode, fonts, metadata
│   │   ├── page.tsx                       // Screen 1: Premium Landing Page
│   │   ├── onboarding/page.tsx            // Screen 2: Manufacturer Onboarding & Data Input
│   │   ├── dashboard/page.tsx             // Screen 3: Main Enterprise Dashboard
│   │   ├── assistant/page.tsx             // Screen 4: Voice-First AI Assistant
│   │   ├── calc-engine/page.tsx           // Screen 5: Carbon Intelligence Engine
│   │   ├── reports/page.tsx               // Screen 6: CBAM-Oriented Report Centre
│   │   ├── planner/page.tsx               // Screen 7: Decarbonization Planner
│   │   ├── schemes/page.tsx               // Screen 8: Government Scheme Matcher
│   │   ├── audit-history/page.tsx         // Screen 9: Report & Audit History
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── extract/route.ts       // Nugen AI structured extraction endpoint
│   │       │   └── reason/route.ts        // Nugen AI anomaly explanation & reasoning
│   │       ├── calculate/route.ts         // Calculation engine verification endpoint
│   │       └── report/pdf/route.ts        // PDF report generation endpoint
│   ├── components/
│   │   ├── shell/
│   │   │   ├── AppShell.tsx               // Persistent enterprise sidebar, header & frame
│   │   │   ├── SidebarNavigation.tsx      // 9-item nav with active emerald indicator
│   │   │   ├── TopComplianceBar.tsx       // Header bar with language, CBAM countdown, demo badge
│   │   │   └── LanguageSelector.tsx       // English / Hindi / Marathi switcher
│   │   ├── voice/
│   │   │   ├── VoiceRecorderDock.tsx      // Concentric pulse, mic trigger, Web Speech STT
│   │   │   ├── SpectrumVisualizer.tsx     // 32-bar adaptive audio visualizer
│   │   │   ├── TranscriptCard.tsx         // Original language quote + English synthesis
│   │   │   └── ExtractedEntityGrid.tsx    // Editable extracted parameter fields
│   │   ├── calculations/
│   │   │   ├── MathFormulaCard.tsx        // IPCC / EN 19694 formula display
│   │   │   ├── EmissionsBreakdownTable.tsx// Scope 1, 2, 3 activity stream ledger
│   │   │   └── FactorCitationCard.tsx     // Authoritative factor metadata modal
│   │   ├── planner/
│   │   │   ├── WhatIfSimulator.tsx        // Interactive scrap ratio, solar PPA, WHRB sliders
│   │   │   └── MacCurveChart.tsx          // Abatement cost curves & payback timers
│   │   ├── schemes/
│   │   │   ├── SchemeCard.tsx             // ZED, RAMP, SIDBI cards with status chips
│   │   │   └── StatutoryDisclaimer.tsx    // Amber regulatory notice boxes
│   │   └── reports/
│   │       ├── CbamDossierTabs.tsx        // Tabbed ledger viewer
│   │       └── ProcessTopologySvg.tsx     // High-density system boundary SVG
│   ├── lib/
│   │   ├── engine/
│   │   │   ├── cbam-calculator.ts         // Deterministic Scope 1, 2, 3 carbon math
│   │   │   ├── emission-factors.ts        // Curated factor registry (CEA, IPCC, MoPNG, EU defaults)
│   │   │   ├── unit-converter.ts          // Mass, energy, gas volume conversions
│   │   │   └── sha256.ts                  // Local cryptographic audit hashing
│   │   ├── ai/
│   │   │   ├── nugen-client.ts            // Official Nugen aligned-model adapter
│   │   │   ├── extraction-schemas.ts      // Zod schemas for structured extraction
│   │   │   └── prompt-templates.ts        // Domain-tuned multilingual extraction prompts
│   │   ├── data/
│   │   │   ├── initial-plant-data.ts      // Apex Steels & Alloys facility baseline
│   │   │   ├── government-schemes.ts      // Curated ZED, RAMP, SIDBI scheme records
│   │   │   └── sample-voice-inputs.ts     // Hindi, Marathi, English test scripts
│   │   └── tokens/
│   │       ├── colors.ts                  // Hex values from DESIGN.md
│   │       └── typography.ts              // Font weights, sizes, letter-spacings
│   ├── types/
│   │   ├── plant.ts
│   │   ├── emissions.ts
│   │   ├── schemes.ts
│   │   └── nugen.ts
│   └── test/
│       ├── calculator.test.ts             // Vitest suite for carbon math
│       └── nugen-adapter.test.ts          // Vitest suite for extraction schemas
└── supabase/
    └── migrations/
        └── 20261106_initial_carbonready_schema.sql // PostgreSQL schemas & RLS
```

---

## 2. Six Development Milestones

### Milestone 1: App Scaffolding & Stitch Design Preservation (Current Focus)
- Initialize Next.js 15 + TypeScript + Tailwind CSS with the exact Stitch color and typography tokens.
- Configure Tailwind for dark-mode `#0d1513`, emerald `#10b981`, mint `#68dba9`, acid lime `#a3e635`, amber `#f59e0b`.
- Implement `AppShell` with the persistent left-hand sidebar navigation, top compliance bar, language switcher (EN / HI / MR), and facility metadata.
- Implement the 9 screens faithfully matching each Stitch viewport:
  1. `/` (Premium Landing Page)
  2. `/onboarding` (Manufacturer Onboarding & Data Input)
  3. `/dashboard` (Main Enterprise Dashboard)
  4. `/assistant` (Voice-First AI Assistant)
  5. `/calc-engine` (Carbon Intelligence Engine)
  6. `/reports` (CBAM-Oriented Report Centre)
  7. `/planner` (Decarbonization Planner)
  8. `/schemes` (Government Scheme Matcher)
  9. `/audit-history` (Report & Audit History)
- Verify responsive layout across Desktop (1440px), Laptop (1024px), and Mobile (360px).
- Verify the local build and run `npm run build` or `npm run dev`.

### Milestone 2: Complete Core Iron & Steel Manufacturing Journey
- Implement the end-to-end interactive workflow for the iron-and-steel mini-mill scenario:
  1. Manufacturer enters/updates company information in `/onboarding`.
  2. Voice or text process intake in `/assistant` (with preloaded sample audio/text in Marathi, Hindi, English).
  3. AI extracts structured activity parameters:
     - Billets produced: 142.0 MT
     - Scrap charge: 145.0 MT
     - DRI / Sponge iron: 12.0 MT
     - Electricity consumed: 84,200 kWh
     - Met coke consumed: 3.2 MT
  4. Manufacturer reviews and edits values directly.
  5. Missing-data detection triggers: Natural gas reheat furnace volume omitted (e.g. 420 Nm³).
  6. Deterministic carbon calculation computes Scope 1 (Direct process: 312.4 tCO2e), Scope 2 (Grid: 1,116.2 tCO2e), Specific Intensity (1.42 tCO2e/MT), and CBAM Tariff Shield savings.
  7. Results immediately update `/calc-engine` and `/dashboard`.

### Milestone 3: Nugen Domain-Aligned AI Integration
- Create `src/lib/ai/nugen-client.ts`:
  - Target URL: `https://api.nugen.in/api/v3/inference/chat/completions`
  - Authentication: Bearer token (`NUGEN_API_KEY`)
  - Model identifier: `NUGEN_ALIGNED_MODEL_ID`
  - Request schema: `{ model: string, messages: [{ role: 'system'|'user', content: string }], temperature: number }`
- Domain-specific prompt engineering:
  - System prompt trains the model on Indian steel mill terminology (heats, ladles, billets, sponge iron/DRI, scrap ratio, power units, met coke, reheat furnaces).
  - Multilingual extraction for English, Hindi (Devanagari / Hinglish), and Marathi.
  - Strict JSON output structure validated via Zod.
- Graceful Demo Mode:
  - If `NUGEN_API_KEY` or `NUGEN_ALIGNED_MODEL_ID` is missing, use the domain-aligned demo adapter.
  - Clearly display status banner in UI: "AI Engine: Nugen Aligned Model Connected" vs "AI Engine: Demo Simulation Mode (Add NUGEN_API_KEY to activate live inference)".
  - Never fake success; transparently report adapter status.

### Milestone 4: Report Generation & Decarbonization Planner
- **Decarbonization Planner (`/planner`):**
  - Implement interactive What-If Simulator with live reactive sliders:
    - Scrap blending ratio (80% to 95%)
    - Solar PPA mix (0% to 100%)
    - Waste Heat Recovery Boiler (WHRB) toggle
    - Oxy-fuel burner efficiency toggle
  - Deterministic calculations for Capex, annual Opex savings, tCO2e reduction, and payback period.
- **CBAM Report Centre & PDF Export (`/reports`):**
  - Generate a downloadable "CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT".
  - Include facility metadata, production route, specific carbon intensity, Scope 1/2/3 breakdown, emission factors, and local SHA-256 integrity hash.
  - Prominently display legal draft disclaimer (Not an accredited CBAM declaration until verified).

### Milestone 5: Government Scheme Matcher & Database Layer
- **Scheme Database (`src/lib/data/government-schemes.ts`):**
  - MSME Sustainable (ZED) Certification: Official tiered subsidy breakdown (Micro 80%, Small 60%, Medium 50%, Women-owned up to 100% on certification costs).
  - SIDBI MSE-GIFT Scheme: Historical 200 bps interest subvention with prominent amber notice: *"Published sanction window ended 31 March 2026. Verify current availability or any extension with SIDBI."*
  - RAMP & BEE PAT: Energy efficiency & tradable ESCerts.
- **Database & Persistence:**
  - Supabase schema migrations in `supabase/migrations/20261106_initial_carbonready_schema.sql`.
  - Tables for `manufacturers`, `facilities`, `activity_logs`, `calculations`, `reports`, and `schemes`.
  - Client state persistence (React State + LocalStorage fallback when Supabase keys are not set).

### Milestone 6: Testing & Quality Assurance
- Automated tests with Vitest:
  - Unit tests for emission calculations (Scope 1 electrode oxidation, met coke stoichiometric combustion, reheat natural gas; Scope 2 grid electricity via CEA emission factors; Scope 3 precursor intensity).
  - Unit tests for What-If scenario math and payback equations.
  - Unit tests for missing information validation.
- Responsive design validation across desktop, tablet, and mobile.
- Comprehensive documentation and deployment readiness.

