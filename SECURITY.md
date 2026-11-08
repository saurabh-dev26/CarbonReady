# Security Policy & Credential Protection

The CarbonReady engineering team takes application security, environmental integrity, and API credential protection seriously. This document outlines our vulnerability disclosure process and security rules for all contributors.

---

## 1. Golden Security Rules for Contributors

1. **NEVER COMMIT API KEYS OR SECRETS:**
   - Never commit `.env.local`, `.env`, or any file containing real API keys, passwords, bearer tokens, or database connection strings.
   - All production and development secrets must remain in your local `.env.local` file, which is permanently excluded by `.gitignore`.
2. **NEVER POST SECRETS IN SCREENSHOTS OR ISSUES:**
   - When filing GitHub Issues, pull requests, or sharing screenshots, ensure that terminal logs, `.env` views, and browser DevTools do not expose private keys or authorization headers.
3. **KEEP ALL REASONING & INFERENCE ON THE SERVER:**
   - Never expose API keys through `NEXT_PUBLIC_` environment variables or client-side React components. All external API calls to Nugen AI and Google Gemini must pass through server-side Route Handlers (`src/app/api/ai/*`).
4. **CREDENTIAL ROTATION PROTOCOL:**
   - If an API key or token is accidentally pushed to any branch or fork, immediately revoke and rotate the key at the provider console:
     - Nugen Console: [https://console.nugen.in/](https://console.nugen.in/)
     - Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)

---

## 2. Reporting a Vulnerability

If you discover a potential security vulnerability, credential leak, or calculation flaw:

1. **Do NOT open a public GitHub issue.** Public issues disclose vulnerabilities before patches can be applied.
2. Please report the issue privately to the repository owner or hackathon project maintainers.
3. In your private report, please provide:
   - A clear description of the vulnerability or risk.
   - Affected components, routes, or files.
   - Steps to reproduce or proof-of-concept.
   - Potential remediation or patch recommendations.
4. Maintainers will review the submission, reproduce the issue, and push a verified patch.

---

## 3. Related Documentation

- 📋 [**Main Repository README (`README.md`)**](README.md)
- 📐 [**System Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md)
- 📊 [**Feature Implementation & Verification Status (`docs/PROJECT_STATUS.md`)**](docs/PROJECT_STATUS.md)
- 🤝 [**Contributing Guide (`CONTRIBUTING.md`)**](CONTRIBUTING.md)


