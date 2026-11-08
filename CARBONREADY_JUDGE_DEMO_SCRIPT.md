# CARBONREADY — JUDGE DEMO SCRIPT & PRESENTATION PROTOCOL
## High-Impact 5-Minute Live Demonstration for Hackathon Judges
**Competition:** PCCOE International Grand Challenge 2026 — INDRADHANU  
**Theme:** AI for Climate Change  
**Product:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  
**Target User:** Secondary Steel & Forging MSME Exporters (Ludhiana / Mandi Gobindgarh Clusters)

---

## Pitch Timing Breakdown (5 Minutes Total)

```
00:00 - 00:45 | ACT 1: The Problem — EU CBAM Exporter Crisis (Landing Page)
00:45 - 02:00 | ACT 2: Vernacular Voice Intake & Dual-AI Extraction (/assistant)
02:00 - 02:45 | ACT 3: Deterministic Engine & Tariff Shield (/calc-engine & /dashboard)
02:45 - 03:30 | ACT 4: Decarbonization Planner & Government Schemes (/planner & /schemes)
03:30 - 04:30 | ACT 5: CBAM Report Generation & Digital Product Passport (/reports & /passport)
04:30 - 05:00 | ACT 6: Verifier Marketplace & 1-Click Demo Reset (/verification & Reset)
```

---

## Detailed Step-by-Step Script

### ACT 1: The Problem (00:00 - 00:45)
- **URL:** `http://localhost:3000/`
- **What to say:**
  > *"Judges, starting 2026, the European Union's Carbon Border Adjustment Mechanism (CBAM) imposes severe financial penalties on imported steel. If an Indian MSME exporter cannot provide verified, installation-specific emissions data, the EU slaps a punitive default benchmark of **2.15 tonnes of CO2 per tonne of steel**—erasing their export margins entirely.  
  > Small steel mills in Ludhiana or Mandi Gobindgarh don't have €30,000 carbon accounting consultants. But they DO know their furnace shift logs in Hindi, Marathi, and Punjabi. CarbonReady bridges this gap."*
- **What to click:**
  1. Point out the live CBAM countdown clock and value proposition: *"AI-powered carbon intelligence and compliance assistance for Indian MSME exporters."*
  2. Click **"Launch Copilot & Onboard"** -> Navigates to `/onboarding`.
  3. Briefly show the registered plant profile: `Apex Steels & Alloys Ltd`, UDYAM registration (`UDYAM-PB-12-004921`), and UN/LOCODE (`IN LUH`).

---

### ACT 2: Multilingual Voice Intake & Domain AI Extraction (00:45 - 02:00)
- **URL:** `http://localhost:3000/assistant`
- **What to say:**
  > *"Watch how a shopfloor shift supervisor reports their production. They don't fill out a 40-page carbon accounting spreadsheet. They speak in Hindi or Marathi."*
- **What to click / demonstrate:**
  1. Click **Hindi (हिंदी)** tab.
  2. Click **"Load Hindi Shift Sample (WAV)"** (or click the microphone and speak):
     > *"आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।"*
  3. **Point out the transcription card:**
     > *"Notice that **Gemini 3.5 Transcribe** returned a 100% faithful Devanagari transcript. It does NOT translate, summarize, or calculate numbers. The supervisor can edit any word right here before submission."*
  4. Click **"Extract with Nugen Domain AI →"**.
  5. **Inspect the extraction output:**
     > *"Now our deployed, domain-aligned Nugen model (`model_01m6tqnx1n5br0ca`) analyzes the text. Notice what happened:*
     > - *3 Heats recognized.*
     > - *145 MT Scrap and 12 MT Sponge Iron parsed.*
     > - *84,200 kWh electricity recognized from sub-meter units.*
     > - *3.2 MT coke captured.*
     > - ***Crucial zero-hallucination guardrail:** Reheat gas was not mentioned in the shift log, so CarbonReady marked it as `Missing (Optional)` with a 92% Completeness Score. It NEVER fabricates a number."*
  6. Click **"Confirm & Calculate Emissions →"**.

---

### ACT 3: Deterministic Engine & Executive Dashboard (02:00 - 02:45)
- **URL:** `http://localhost:3000/calc-engine` -> `http://localhost:3000/dashboard`
- **What to say:**
  > *"AI stops at data extraction. To ensure total regulatory credibility, all carbon math is 100% deterministic, calculated in accordance with **EN 19694-2 Method C**."*
- **What to show on `/calc-engine`:**
  1. **Scope 1 Direct Emissions:** Coke oxidation (3.2 MT × 3.10) = `312.40 tCO2e`.
  2. **Scope 2 Indirect Emissions:** Sub-metered electricity (84,200 kWh) × Central Electricity Authority (CEA v20.0) national grid factor (**0.716 kgCO2e/kWh**) = `60.29 tCO2e`.
  3. **Specific Carbon Intensity:** `1.42 tCO2e/MT` of crude steel billets.
  4. Point out the unique **SHA-256 Metrology Seal** locking the calculation.
- **Navigate to `/dashboard`:**
  1. Point out the live context banner: `LIVE BATCH: BATCH-2025-Q1-0842`.
  2. Show the **CBAM Tariff Shield Card:**
     > *"Because Apex Steels audited their primary telemetry at 1.42 tCO2e/MT instead of accepting the EU punitive default of 2.15 tCO2e/MT, they save **€142,500 in CBAM border taxes per 1,000 MT** at the €85/tCO2e ETS benchmark price!"*

---

### ACT 4: Decarbonization Planner & Government Schemes (02:45 - 03:30)
- **URL:** `http://localhost:3000/planner`
- **What to say:**
  > *"Compliance is step one. Step two is decarbonization."*
- **What to click / demonstrate:**
  1. On the **What-If Simulator**, drag the **Solar PPA Open Access** slider from 0% to 50%:
     - Show the specific intensity compress in real-time from **1.42 to 1.12 tCO2e/MT**.
     - Show the projected CAPEX payback period (2.4 years).
  2. Click **"View Subsidized Government Schemes"** -> Navigates to `/schemes`.
  3. Show verified Indian government funding opportunities:
     - **BEE PAT Scheme:** Energy saving certificates (ESCerts).
     - **Ministry of Steel Decarbonization Task Force:** Scrap aggregation incentives.
     - **IREDA Low-Interest Green Credit:** Financing for rooftop solar and EAF waste-heat recovery.

---

### ACT 5: Official CBAM Dossier & Digital Product Passport (03:30 - 04:30)
- **URL:** `http://localhost:3000/reports`
- **What to say:**
  > *"Now we generate the deliverable European buyers and customs authorities require."*
- **What to click / demonstrate:**
  1. Show the 15-Section Dossier formatted under **Commission Implementing Regulation (EU) 2025/2547**.
  2. Point out the statutory notice: *"Draft Supplier Emissions Declaration awaiting Article 8 accredited verification."*
  3. Click **"Download / Print PDF Report"**:
     - Opens formatted, high-contrast, multi-page PDF ready for customs attachment.
  4. Click **"Export CBAM XML v2.4"**:
     - Downloads machine-readable XML schema matching European Commission TAXUD specifications.
  5. Navigate to `/passport` (Digital Product Passport):
     - Show the CIRPASS-aligned DPP for steel commodity CN Code 7207.
     - Point out the scannable QR code and embeddable Carbon Trust Badge (91.2% circular scrap).
  6. Navigate to `/export-paperwork`:
     - Show the pre-filled Commercial Invoice Carbon Declaration Annex ready for port clearance.

---

### ACT 6: Audit History & Global Demo Reset (04:30 - 05:00)
- **URL:** `http://localhost:3000/audit-history`
- **What to click / demonstrate:**
  1. Show that the newly generated report is at the top of the chronological ledger with an **"Active Filing"** badge.
  2. Click **"Proof"** to display cryptographic hash verification.
  3. **Reset for the next judge:**
     - Click **"Reset Demo"** in the top navigation bar.
     - Show toast notification: *"Demo state restored to baseline sample."*
- **Closing Statement:**
  > *"CarbonReady turns EU CBAM from a trade threat into an export competitive advantage for Indian MSMEs. Thank you."*

