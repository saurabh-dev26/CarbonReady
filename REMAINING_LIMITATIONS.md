# CarbonReady — Known Limitations & Post-Hackathon Roadmap

**Evaluation Standard:** Technical Honesty & Production Credibility  
**Target Event:** PCCOE International Grand Challenge 2026 — INDRADHANU (AI for Climate Change)

---

## 1. Hackathon MVP Limitations (Transparent Disclosure)

In the spirit of engineering honesty and regulatory credibility, the following limitations are present in the current hackathon MVP and should not be misrepresented during demonstrations:

### 1.1 Draft Supplier Report vs Accredited Verifier Attestation
* **Current State:** The generated document is officially titled **"CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT"**.
* **Limitation:** It is an internally generated activity-data declaration. Under European Regulation (EU) 2023/956 Article 8, definitive CBAM reporting requires third-party verification by an accredited independent verification body under EU ETS accreditation rules.
* **Remediation:** Every screen, XML export, and printed PDF carries prominent statutory disclaimers explaining that this is a draft communication dossier designed to accelerate third-party auditing, not an unaccredited bypass of accredited audit bodies.

### 1.2 Web Speech API Browser Compatibility
* **Current State:** Voice recognition relies on the standard W3C Web Speech API (`webkitSpeechRecognition`).
* **Limitation:** Chrome, Edge, and Chromium-based browsers have native support for `hi-IN` (Hindi) and `mr-IN` (Marathi). However, Firefox and some privacy-hardened environments restrict browser speech recognition or microphone permissions.
* **Remediation:** CarbonReady includes a permanent **manual text intake box** and **one-click vernacular chips** so the entire application remains 100% testable and operable even without an active microphone.

### 1.3 Scope 3 Precursor Simplification
* **Current State:** In the secondary Electric Arc Furnace (EAF) route, recycled scrap carries zero embedded emissions under CBAM Annex III §2.1.
* **Limitation:** For complex integrated blast furnace (BF-BOF) plants or multi-tiered purchased ferroalloys (e.g. ferro-silicon, ferro-manganese), suppliers must provide third-party precursor declarations.
* **Remediation:** CarbonReady focuses squarely on the secondary EAF / Induction furnace steel route, which represents over 65% of Indian MSME steel mini-mills and where the scrap cut-off rule strictly applies.

### 1.4 Central Electricity Authority (CEA) Factor Latency
* **Current State:** Scope 2 emissions use the official Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, Version 20.0 (**0.727 kg CO2/kWh** Northern Regional Grid).
* **Limitation:** CEA publishes annual baseline data with an approximate 12-to-18-month historical lag. Real-time sub-hourly grid emissions marginal factors are not yet mandated by EU CBAM.
* **Remediation:** The calculation engine clearly cites CEA v20.0 and allows suppliers to model dedicated captive solar PPA contracts (reducing Scope 2 proportionally).

### 1.5 Local Persistence vs Cloud Database
* **Current State:** The application operates with a robust `localStorage` state bridge for live confirmed batches (`carbonready_active_batch`), allowing seamless cross-page data flow between the Assistant, Calculation Engine, Dashboard, Planner, and Reports without requiring external cloud database credentials.
* **Limitation:** Multi-facility corporate aggregation and enterprise user access control (RBAC) require cloud database connection.
* **Remediation:** A complete Supabase PostgreSQL migration script is included in `supabase/migrations/20260328_initial_plant_telemetry.sql` with Row Level Security (RLS) policies ready for deployment.

---

## 2. Post-Hackathon V2 Roadmap

Following the PCCOE Grand Challenge 2026, the CarbonReady architecture is positioned to scale along three key expansion axes:

```
[Phase 1: Hackathon MVP]  --> [Phase 2: Enterprise Pilot]  --> [Phase 3: Exporter Consortium]
  - Multilingual Voice          - WhatsApp Business API          - Green Finance Subsidies API
  - Nugen Domain AI             - Multi-Meter IoT Ingestion      - Multi-Country Expansion
  - Deterministic Math          - Cloud Supabase RLS DB          - CIRPASS Digital Product Passport
  - 15-Section PDF/XML          - Accredited Verifier Portal     - CBAM Registry Automated Filing
```

### Milestone 1: WhatsApp Business API Intake (Months 1–3)
- Integrate Meta Cloud API webhooks for two-way audio messaging.
- Allow plant managers to send 15-second WhatsApp voice notes directly from the meltshop floor, returning immediate CBAM carbon intensity confirmations.

### Milestone 2: IoT Smart Sub-Meter & CEMS Direct Ingestion (Months 3–6)
- Connect RS-485 Modbus and MQTT gateways from 11kV substation incoming feeders.
- Ingest continuous real-time kilowatt-hour pulses and continuous emission monitoring system (CEMS) stack gas measurements to eliminate manual data entry.

### Milestone 3: Verified Independent Auditor Marketplace (Months 6–9)
- Onboard accredited ISO 14065 / EU ETS verification bodies onto the CarbonReady platform.
- Enable verifiers to inspect cryptographic SHA-256 logs, review raw calibration certificates, and digitally sign CBAM dossiers with eIDAS compliant signatures.

### Milestone 4: Direct EU CBAM Transitional Registry XML Submission (Months 9–12)
- Automate direct API submissions into the European Commission's CBAM Transitional Registry via European importer customs broker integration.

