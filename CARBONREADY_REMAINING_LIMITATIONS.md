# CARBONREADY — TECHNICAL BOUNDARIES & REMAINING LIMITATIONS
## Transparent Documentation of Platform Boundaries, Regulatory Prerequisites & Roadmap Scope
**PCCOE International Grand Challenge 2026 — INDRADHANU**  
**Theme:** AI for Climate Change  
**Product:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  

---

## 1. Regulatory & Scientific Boundaries

### 1.1 Third-Party Accredited Verifier Prerequisite
- **Statutory Mandate:** Under Regulation (EU) 2023/956 (CBAM) Article 8 and Commission Implementing Regulation (EU) 2025/2547, starting in the definitive period, declarations submitted by EU importers to the European Commission CBAM Registry must be attested by an accredited verification body accredited under Regulation (EC) No 765/2008.
- **CarbonReady Current Scope:** CarbonReady generates the complete, mathematically audited **Draft Supplier Emissions Report / Communication Dossier**. It automates 100% of the data ingestion, unit conversions, CEA v20.0 grid calculations, and XML/PDF packaging. 
- **Limitation:** The platform outputs must be formally reviewed and signed off by an authorized certification body (e.g., TÜV Rheinland, DNV, Bureau Veritas). CarbonReady facilitates this through the `/verification` marketplace but does NOT issue statutory accredited legal attestations autonomously. All reports carry the required statutory disclaimer: *"DRAFT SUPPLIER EMISSIONS DECLARATION — Awaiting Accredited Verification under Article 8"*.

### 1.2 Upstream Scope 3 Complex Precursors
- **Current Methodology:** In secondary steelmaking, precursor emissions (specifically Direct Reduced Iron / sponge iron and ferro-alloys) constitute significant embedded carbon. CarbonReady currently models DRI using the Indian industry-standard weighted average factor (**1.75 tCO2e/MT**) documented in CEA and Joint Plant Committee literature.
- **Limitation:** If an individual DRI supplier operates a highly efficient gas-based shaft furnace (e.g., ~1.1 tCO2e/MT) or an emissions-intensive rotary kiln, installation-specific precursor actuals require primary data exchange. CarbonReady provides the `/suppliers` supplier-chain portal for requesting primary data, but falls back to conservative published defaults when primary supplier certificates are unavailable.

---

## 2. Platform & Integration Boundaries

### 2.1 WhatsApp Business API Exclusion
- **Deliberate Scope Decision:** As mandated by project requirements, WhatsApp Business Cloud API integration is strictly excluded from this prototype.
- **Technical & Security Rationale:**
  1. WhatsApp Cloud API requires Meta Enterprise verification and webhook listeners that introduce external operational dependencies during hackathon judging.
  2. Shopfloor manufacturing logs contain commercially sensitive metallurgical recipe data (scrap-to-sponge ratios, electricity consumption) that MSME owners prefer to process directly in their secure local browser session rather than transmitting through consumer messaging channels.
- **Alternative Implemented:** The platform provides a browser-native voice assistant supporting microphone recording, audio file upload, and pre-recorded high-fidelity Hindi/Marathi/English shift logs with zero third-party messaging overhead.

### 2.2 Client-Side Privacy-First Storage Model
- **Current Implementation:** Facility profiles, active batches, and generated audit dossiers are persisted client-side using `localStorage` with a reactive event-driven synchronization bus (`carbonready_profile_updated`, `carbonready_batch_updated`).
- **Limitation:** Data is preserved across sessions and tab reloads within the same browser, but does not synchronize across different computers or devices.
- **Production Roadmap:** An enterprise multi-tenant PostgreSQL backend with Row-Level Security (RLS) is designed and scheduled for Phase II commercial deployment.

### 2.3 Acoustic Noise in High-Impact Shopfloor Environments
- **Physical Reality:** Secondary steelmaking meltshops experience ambient noise levels between 85 dB and 105 dB (EAF arc roar, scrap crane drops, oxygen lances).
- **Limitation:** Standard mobile phone microphones operating in close proximity to an active furnace may experience acoustic distortion affecting Gemini 3.5 Transcribe speech-to-text accuracy.
- **Mitigation Implemented:** 
  1. CarbonReady explicitly displays the editable transcript before AI domain extraction, allowing shift engineers to tap and correct any distorted word.
  2. Dedicated manual text input and numerical form fallback remain available at all times.

---

## 3. Aligned AI Model Scope

### 3.1 Nugen Aligned Model vs Deterministic Engine
- **Architectural Boundary:** The deployed Nugen aligned model (`model_01m6tqnx1n5br0ca`) is specialized strictly for:
  - Industrial terminology comprehension across English, Hindi, and Marathi.
  - Entity recognition and structured metric extraction (scrap mass, electricity units, heats, fuels).
  - Data completeness scoring and missing-field flagging.
- **Strict Boundary:** The AI model is NEVER permitted to calculate carbon emissions or financial tariff liabilities. All mathematical modeling is performed by the deterministic calculation engine using immutable, traceable formulas.

---

## 4. Feature Maturity Matrix

| Feature Module | Route | Implementation Level | Notes |
| :--- | :--- | :---: | :--- |
| **Multilingual Voice Intake** | `/assistant` | **Production Ready** | Real Gemini 3.5 Transcribe + Nugen Aligned Model |
| **Deterministic Calc Engine** | `/calc-engine` | **Production Ready** | EN 19694-2 Method C, CEA v20.0, SHA-256 seal |
| **Executive Dashboard** | `/dashboard` | **Production Ready** | Live batch sync, tariff shields, SVG charts |
| **Decarbonization Planner** | `/planner` | **Production Ready** | Real-time What-If sliders, CAPEX/OPEX payback |
| **CBAM Report Generation** | `/reports` | **Production Ready** | Real downloadable PDF & XML dossier |
| **Consignment Audit Ledger** | `/audit-history` | **Production Ready** | Live user filings, SHA-256 proofs, CSV export |
| **Digital Product Passport** | `/passport` | **Production Ready** | CIRPASS JSON-LD aligned, scannable QR, Trust Badge |
| **Export Paperwork Auto-Fill** | `/export-paperwork` | **Production Ready** | Commercial invoice annex, print stylesheets |
| **Government Scheme Matcher** | `/schemes` | **Working Reference** | Curated Indian green steel funding schemes |
| **Accredited Verifier Marketplace** | `/verification` | **Interactive Prototype**| Connects with representative accredited bodies |
| **Upstream Supplier Portal** | `/suppliers` | **Interactive Prototype**| Demonstrates Scope 3 primary data requests |
| **Cluster Group Buying** | `/group-buying` | **Interactive Prototype**| Aggregates scrap & solar open access volume |
| **WhatsApp Chatbot** | N/A | **Excluded** | Deliberately excluded per competition architecture |

