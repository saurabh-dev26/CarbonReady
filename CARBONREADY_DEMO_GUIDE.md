# CARBONREADY — JUDGE & DEMONSTRATOR WALKTHROUGH GUIDE
## Step-by-Step Live Demonstration Protocol
**PCCOE International Grand Challenge 2026 — INDRADHANU**  
**Theme:** AI for Climate Change  
**Product:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  
**Target User:** Indian Secondary Steel & Forging MSME Manufacturers (Ludhiana / Mandi Gobindgarh / Jalna Clusters)

---

## 1. Executive Demonstration Narrative (The 60-Second Pitch)

> *"Starting 2026, the European Union's Carbon Border Adjustment Mechanism (CBAM) imposes severe financial tariffs on steel imports. If an Indian MSME exporter cannot provide verified, installation-specific emissions data, the EU slaps a punitive default benchmark of **2.15 tonnes of CO2 per tonne of steel**—erasing their export margins entirely.*  
>  
> *Small steel mill operators in Ludhiana or Mandi Gobindgarh don't have sustainability teams or €30,000 carbon accounting consultants. But they DO know their furnace shift logs in Hindi, Marathi, and Punjabi.*  
>  
> ***CarbonReady** bridges this gap. It captures messy shopfloor voice logs in vernacular Indian languages, uses a dedicated **Gemini 3.5 Transcribe** engine for verbatim STT, passes the transcript to a specialized **Nugen domain-aligned AI model** (`cbam-iron-steel-v1`) to extract structured telemetry, and then runs a **100% deterministic EN 19694-2 Method C carbon calculation** with traceable CEA v20.0 factors. The result: an export-ready draft CBAM dossier, a Digital Product Passport, and an **instant €142,500 tariff shield per 1,000 MT**."*

---

## 2. 7-Act Demonstration Sequence (Click-by-Click)

### ACT 1: Executive Landing & Manufacturer Identity
1. **Navigate to:** `http://localhost:3000/`
2. **Key Visuals to Show:**
   - Dark enterprise forest-green theme with real-time CBAM countdown clock (Transitional to Definitive phase).
   - Core value proposition: *"Turn vernacular furnace logs into audited EU CBAM dossiers."*
3. **Action:** Click **"Launch Copilot"** or **"Setup Plant Profile"** (navigates to `/onboarding`).
4. **Talking Points:**
   - Highlight the MSME focus: Ludhiana secondary EAF mini-mills, UDYAM registration (`UDYAM-PB-12-004921`), and UN/LOCODE (`IN LUH`).
   - Notice the dynamic Top Compliance Bar showing **Demo Preset / Live Status** and the 1-click **Reset Demo** button.

---

### ACT 2: Vernacular Voice Intake & Dual-AI Architecture
1. **Navigate to:** `/assistant` (Voice Shift Log Intake).
2. **Select Language:** Click **Hindi (हिंदी)** or **Marathi (मराठी)**.
3. **Demonstrate Speech-to-Text (Two Options):**
   - **Option A (Live Mic):** Click the microphone button, grant mic permission, and speak a shift log:
     > *"आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।"*
   - **Option B (Pre-recorded Sample Audio):** Click **"Load Hindi Shift Sample (WAV)"** or **"Load Marathi Shift Sample (WAV)"** for instant, reliable audio playback.
4. **Verbatim Transcript Review:**
   - Point out that **Gemini 3.5 Transcribe** returns faithful Devanagari text without hallucinating translations or inventing numbers.
   - Show that the user can edit or adjust any word before AI extraction.
5. **Trigger Domain Extraction:** Click **"Extract with Nugen Domain AI →"**.
6. **Domain AI Reasoning Inspection:**
   - Watch the live inference card execute against Nugen Aligned Model (`model_01m6tqnx1n5br0ca`).
   - Point out that the model parsed Indian furnace slang, mapped units, and calculated a **Data Completeness Score (92%)**.
   - Show missing data detection: Reheat gas was not spoken, so the field is flagged as `Missing (Optional)`—**never fabricated**.
7. **Action:** Click **"Confirm & Calculate Emissions →"**.

---

### ACT 3: Deterministic Calculation Engine & Scientific Traceability
1. **Navigate to:** `/calc-engine` (or automatically redirected after confirmation).
2. **Key Visuals to Show:**
   - **Zero AI in Numerical Math:** Explain to the judges that AI stops at structured data extraction. The carbon calculation is 100% deterministic and follows **EN 19694-2 Method C**.
   - **Scope 1 Direct Emissions:** Reheat gas + Coke oxidation + Graphite electrode consumption = `312.40 tCO2e`.
   - **Scope 2 Indirect Emissions:** Sub-metered electricity (84,200 kWh) × Central Electricity Authority (CEA) v20.0 factor (**0.716 kgCO2e/kWh**) = `60.29 tCO2e`.
   - **Audited Specific Intensity:** `1.42 tCO2e/MT`.
   - **Cryptographic Audit Seal:** Point out the unique SHA-256 hash sealing this specific calculation run.

---

### ACT 4: Executive Dashboard & CBAM Tariff Shield
1. **Navigate to:** `/dashboard`.
2. **Key Visuals to Show:**
   - Plant Context Ribbon dynamically showing the manufacturer's name, city, and active batch ID (`LIVE BATCH: BATCH-2025-Q1-0842`).
   - **Card 1: Audited Specific Intensity (1.42 tCO2e/MT)** vs EU statutory default cap (**2.15 tCO2e/MT**).
   - **Card 2: Historical Trajectory:** 21.5% emission compression since Q1 2024.
   - **Card 3: Data Quality & Completeness:** 92% completeness score.
   - **Card 4: CBAM Tariff Exposure Shield:** **€142,500 saved per 1,000 MT** of exported steel at €85/tCO2e ETS benchmark price.
   - Interactive SVG intensity compression chart and real-time plant event ledger.

---

### ACT 5: Decarbonization Planner & What-If Simulator
1. **Navigate to:** `/planner`.
2. **Key Visuals to Show:**
   - **Interactive What-If Simulation Sliders:**
     - Move the **Solar PPA Open Access** slider from 0% to 50% → watch the real-time carbon intensity drop from 1.42 to 1.12 tCO2e/MT!
     - Toggle **Scrap Preheating System** → watch immediate natural gas savings.
   - **Techno-Economic Payback:** Transparent CAPEX estimates, OPEX reductions, and tariff penalty avoidance.
3. **Action:** Click **"View Subsidized Government Schemes"** (navigates to `/schemes`).
   - Point out verified Indian schemes: BEE PAT Scheme, Ministry of Steel Decarbonization Task Force Subsidies, IREDA Low-Interest Green Loans.

---

### ACT 6: Draft CBAM Supplier Report & One-Click PDF Export
1. **Navigate to:** `/reports`.
2. **Key Visuals to Show:**
   - Complete Annex III compliant dossier formatted according to **Commission Implementing Regulation (EU) 2025/2547**.
   - Tabbed navigation: Summary, Direct Emissions, Indirect Emissions, Precursor Sourcing, Methodology, Audit Trail.
   - **Statutory Regulatory Disclaimer:** Clearly highlighted box stating this is a *Draft Supplier Emissions Declaration / Communication Dossier* under Article 8 awaiting accredited third-party verification.
3. **Action:** Click **"Download Official Dossier (PDF)"**.
   - A real, formatted PDF report is generated and downloaded instantly (`CarbonReady_CBAM_Dossier_*.pdf`).
   - Open and show the PDF: Clean headers, table layouts, factor citations, and SHA-256 seal.
4. **Action:** Click **"Download CBAM XML Dossier"** to show machine-readable European Commission schema readiness.

---

### ACT 7: Verifiable Audit Ledger & Digital Product Passport
1. **Navigate to:** `/audit-history`.
   - Point out that the newly generated report is at the top of the ledger with an **"Active Filing"** badge and a **"Dossier →"** link!
   - Demonstrate the **"Proof"** modal showing cryptographic checksum verification.
   - Click **"Export Ledger CSV"** for auditor review.
2. **Navigate to:** `/passport` (Digital Product Passport).
   - Show the **CIRPASS-aligned DPP** for crude steel billets (CN Code 7207 11 00).
   - High-contrast scannable QR code encoding material circularity (91.2% recycled scrap) and audited carbon intensity.
   - Embeddable Carbon Trust Badge widget for commercial invoices.
3. **Navigate to:** `/export-paperwork` (Customs Annex Auto-Fill).
   - Show the auto-filled Commercial Invoice Carbon Declaration Annex pre-populated with the manufacturer's active batch data.
   - Click **"Print / Download Customs PDF"** (uses CSS print styles with clean official watermarks).

---

## 3. Demo Contingencies & Fail-Safe Mechanisms

| Scenario | Handled By | Action to Take |
| :--- | :--- | :--- |
| **No Microphone Available / Browser Blocks Audio** | Built-in sample audio buttons | Click "Load Hindi Shift Sample" or "Load Marathi Shift Sample" |
| **Microphone Background Noise** | Verbatim transcript editor | Manually edit or correct any spoken number before clicking Nugen extraction |
| **Nugen Cloud API Latency Spike** | Verified demo adapter fallback | Client automatically falls back to verified offline deterministic data if API times out |
| **State Reset Needed for Next Judge** | 1-click Global Demo Reset | Click **"Reset Demo"** in the top navigation bar to restore baseline state in 0.1s |

---

## 4. Key Questions Judges May Ask & Winning Answers

- **Q: "Why can't MSMEs just use ChatGPT or Gemini directly?"**  
  *A: Generic LLMs hallucinate numbers, don't know the exact CEA v20.0 Indian grid emission factors, and cannot be trusted with regulatory tax liabilities. CarbonReady uses Gemini solely for verbatim speech transcription, a specialized Nugen aligned model for metallurgical entity extraction, and a 100% deterministic, zero-hallucination calculation engine for all numbers.*

- **Q: "Is this report an official, legally binding CBAM submission?"**  
  *A: Under Regulation (EU) 2025/2547 Article 8, definitive declarations require third-party accredited verifier sign-off. CarbonReady generates the complete, standardized **Supplier Communication Dossier** that Indian exporters hand to European buyers and accredited verifiers (like TÜV or DNV, browsable on our `/verification` screen), cutting audit preparation time from weeks to seconds.*

- **Q: "How does CarbonReady handle missing or corrupted shopfloor data?"**  
  *A: Missing fields are NEVER invented. If a mill operator omits coke or natural gas consumption, CarbonReady flags the field as missing, lowers the Data Completeness score, and prompts the operator to verify before calculating.*
