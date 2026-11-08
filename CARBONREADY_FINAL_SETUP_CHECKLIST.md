# CARBONREADY — FINAL SETUP & PRE-DEMO CHECKLIST
## Operational Readiness & Environmental Configuration Guide
**Competition:** PCCOE International Grand Challenge 2026 — INDRADHANU  
**Theme:** AI for Climate Change  
**Product:** CARBONREADY — AI Carbon Compliance Copilot for MSME Exporters  

---

## 1. System & Runtime Requirements

- **Operating System:** Windows 10/11, macOS 12+, or Ubuntu 22.04 LTS
- **Node.js Version:** `v18.18.0` or higher (Tested on `v26.13.0`)
- **Package Manager:** `npm` (v9+) or `pnpm`
- **Network Access:** Outbound HTTPS access to:
  - `https://api.nugen.ai/v1` (Nugen AI Cloud inference)
  - `https://generativelanguage.googleapis.com` (Google Gemini speech API)
- **Port Requirement:** Local port `3000` must be available.

---

## 2. Environment Variables Configuration (`.env.local`)

Ensure a `.env.local` file exists in the project root with the following configured keys:

```bash
# ------------------------------------------------------------------------------
# 1. NUGEN DOMAIN-ALIGNED AI INFERENCE (MANDATORY)
# ------------------------------------------------------------------------------
NUGEN_API_KEY=<your_active_nugen_api_key>
NUGEN_ALIGNED_MODEL_ID=model_01m6tqnx1n5br0ca

# ------------------------------------------------------------------------------
# 2. GOOGLE GEMINI SPEECH TRANSCRIPTION (VERBATIM STT)
# ------------------------------------------------------------------------------
GEMINI_API_KEY=<your_active_gemini_api_key>

# ------------------------------------------------------------------------------
# 3. APPLICATION RUNTIME SETTINGS
# ------------------------------------------------------------------------------
PORT=3000
NODE_ENV=production
```

> [!IMPORTANT]
> Never commit `.env.local` to version control. The repository `.gitignore` is pre-configured to strictly ignore all `.env` and `.env.local` files.

---

## 3. Commands to Start the Application

### Option A: Production Mode (Recommended for Live Judging)
Best performance, pre-compiled routes, optimized static assets:
```powershell
# 1. Verify build status
npm run build

# 2. Launch production server
npm start
```
*Access URL:* **`http://localhost:3000`**

### Option B: Development Mode (Hot Reloading)
```powershell
npm run dev
```
*Access URL:* **`http://localhost:3000`**

---

## 4. Browser Permissions & Audio Verification

1. **Microphone Permission:**
   - When presenting live voice recording on `/assistant`, click "Allow" on the browser microphone permission pop-up.
2. **Audio File Loaders (Fail-Safe Contingency):**
   - If ambient room noise is too loud or microphone access is blocked by the venue's browser policy, click **"Load Hindi Shift Sample (WAV)"** or **"Load Marathi Shift Sample (WAV)"** on `/assistant`.
   - Audio fixtures are pre-generated and stored locally at:
     - `public/audio/samples/shift-hi-sample.wav`
     - `public/audio/samples/shift-mr-sample.wav`
     - `public/audio/samples/shift-en-sample.wav`

---

## 5. Pre-Presentation 10-Point Checklist (Execute 5 Minutes Before Demo)

| # | Step | Verification Action | Pass Criteria |
| :---: | :--- | :--- | :---: |
| **1** | **Server Running** | Open `http://localhost:3000` in Google Chrome or Microsoft Edge | Landing page renders with dark theme |
| **2** | **Test Suites Clean** | Run `npm test` in background terminal | 49 / 49 tests passing |
| **3** | **TypeScript Clean** | Run `npx tsc --noEmit` | 0 errors |
| **4** | **Nugen API Connectivity** | Inspect test suite or trigger test inference | Responds within 5s with `model_01m6tqnx1n5br0ca` |
| **5** | **Audio Fixtures Ready** | Verify `public/audio/samples/shift-hi-sample.wav` exists | Plays clear 16-bit PCM test audio |
| **6** | **Reset Demo State** | Click **"Reset Demo"** in the top navigation bar | Toast confirms baseline restored |
| **7** | **PDF Print Setup** | Test click on "Download / Print PDF" on `/reports` | Print dialog opens formatted A4 view |
| **8** | **Display Scaling** | Set browser zoom to 100% | No horizontal overflow on laptop screen |
| **9** | **Audio Volume** | Set laptop speaker volume to ~50% for playback | Clean audible output |
| **10**| **Backup Tabs Open** | Open `/assistant`, `/dashboard`, and `/reports` in tabs | Ready for instant switching if network lags |

