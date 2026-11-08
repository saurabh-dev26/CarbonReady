# CarbonReady — Roadmap & Scope Status

**Project:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  
**Competition:** PCCOE International Grand Challenge 2026 (INDRADHANU) — AI for Climate Change  
**Target Scenario:** Indian Iron & Steel MSME Mini-Mills navigating EU CBAM (Implementing Reg. EU 2023/1773 & 2025/2547)  
**Status Date:** November 2026  
**Milestone:** Hackathon MVP Complete (100% Core Requirements Implemented & Verified)

---

## 1. Hackathon MVP In-Scope Deliverables (100% Operational)

| Core Deliverable | Priority | Status | Architecture & Implementation |
| :--- | :---: | :---: | :--- |
| **1. Nugen Aligned-Model Intelligence** | Critical | **Working & Verified** | Domain-aligned model `model_01m6tqnx1n5br0ca` (`Llama-3.2-3B-Instruct` aligned for EU CBAM Iron & Steel) connected via authenticated server-side API (`api.nugen.in/api/v3/inference/chat/completions`). 100% live inference passing. |
| **2. Multilingual Web Voice Assistant** | Signature | **Working & Verified** | Browser Web Speech API (`mr-IN`, `hi-IN`, `en-IN`) + interactive waveform + editable transcription + manual text fallback + Nugen extraction + manufacturer confirmation gate (`localStorage` active batch bridge). |
| **3. CarbonReady Trust Engine** | Core | **Working & Verified** | Deterministic Scope 1, Scope 2, embedded intensity math following EN 19694-2 Method C, CEA CO2 Baseline v20, MoPNG, and IPCC 2006. Zero LLM math hallucinations. SHA-256 formatted as `0x${hex.toUpperCase()}`. |
| **4. CBAM Draft Report Generator** | Core | **Working & Verified** | Complete 15-section "CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT" with SHA-256 local integrity checksum, downloadable XML v2.4, and clean `@media print` 2-page PDF formatting. |
| **5. Decarbonization Planner** | Decision Support | **Working & Verified** | Techno-economic MACC simulator for scrap blending, Solar PPA, and WHRB with dynamic baseline calibrated to the active batch or demo preset. Real Capex/payback math. |
| **6. Dynamic Manufacturer Dashboard** | Executive Command | **Working & Verified** | Operational KPI grid reflecting live confirmed shift telemetry vs clearly labelled baseline demo mode. Dynamic emissions, intensity shield, and compliance score. |
| **7. Government Scheme Matcher** | Statutory Support | **Working & Verified** | Indian MSME green subsidies (ZED, RAMP, SIDBI MSE-GIFT) with statutory disclaimers and historical window alerts. |

---

## 2. Explicitly Postponed Features (Out of Hackathon Scope)

Per Section 3 of the Master Prompt, the following items are deliberately deferred to post-hackathon versions to protect development focus and execution quality:

1. **WhatsApp Business API Integration:**  
   *Reason:* High configuration overhead (Meta app verification, cloud webhooks, template pre-approvals). Postponed to V2.
2. **Green Score Leaderboard & Supplier Chain Nudge:**  
   *Reason:* Requires cross-enterprise data consortium and verified peer networks. Postponed.
3. **Verified Human Auditor Marketplace:**  
   *Reason:* Requires multi-party accreditation framework and third-party verifier onboarding. Postponed.
4. **Carbon Credit Trading Marketplace:**  
   *Reason:* Outside the core compliance accounting scope for EU CBAM reporting. Postponed.
5. **Digital Product Passport (DPP) QR Infrastructure:**  
   *Reason:* European CIRPASS DPP standards still crystallizing for steel commodities. Postponed.
6. **Multi-Country Expansion (Turkey, Vietnam, Egypt):**  
   *Reason:* Initial focus is 100% on Indian MSME exporters in Punjab, Maharashtra, and Gujarat mini-mill clusters.
