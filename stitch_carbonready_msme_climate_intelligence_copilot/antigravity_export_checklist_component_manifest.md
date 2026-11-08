# CarbonReady — Google Antigravity Export Checklist & Component Manifest

**Project:** CarbonReady Enterprise Climate-Tech Platform  
**Target Architecture:** Google Antigravity / Next.js / Tailwind CSS / Headless UI  
**Target Enterprise:** Apex Steels & Alloys Ltd (Facility ID: `IND-PB-7749`, Ludhiana / Mandi Gobindgarh Works)  
**Status:** Export Ready (Verified Regulatory Honesty & Design Token Cohesion)

---

## Part 1: Antigravity Export Checklist

### 1. Design Token & Theme Verification
- [x] **Surface Color Palette**: Baseline dark-mode forest surface `#0d1513` implemented across all shells and containers.
- [x] **Primary Brand & Status Accents**:
  - Primary Emerald: `#10b981` (interactive actions, verified status chips, primary CTAs).
  - Amber Warning: `#f59e0b` (missing verification gates, historical scheme flags, unconfirmed parameters).
  - Slate / Border Tokens: Subdued border strokes (`rgba(255, 255, 255, 0.08)` to `rgba(16, 185, 129, 0.20)`).
- [x] **Typography Scale**: Geist Sans primary font paired with Geist Mono for HS codes, consignment IDs, emission intensities, and mathematical formulas.
- [x] **Accessibility & Ergonomics**: High-contrast ratios maintained for industrial outdoor/shopfloor viewports; minimum touch-target requirements (44x44px) mapped for mobile interactive zones.

### 2. Statutory Accuracy & Regulatory Verification
- [x] **Ministry of MSME / ZED Certification**: 
  - Official tiered certification subsidy accurately modeled: Micro 80%, Small 60%, Medium 50%, Women-owned up to 100%.
  - Verified restriction to assessment/certification costs; distinguished from capital equipment.
- [x] **SIDBI MSE-GIFT Scheme**:
  - Explicit historical 2% (200 bps) interest subvention displayed with amber notice: *"Published sanction window ended 31 March 2026. Verify current availability or any extension with SIDBI or the participating financial institution."*
  - Relabeled header to *"Potential Scheme Matches"*; zero claims of guaranteed automated loan disbursement.
- [x] **RAMP & BEE PAT Frameworks**:
  - RAMP framed honestly as a broader MSME support programme dependent on state/centre SIP gates.
  - BEE PAT framed around tradable ESCerts verified by accredited energy auditors.
- [x] **CBAM Registry & Ledger Claims**:
  - All claims of live blockchain/cryptographic consensus removed; replaced with transparent audit log SHA-256 local checksums and draft CBAM XML v2.4 offline preparation.
  - Verifier badges set to *"Pending Verification / Draft Record"* for all demonstration entries.

### 3. Screen Inventory & Routing Integrity
- [x] **All 9 Screens Validated & Mapped**:
  1. `Premium Landing Page` (`{{DATA:SCREEN:SCREEN_10}}`) → Route `/`
  2. `Manufacturer Onboarding & Data Input` (`{{DATA:SCREEN:SCREEN_12}}`) → Route `/onboarding`
  3. `Main Enterprise Dashboard` (`{{DATA:SCREEN:SCREEN_18}}`) → Route `/dashboard`
  4. `Voice-First AI Assistant` (`{{DATA:SCREEN:SCREEN_14}}`) → Route `/assistant`
  5. `Carbon Intelligence Engine` (`{{DATA:SCREEN:SCREEN_8}}`) → Route `/calc-engine`
  6. `CBAM-Oriented Report Centre` (`{{DATA:SCREEN:SCREEN_16}}`) → Route `/reports`
  7. `Decarbonization Planner` (`{{DATA:SCREEN:SCREEN_6}}`) → Route `/planner`
  8. `Government Scheme Matcher` (`{{DATA:SCREEN:SCREEN_4}}`) → Route `/schemes`
  9. `Report History and Audit History` (`{{DATA:SCREEN:SCREEN_2}}`) → Route `/audit-history`
- [x] **Consistent Navigation Shell**: Persistent left-hand navigation and unified header banner indicating active facility and demo benchmark mode across all application pages.

---

## Part 2: Reusable Component Manifest

### Category A: Shell & Layout Components
| Component ID | Component Name | Description & Usage | Key Props / State |
| :--- | :--- | :--- | :--- |
| `CR-SHELL-01` | `AppShell` | Persistent enterprise frame with left sidebar and top facility bar | `activeRoute`, `facilityId`, `demoMode` |
| `CR-NAV-01` | `SidebarNavigation` | 9-item navigational drawer with active emerald pill indicator | `collapsed`, `unreadAlertsCount` |
| `CR-HDR-01` | `TopComplianceBar` | Top banner showing EU CBAM Q2 deadline countdown and demo tag | `deadlineDate`, `compliancePct`, `isDemo` |
| `CR-PAGE-01` | `PageHeader` | Standard title, breadcrumb path, and primary header actions | `title`, `breadcrumbs`, `actionsSlot` |

### Category B: Data Visualization & Metric Cards
| Component ID | Component Name | Description & Usage | Key Props / State |
| :--- | :--- | :--- | :--- |
| `CR-KPI-01` | `KpiMetricCard` | High-density metric display with trend indicator and benchmark | `label`, `value`, `unit`, `trend`, `benchmarkCap` |
| `CR-CHART-01` | `IntensityTrajectoryChart` | Specific emissions compression curve vs. EU CBAM threshold | `dataPoints`, `euThreshold`, `timeframe` |
| `CR-CHART-02` | `ScopeBreakdownBar` | Multi-segment horizontal bar displaying Scope 1, 2, and 3 | `scope1Val`, `scope2Val`, `scope3Val` |
| `CR-SIM-01` | `WhatIfSliderControl` | Interactive parameter slider for scrap blend and renewable PPA | `min`, `max`, `step`, `currentVal`, `onChange` |

### Category C: Shopfloor Telemetry & Form Inputs
| Component ID | Component Name | Description & Usage | Key Props / State |
| :--- | :--- | :--- | :--- |
| `CR-VOICE-01` | `VoiceRecorderDock` | Prominent mic trigger with audio waveform visualizer | `isRecording`, `languageMode`, `onAudioSubmit` |
| `CR-TRANS-01` | `TranscriptCard` | Dual-view raw transcript box with vernacular translation toggle | `rawText`, `language`, `confidenceScore` |
| `CR-PARAM-01` | `ExtractedParameterField` | Editable key-value field highlighting confidence & verification gate | `fieldName`, `value`, `unit`, `isMissing`, `confidence` |
| `CR-DOC-01` | `ReadinessVaultItem` | Statutory document row with indexed status, upload trigger, and hash | `docName`, `docType`, `isIndexed`, `shaChecksum` |

### Category D: Regulatory & Audit Elements
| Component ID | Component Name | Description & Usage | Key Props / State |
| :--- | :--- | :--- | :--- |
| `CR-STAT-01` | `StatutoryNoticeBox` | Amber/neutral alert box detailing legal provisions and guidelines | `schemeCode`, `noticeText`, `portalUrl` |
| `CR-STATUS-01` | `VerificationStatusBadge` | Semantic status tag (Draft, Pending Verification, Indicative Match) | `statusVariant` (`verified`, `pending`, `historical`) |
| `CR-TABLE-01` | `ConsignmentLedgerTable` | High-density table of historical shipments with expand-to-accordion | `consignments`, `onExportXml`, `onViewProof` |
| `CR-EXP-01` | `AuditLogStream` | Sequential event timeline of calculations and sensor calibrations | `logEvents`, `facilityId` |

---

## Part 3: Antigravity Code Integration Map

```
/src
  ├── /components
  │     ├── /shell
  │     │     ├── AppShell.tsx
  │     │     ├── SidebarNavigation.tsx
  │     │     └── TopComplianceBar.tsx
  │     ├── /metrics
  │     │     ├── KpiMetricCard.tsx
  │     │     ├── IntensityTrajectoryChart.tsx
  │     │     └── ScopeBreakdownBar.tsx
  │     ├── /shopfloor
  │     │     ├── VoiceRecorderDock.tsx
  │     │     ├── TranscriptCard.tsx
  │     │     └── ExtractedParameterField.tsx
  │     └── /regulatory
  │           ├── StatutoryNoticeBox.tsx
  │           ├── VerificationStatusBadge.tsx
  │           └── ConsignmentLedgerTable.tsx
  ├── /tokens
  │     ├── colors.ts       // #0d1513, #10b981, #f59e0b
  │     └── typography.ts   // Geist Sans & Geist Mono
  └── /app
        ├── page.tsx                  // Landing Page
        ├── onboarding/page.tsx       // Onboarding
        ├── dashboard/page.tsx        // Main Dashboard
        ├── assistant/page.tsx        // Voice AI Assistant
        ├── calc-engine/page.tsx      // Carbon Intelligence Engine
        ├── reports/page.tsx          // CBAM Report Centre
        ├── planner/page.tsx          // Decarbonization Planner
        ├── schemes/page.tsx          // Government Scheme Matcher
        └── audit-history/page.tsx    // Report & Audit History
```
