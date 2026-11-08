# CarbonReady — Project Audit & Discovery Report

**Project:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  
**Challenge:** PCCOE International Grand Challenge 2026 (Indradhanu)  
**Audit Timestamp:** 2026-11-06  
**Auditor:** Principal Software Architect & Lead Full-Stack Engineer  

---

## 1. Executive Summary

A comprehensive recursive inspection of the imported workspace has been conducted. The workspace contains an authentic, approved Google Stitch design export of **CarbonReady**, an industrial-grade climate intelligence platform tailored for Indian MSME exporters navigating the European Union's Carbon Border Adjustment Mechanism (EU CBAM) and India's Business Responsibility and Sustainability Reporting (BRSR).

The export consists of 9 distinct application viewports and a comprehensive Design System definition (`DESIGN.md`). However, the export currently exists as static HTML prototypes styled via Tailwind CSS runtime CDN and client-side Google Fonts/Material Symbols. There is currently **no existing application framework, no `package.json`, no build pipeline, no calculation engine, and no active AI integration**.

This audit details the existing assets, screen inventories, design token architecture, missing functionalities, and the technical blueprint required to transform this prototype into a production-grade application.

---

## 2. Workspace File System & Directory Analysis

### 2.1 Directory Hierarchy
The workspace contains a nested directory structure resulting from the export archive extraction:

```
c:\Users\Asus\OneDrive\Desktop\CARBONREADY\application\stitch_carbonready_msme_climate_intelligence_copilot\
└── stitch_carbonready_msme_climate_intelligence_copilot\
    ├── antigravity_export_checklist_component_manifest.md
    ├── carbonready_enterprise_system\
    │   └── DESIGN.md
    ├── carbonready_msme_cbam_copilot\
    │   └── code.html (duplicate of main_enterprise_dashboard)
    ├── carbon_intelligence_engine\
    │   ├── code.html
    │   └── screen.png
    ├── cbam_oriented_report_centre\
    │   ├── code.html
    │   └── screen.png
    ├── decarbonization_planner\
    │   ├── code.html
    │   └── screen.png
    ├── government_scheme_matcher\
    │   ├── code.html
    │   └── screen.png
    ├── main_enterprise_dashboard\
    │   ├── code.html
    │   └── screen.png
    ├── manufacturer_onboarding_data_input\
    │   ├── code.html
    │   └── screen.png
    ├── premium_landing_page\
    │   ├── code.html
    │   └── screen.png
    ├── report_history_and_audit_history\
    │   ├── code.html
    │   └── screen.png
    └── voice_first_ai_assistant\
        ├── code.html
        └── screen.png
```

### 2.2 Finding on Duplication
- `carbonready_msme_cbam_copilot/code.html` and `main_enterprise_dashboard/code.html` are binary-identical (45,735 bytes each). They represent the main Enterprise Dashboard.
- There are **9 unique application screens** plus 1 enterprise design token system file.
- All original Stitch export files must be preserved untouched.

---

## 3. Screen Inventory & Route Mapping

Each screen has been analyzed for layout, components, interactive intent, and target Next.js App Router routing:

| Screen # | Stitch Directory Name | Route Path | Screen Title & Core Purpose | Primary Interactive Elements |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `premium_landing_page` | `/` | **Premium Landing Page**<br>Institutional overview, value proposition, mandate alert ticker, live audio intake preview. | Navigation links, Launch Onboarding CTA, Audio waveform teaser, Value metric chips. |
| **02** | `manufacturer_onboarding_data_input` | `/onboarding` | **Manufacturer Onboarding & Data Input**<br>Multi-step onboarding: Company info, plant location, metallurgy route (EAF, Induction, BF-BOF), capacity. | 4-step progress tracker, Route selector cards (EAF/Induction), Production capacity inputs. |
| **03** | `main_enterprise_dashboard` | `/dashboard` | **Main Enterprise Dashboard**<br>Operational command center for Apex Steels & Alloys Ltd (Facility: `IND-PB-7749`, Ludhiana). | 4-KPI Grid (Total emissions, Specific intensity, Readiness score, Cost impact), Voice intake ticker, Consignment ledger. |
| **04** | `voice_first_ai_assistant` | `/assistant` | **Voice-First AI Assistant**<br>Multilingual audio intake (Marathi, Hindi, English), real-time transcription, Nugen entity extraction. | Pulsing microphone catalyst, 32-bar acoustic visualizer, Bilingual transcript box, 4 extracted entity cards, Missing info warning card. |
| **05** | `carbon_intelligence_engine` | `/calc-engine` | **Carbon Intelligence Engine**<br>Deterministic calculation breakdown (Scope 1 direct process, Scope 2 grid, Scope 3 precursors). | Mathematical model display (IPCC Tier 3 / EN 19694-2), Activity stream table, Factor references, Recalibration alert. |
| **06** | `cbam_oriented_report_centre` | `/reports` | **CBAM-Oriented Report Centre**<br>EU CBAM communication dossier builder (Implementing Reg EU 2023/1773 & 2025/2547). | Tabbed ledger (Summary, Scope 1, Scope 2, Scope 3, Methodology, Audit trail), SVG process flow, PDF download trigger. |
| **07** | `decarbonization_planner` | `/planner` | **Decarbonization Planner**<br>Techno-economic decision support & What-If Simulator (MACC, Capex/Opex, Payback). | Interactive sliders (Scrap blending ratio 80-95%, Solar PPA mix, WHRB), Real-time emissions reduction and ROI counters. |
| **08** | `government_scheme_matcher` | `/schemes` | **Government Scheme Matcher**<br>Indian green manufacturing schemes (ZED Certification, RAMP, SIDBI MSE-GIFT). | Category filter tabs, Statutory disclaimer notices, Document checklist matrix, Eligibility criteria matching. |
| **09** | `report_history_and_audit_history` | `/audit-history` | **Report & Audit History**<br>Chronological verifiable audit ledger of generated CBAM declarations, revisions, and sensor calibration logs. | Search input, Quarter filter, Status filter, Consignment ledger with SHA-256 checksums, Verification status badges. |

---

## 4. Design System & Token Audit

From `carbonready_enterprise_system/DESIGN.md`, the approved design tokens are:

### 4.1 Color Hierarchy
- **Canvas Base:** `#060c0a` (Deepest void background for overall frame)
- **Surface / Background:** `#0d1513` (Deep forest-green dark-mode base)
- **Surface Containers:**
  - `surface-container-lowest`: `#08100e`
  - `surface-container-low`: `#151d1b`
  - `surface-container`: `#19211f`
  - `surface-container-high`: `#232c29`
  - `surface-container-highest`: `#2e3634`
- **Text & Foreground:**
  - `on-surface`: `#dce4e1` (High-contrast text)
  - `on-surface-variant`: `#bbcabf` (Muted labels & taxonomy)
  - `text-de-emphasized`: `#475569` (HS codes, unit labels)
- **Brand & Functional Accents:**
  - `primary`: `#4edea3` / `primary-container`: `#10b981` (Verified emerald)
  - `secondary`: `#68dba9` (Mint green accents)
  - `tertiary`: `#98da27` / `#a3e635` (Acid lime / Electric sage for warnings & delta alerts)
  - `warning`: `#f59e0b` (Amber for pending verifications & historical scheme notices)
  - `error`: `#ffb4ab` / `error-container`: `#93000a` (Critical overages, deadline warnings)
- **Borders & Dividers:**
  - Hairline border regular: `rgba(16, 185, 129, 0.12)`
  - Hairline border focus/hover: `rgba(52, 211, 153, 0.35)`

### 4.2 Typography & Iconography
- **Display & Headlines:** `Geist` (`font-headline-lg`, `font-headline-md`, `font-headline-sm`)
- **Body & Controls:** `Inter` (`font-body-lg`, `font-body-md`, `font-body-sm`)
- **Industrial Metrics & Codes:** `JetBrains Mono` (`font-metric-xl`, `font-metric-md`, `font-label-mono`)
- **Icons:** Google Material Symbols Outlined / Lucide React fallbacks

---

## 5. Existing Capabilities vs. Gaps Analysis

| Domain | In Original Stitch Export | Required Production Implementation |
| :--- | :--- | :--- |
| **Framework & Build** | Static HTML with Tailwind CDN scripts | Next.js App Router, React 19, TypeScript, Tailwind CSS configuration with exact token mapping. |
| **Navigation & Shell** | Static HTML `<aside>` and `<header>` copied across 9 files | Unified `AppShell` component with active route detection, language switcher, mobile drawer, and persistent facility metadata. |
| **Voice Processing** | Static SVG waveforms and hardcoded sample text | Browser Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with mic recording, live waveform visualizer, audio playback fallback, and typed text fallback. |
| **AI Extraction** | Hardcoded JSON entity card HTML | Server-side Nugen aligned-model integration (`https://api.nugen.in/api/v3/inference/chat/completions`) with strict prompt engineering for Marathi/Hindi/English transcript parsing into JSON schema, plus a verified demo adapter fallback. |
| **Calculation Engine** | Hardcoded static numbers | Scientific deterministic calculation engine adhering to EU CBAM Implementing Regulation (EU) 2023/1773 and 2025/2547, EN 19694-2 Method C, CEA grid factors, and MoPNG gas tables. |
| **Recommendations** | Static cards with hardcoded numbers | Deterministic marginal abatement cost model calculating Capex, Opex savings, emission reduction, and payback periods for WHRB, Solar PPA, and scrap blend. |
| **Government Schemes** | Static HTML cards | Scheme database with eligibility matching algorithm, historical window warnings (e.g., SIDBI MSE-GIFT end date notice), and ZED subsidy tiers. |
| **Report Generation** | Static HTML report preview | PDF export generator rendering a clean, professional "CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT" with SHA-256 local integrity hashes. |
| **Database & Persistence** | None (in-memory mock) | Supabase schema migrations for facilities, production logs, calculation results, and draft reports, with local browser/memory storage demo fallback. |
| **Testing & Quality** | None | Vitest unit test suite verifying mathematical calculations, unit conversions, and missing data detection. |

---

## 6. Regulatory Verification & Honesty Baseline

As documented in `antigravity_export_checklist_component_manifest.md` and required by competition rules:
1. **No Fabricated Regulatory Data:** All emission factors must cite authoritative sources (IPCC 2006/2019, EU CBAM defaults, India CEA CO2 Baseline Database v20, MoPNG).
2. **Statutory Integrity for Schemes:** 
   - SIDBI MSE-GIFT scheme reflects historical 2% interest subvention with an amber notice that the published window ended 31 March 2026.
   - ZED Certification reflects genuine tiered subsidies (Micro 80%, Small 60%, Medium 50%, Women-owned up to 100%) restricted to certification costs.
3. **No Fake Blockchain / Distributed Ledger Claims:** All CBAM audit trails rely on deterministic SHA-256 local checksums and draft XML v2.4 formats.
4. **No LLM Calculation Hallucinations:** Final emission values are computed deterministically in TypeScript; AI is restricted to entity extraction and natural language reasoning.
5. **Clear Draft Status:** All generated CBAM documents are labeled "DRAFT SUPPLIER EMISSIONS REPORT" with explicit notices that official verifier sign-off is required.

