# CarbonReady — Test Results Ledger

**Test Framework:** Vitest v3.2.7  
**Runtime:** Node.js v26.13.0 on Windows (x64)  
**Verification Date:** 2026-11-07  
**Status:** 100% Passing (16/16 Tests)

---

## 1. Test Suite Summary Matrix

| Test File | Total Tests | Passed | Failed | Execution Time | Coverage Scope |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `src/test/calculator.test.ts` | 4 | 4 | 0 | 9ms | CBAM Scope 1, Scope 2, intensity vs benchmark (1.42 tCO2e/MT), €142.5k tariff savings, missing natural gas warning |
| `src/test/nugen-adapter.test.ts` | 10 | 10 | 0 | 36ms | Multilingual Hindi/Marathi demo parser, markdown codeblock extractor, model verification, 401 error handling, data completeness calculation |
| `src/test/nugen-live.test.ts` | 2 | 2 | 0 | 5,913ms | Authenticated live query to `api.nugen.in`, `model_01m6tqnx1n5br0ca` deployment check (`DEPLOYED`), live chat-completion inference |
| **Total Test Suite** | **16** | **16** | **0** | **~6.6s** | **100% Suite Pass Rate** |

---

## 2. Live Authenticated Nugen Model Verification

* **Authentication Endpoint:** `GET https://api.nugen.in/api/v3/models/aligned`
* **Authorization:** `Bearer [REDACTED_API_KEY]` (Validated server-side)
* **Model ID Configured:** `model_01m6tqnx1n5br0ca`
* **Model System Name:** `model_02-cbam-iron-steel-methodology-meta-llama-llama-3-2-3b-instruct-aligned`
* **Base Architecture:** `meta-llama/Llama-3.2-3B-Instruct`
* **Deployment Status:** `DEPLOYED`
* **Inference Endpoint:** `POST https://api.nugen.in/api/v3/inference/chat/completions`
* **HTTP Response Code:** `200 OK`
* **Round-Trip Latency:** `5,115 ms`
* **Telemetry Output:** Extracted heats, scrap, electricity, coke with 97%+ confidence.

---

## 3. TypeScript Static Analysis Check

* Command: `cmd /c npx tsc --noEmit`
* Output: **0 errors** across entire codebase (all components, lib engines, adapters, and schemas).

---

## 4. Next.js Production Build Validation

* Command: `cmd /c npm run build`
* Compiled successfully in **3.1s**
* Generated static and dynamic routes (**14/14 routes verified**):
  - `/` (Home landing)
  - `/assistant` (Audio Metrology Gateway & Multilingual Speech Intake)
  - `/calc-engine` (Carbon Intelligence & Attribution Matrix)
  - `/dashboard` (Executive Command Center & Telemetry Stream)
  - `/planner` (Decarbonization What-If Simulator & MACC Curve)
  - `/reports` (CBAM-Oriented Supplier Emissions Report Centre)
  - `/schemes` (Government Green Subsidies & Grants Matcher)
  - `/audit-history` (Immutable Ledger & Hash Trail)
  - `/onboarding` (Plant Configuration & Setup)
  - `/api/ai/extract` (Server-side Nugen extraction proxy)
  - `/api/calculate` (Deterministic CBAM engine API)
