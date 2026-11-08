# Contributing to CarbonReady

Thank you for contributing to **CarbonReady — AI Carbon Compliance Copilot for MSME Exporters**!  
This guide outlines the development workflow, branch naming conventions, testing requirements, and security guidelines for teammates, developers, and evaluators.

---

## 1. Getting Started

### Prerequisites
- **Node.js:** `v18.18.0` or higher (Tested on `v26.13.0`)
- **Package Manager:** `npm` (v9+) or `pnpm`
- **Git:** Installed and configured with your name and email.

### Local Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/carbonready.git
   cd carbonready
   ```
2. **Install project dependencies:**
   ```bash
   npm install
   ```
3. **Configure your local environment:**
   Copy the provided environment template to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your development API credentials to `.env.local`:
   - `NUGEN_API_KEY`: Your Nugen API key from [console.nugen.in](https://console.nugen.in/).
   - `NUGEN_ALIGNED_MODEL_ID`: `model_01m6tqnx1n5br0ca` (or your fine-tuned model ID).
   - `GEMINI_API_KEY`: Your Google AI Studio API key for Gemini 3.5 Transcribe.

> [!CAUTION]
> **CRITICAL SECURITY RULE:** Never commit `.env.local` or any file containing real API keys, passwords, or tokens. `.env.local` is pre-configured in `.gitignore`.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Branch Naming Conventions

Always create a dedicated feature branch from `main`:

```bash
git checkout -b <branch-type>/<short-description>
```

Recommended branch prefixes:
- `feature/` — New functionality or UI enhancements (e.g., `feature/voice-improvements`, `feature/macc-curves`)
- `fix/` — Bug fixes and calculations (e.g., `fix/report-generation`, `fix/coke-conversion`)
- `docs/` — Documentation updates and guides (e.g., `docs/readme-update`, `docs/architecture-guide`)
- `test/` — Unit and integration test additions (e.g., `test/nugen-extraction`, `test/gemini-stt`)

---

## 3. Commit Message Guidelines

Write concise, descriptive commit messages following the Conventional Commits specification:

```text
<type>(<scope>): <short description>
```

Examples:
- `feat(assistant): integrate Gemini 3.5 Transcribe audio adapter`
- `fix(reports): bind plant metadata dynamically to stored profile`
- `test(calculator): add CEA v20.0 national grid factor verification test`
- `docs(readme): update project architecture diagram and test metrics`

---

## 4. Pre-Merge Quality & Verification Checklist

Before opening a Pull Request, you **MUST** run and pass all static and automated quality checks locally:

```bash
# 1. Type verification (0 errors required)
npx tsc --noEmit

# 2. Automated test suites (all 49 tests must pass)
npm test

# 3. Production build compilation (22 routes must compile)
npm run build
```

---

## 5. Submitting a Pull Request (PR)

1. Push your branch to GitHub:
   ```bash
   git push -u origin <branch-name>
   ```
2. Open a Pull Request on GitHub against the `main` branch.
3. In your PR description, include:
   - **Summary of changes:** What problem does this PR solve?
   - **Screens / Modules affected:** List routes modified (e.g., `/assistant`, `/reports`).
   - **Testing verification:** Confirm that `npm test` and `npm run build` passed.
   - **Screenshots:** Attach visual proof for any UI modifications.
4. Request review from at least one teammate before merging.

---

## 6. Related Documentation

- 📋 [**Main Repository README (`README.md`)**](README.md)
- 📐 [**System Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md)
- 📊 [**Feature Implementation & Verification Status (`docs/PROJECT_STATUS.md`)**](docs/PROJECT_STATUS.md)
- 🔒 [**Security Policy (`SECURITY.md`)**](SECURITY.md)


