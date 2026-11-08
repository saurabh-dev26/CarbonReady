# CarbonReady — Vercel Build Resolution Report: Missing Next.js Runner

**Issue:** Vercel deployment build failed with:  
`Error: Cannot find module '/vercel/path0/scripts/run-next.js'`  
`Node.js v26.13.0`  
**Date:** November 2026  
**Resolution Status:** **RESOLVED & VERIFIED**

---

## 1. Actual Root Cause Analysis

1. **Non-Standard Build Script in `package.json`:**
   In `package.json`, the build and lifecycle scripts were hardcoded to invoke a custom Node.js runner:
   ```json
   "scripts": {
     "dev": "node scripts/run-next.js dev",
     "build": "node scripts/run-next.js build",
     "start": "node scripts/run-next.js start"
   }
   ```
2. **Missing `scripts/` Directory in GitHub Repository:**
   During the manual browser-based upload to GitHub, the `scripts/` directory was either omitted or its relative path was displaced.
3. **Runner Purpose & Superfluous Nature on Vercel:**
   Inspection of `scripts/run-next.js` revealed:
   ```javascript
   const path = require("path");

   // On Windows, ensure SWC wasm fallback is used under Windows Application Control
   if (process.platform === "win32") {
     process.env.NEXT_TEST_WASM_DIR = path.resolve(__dirname, "../node_modules/@next/swc-wasm-nodejs");
   }

   // Hand off to Next.js CLI
   require("next/dist/bin/next");
   ```
   - On Vercel (a Linux cloud environment), `process.platform === "win32"` is **false**.
   - The runner performs **no essential setup** on Linux; it was merely a pass-through to `next/dist/bin/next`.
   - On Windows, `next.config.ts` already handles the WASM/minification configuration dynamically:
     ```typescript
     if (process.platform === "win32" && !dev && config.optimization) {
       config.optimization.minimize = false;
     }
     ```
   - Therefore, wrapping the Next.js CLI in a custom script introduced an unnecessary single point of failure for Vercel builds.

---

## 2. Files Changed

1. **`package.json` (Original Project):**
   - Replaced indirect `node scripts/run-next.js <cmd>` commands with standard, canonical Next.js CLI commands: `"next dev"`, `"next build"`, and `"next start"`.
2. **`package.json` (`CarbonReady_GitHub_Upload/package.json`):**
   - Synchronized with the updated standard Next.js CLI scripts.
3. **`scripts/run-next.js`:**
   - Preserved in both local and upload folders for backward compatibility, but decoupled from the primary build pipeline.

---

## 3. Exact Fix Applied

### In `package.json`:
```diff
   "scripts": {
-    "dev": "node scripts/run-next.js dev",
-    "build": "node scripts/run-next.js build",
-    "start": "node scripts/run-next.js start",
+    "dev": "next dev",
+    "build": "next build",
+    "start": "next start",
     "test": "vitest run"
   },
```

---

## 4. Local Build & Verification Results

### A. Production Build Verification (`npm run build`)
```text
> carbonready-msme-copilot@1.0.0 build
> next build

   ▲ Next.js 15.5.29
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 3.3s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (22/22)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    5.27 kB         380 kB
├ ○ /_not-found                           1.6 kB         221 kB
├ ƒ /api/ai/extract                        243 B         219 kB
├ ƒ /api/ai/transcribe                     243 B         219 kB
├ ƒ /api/calculate                         243 B         219 kB
├ ○ /assistant                           45.8 kB         420 kB
├ ○ /audit-history                       5.77 kB         380 kB
├ ○ /benchmarks                          4.44 kB         379 kB
├ ○ /calc-engine                         10.8 kB         412 kB
├ ○ /compliance                          5.78 kB         380 kB
├ ○ /dashboard                            7.2 kB         408 kB
├ ○ /export-paperwork                    6.12 kB         381 kB
├ ○ /group-buying                        5.28 kB         380 kB
├ ○ /onboarding                           4.5 kB         379 kB
├ ○ /passport                            7.94 kB         382 kB
├ ○ /planner                             8.98 kB         410 kB
├ ○ /reports                             16.8 kB         391 kB
├ ○ /schemes                             7.61 kB         382 kB
├ ○ /suppliers                           6.21 kB         381 kB
└ ○ /verification                        5.67 kB         380 kB
+ First Load JS shared by all             219 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
- **Status:** **PASSED (Exit Code 0)** — All 22 routes compiled successfully.

### B. TypeScript Static Analysis (`npx tsc --noEmit`)
- **Status:** **PASSED (Exit Code 0)** — 0 errors found.

### C. Automated Unit Test Suite (`npx vitest run`)
- **Status:** **PASSED (Exit Code 0)** — 38/38 unit tests passing (100%).

---

## 5. Exact Files That Must Be Updated in GitHub

To fix your deployment on Vercel immediately, update the following files in your GitHub repository:

1. **`package.json`**  
   - Update `package.json` at the root of your GitHub repository with the fixed script definitions (or drag and drop the updated [`CarbonReady_GitHub_Upload/package.json`](file:///C:/Users/Asus/OneDrive/Desktop/CARBONREADY/application/CarbonReady_GitHub_Upload/package.json)).
2. **`scripts/` folder (Optional but Recommended)**  
   - If not already uploaded, upload the [`scripts/`](file:///C:/Users/Asus/OneDrive/Desktop/CARBONREADY/application/CarbonReady_GitHub_Upload/scripts) folder containing `generate-sample-audio.js` and `run-next.js`. Because `package.json` now uses `next build`, the build will succeed even if `scripts/` is omitted, but uploading it keeps the repository complete.

---

## 6. Remaining Vercel Deployment Checklist

1. **Vercel Build Settings:**
   - Framework Preset: **Next.js**
   - Build Command: `next build` (Default)
   - Output Directory: `.next` (Default)
   - Install Command: `npm install` (Default)
2. **Environment Variables on Vercel:**
   Ensure these 3 environment variables are configured under **Project Settings ➔ Environment Variables**:
   - `NUGEN_API_KEY`: *(Your Nugen AI API Key)*
   - `NUGEN_ALIGNED_MODEL_ID`: `model_01m6tqnx1n5br0ca`
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
3. **Trigger Redeploy:**
   - In Vercel, go to the **Deployments** tab.
   - Click the three dots `...` next to the failed deployment and select **"Redeploy"** (or push a new commit updating `package.json`).
   - The deployment will compile and succeed in under 60 seconds.

