"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

interface RegulatoryUpdate {
  id: string;
  title: string;
  issuingBody: string;
  publicationDate: string;
  jurisdiction: string;
  affectedModule: string;
  summary: string;
  officialUrl: string;
  status: "Confirmed Statutory" | "Draft Proposed" | "Pending Guidance";
}

const REGULATION_RADAR_ITEMS: RegulatoryUpdate[] = [
  {
    id: "RADAR-01",
    title: "Commission Implementing Regulation (EU) 2025/2547",
    issuingBody: "European Commission (DG TAXUD)",
    publicationDate: "2025-01-15",
    jurisdiction: "European Union",
    affectedModule: "Carbon Engine & XML v2.4 Export",
    summary: "Refines definitive CBAM calculation rules for secondary steel metallurgy and sets strict guidelines for third-party accredited verifier attestation.",
    officialUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
    status: "Confirmed Statutory",
  },
  {
    id: "RADAR-02",
    title: "Carbon Credit Trading Scheme (CCTS) Obligated Entity Rules",
    issuingBody: "Bureau of Energy Efficiency (BEE), Ministry of Power",
    publicationDate: "2024-11-20",
    jurisdiction: "India",
    affectedModule: "India CCTS Readiness",
    summary: "Outlines greenhouse gas emission intensity targets for energy-intensive sectors including Iron & Steel. Introduces Carbon Credit Certificates (CCCs).",
    officialUrl: "https://beeindia.gov.in/en/carbon-credit-trading-scheme-ccts",
    status: "Confirmed Statutory",
  },
  {
    id: "RADAR-03",
    title: "ESPR Priority Product Timetable: Iron & Steel Delegated Act",
    issuingBody: "European Commission (DG GROW / CIRPASS)",
    publicationDate: "2024-10-05",
    jurisdiction: "European Union",
    affectedModule: "Digital Product Passport",
    summary: "Prioritizes crude and rolled steel for mandatory Digital Product Passports by 2026/2027, focusing on recycled content verification and chemical traceability.",
    officialUrl: "https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en",
    status: "Draft Proposed",
  },
  {
    id: "RADAR-04",
    title: "SEBI BRSR Core Value Chain Assurance Directive",
    issuingBody: "Securities and Exchange Board of India (SEBI)",
    publicationDate: "2024-07-12",
    jurisdiction: "India",
    affectedModule: "Multi-Regulation Engine",
    summary: "Requires top 250 listed Indian enterprises to obtain reasonable assurance on ESG metrics of key supply chain partners, driving MSME emissions disclosure.",
    officialUrl: "https://www.sebi.gov.in/",
    status: "Confirmed Statutory",
  },
];

interface FrameworkMetric {
  name: string;
  jurisdiction: string;
  readinessScorePct: number;
  dataCoverage: string;
  primaryStandard: string;
  statutoryDeadline: string;
  keyRequirement: string;
}

const REGULATORY_FRAMEWORKS: FrameworkMetric[] = [
  {
    name: "EU Carbon Border Adjustment Mechanism (CBAM)",
    jurisdiction: "European Union",
    readinessScorePct: 94,
    dataCoverage: "Primary Meltshop Telemetry (Scope 1 & 2)",
    primaryStandard: "EN 19694-2 Method C / Reg. 2023/1773 & 2025/2547",
    statutoryDeadline: "Definitive Levies Start Jan 1, 2026",
    keyRequirement: "Quarterly actual emissions dossier with accredited ISO 14065 third-party verifier attestation.",
  },
  {
    name: "India Carbon Credit Trading Scheme (CCTS)",
    jurisdiction: "India (BEE / MoP)",
    readinessScorePct: 82,
    dataCoverage: "Gate-to-Gate Specific Energy & Carbon Consumption",
    primaryStandard: "BEE Iron & Steel GHG Measurement Methodology",
    statutoryDeadline: "Compliance Cycles Commencing 2026",
    keyRequirement: "Specific emission intensity benchmarking; surplus reductions generate tradeable Carbon Credit Certificates (CCCs).",
  },
  {
    name: "EU Digital Product Passport (ESPR)",
    jurisdiction: "European Union",
    readinessScorePct: 88,
    dataCoverage: "Product URN, Recycled Content % & Carbon Seal",
    primaryStandard: "ESPR Reg. (EU) 2024/1781 & CIRPASS Architecture",
    statutoryDeadline: "Steel Priority Delegated Act Expected 2026/2027",
    keyRequirement: "Machine-readable QR passport with circular scrap percentage and chemical composition.",
  },
  {
    name: "SEBI BRSR Core Value-Chain Reporting",
    jurisdiction: "India",
    readinessScorePct: 90,
    dataCoverage: "Scope 1 & 2 GHG, Energy & Water Intensity",
    primaryStandard: "SEBI BRSR Core Principles 6 & 7",
    statutoryDeadline: "Active for Tier-1 Exporters & Suppliers",
    keyRequirement: "Reasonable assurance on Scope 1 and Scope 2 emissions for supply chain integration.",
  },
];

export default function MultiRegulationCompliancePage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "radar" | "ccts">("matrix");

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                MULTI-REGULATION COMPLIANCE
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                CBAM · ESPR · CCTS · BRSR CORE
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                STATUTORY HONESTY VERIFIED
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Compliance Architecture, Regulation Radar &amp; CCTS
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Harmonize plant activity data across European and Indian climate mandates, track official gazette updates, and evaluate readiness for the Indian Carbon Market.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/reports"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold shadow-md hover:bg-secondary transition-all"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Generate CBAM Dossier →</span>
            </Link>
          </div>
        </section>

        {/* Tab Bar */}
        <section className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "matrix"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Cross-Regulatory Matrix (4 Mandates)
            </button>
            <button
              onClick={() => setActiveTab("radar")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "radar"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Regulation Radar Feed
            </button>
            <button
              onClick={() => setActiveTab("ccts")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "ccts"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              India Carbon Credit Market (CCTS)
            </button>
          </div>

          <span className="font-label-mono text-[10px] text-on-surface-variant hidden md:inline">
            PREPARATION ASSISTANCE · NOT LEGAL CERTIFICATION
          </span>
        </section>

        {/* TAB 1: CROSS-REGULATORY HARMONIZATION MATRIX */}
        {activeTab === "matrix" && (
          <section className="flex flex-col gap-space-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {REGULATORY_FRAMEWORKS.map((fw, idx) => (
                <div
                  key={idx}
                  className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm flex flex-col justify-between gap-space-md hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono text-[10px] uppercase font-bold text-primary px-1.5 py-0.5 rounded bg-surface-container-highest">
                        {fw.jurisdiction}
                      </span>
                      <span className="font-label-mono text-[10px] text-secondary font-bold">
                        {fw.readinessScorePct}% READINESS
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-base font-semibold text-on-surface mt-1">
                      {fw.name}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${fw.readinessScorePct}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-1 p-2 rounded bg-surface-container text-xs font-label-mono">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block uppercase">Primary Standard</span>
                        <span className="text-on-surface font-semibold truncate block">{fw.primaryStandard}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block uppercase">Enforcement Date</span>
                        <span className="text-tertiary-fixed font-semibold">{fw.statutoryDeadline}</span>
                      </div>
                    </div>

                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      <strong className="text-on-surface">Core Mandate:</strong> {fw.keyRequirement}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs font-label-mono">
                    <span className="text-on-surface-variant">Coverage: {fw.dataCoverage}</span>
                    <span className="text-primary font-semibold">Active Pipeline</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: REGULATION RADAR LIVE FEED */}
        {activeTab === "radar" && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
              <span className="font-headline-sm text-base font-semibold text-on-surface">
                Official Regulatory Intelligence Radar
              </span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                Verified Government Gazettes &amp; EC Directives
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {REGULATION_RADAR_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-space-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col gap-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                        {item.jurisdiction}
                      </span>
                      <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {item.status}
                      </span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        Published: {item.publicationDate} · {item.issuingBody}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-sm font-semibold text-on-surface mt-0.5">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      {item.summary}
                    </p>
                    <span className="font-label-mono text-[10px] text-secondary">
                      Affected CarbonReady Module: {item.affectedModule}
                    </span>
                  </div>

                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-xs border border-primary/20 transition-colors flex items-center gap-1.5 self-start md:self-center shrink-0"
                  >
                    <span>Official Gazette</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: INDIA CARBON CREDIT MARKET (CCTS) READINESS */}
        {activeTab === "ccts" && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/10">
              <div>
                <h2 className="font-headline-sm text-base lg:text-lg font-semibold text-on-surface">
                  Indian Carbon Market: Carbon Credit Trading Scheme (CCTS) Readiness
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Governed by the Bureau of Energy Efficiency (BEE) and Ministry of Power under the Energy Conservation (Amendment) Act 2022.
                </p>
              </div>
              <span className="font-label-mono text-[10px] px-2.5 py-1 rounded bg-secondary-container/30 text-secondary font-bold">
                BEE GAZETTED ARCHITECTURE
              </span>
            </div>

            {/* Statutory Honesty Banner */}
            <div className="p-3 rounded-lg bg-surface-container border border-tertiary/20 flex flex-col gap-1 text-xs">
              <strong className="text-tertiary font-label-mono text-[10px] uppercase">
                Statutory Principle: Real Readiness vs Live Market Operations
              </strong>
              <p className="text-on-surface-variant leading-relaxed">
                The Indian Carbon Market is currently establishing obligated entity sector baselines. CarbonReady provides <em>readiness assessment and accounting alignment</em>. No live trade execution, credit issuance, or prices are fabricated.
              </p>
            </div>

            {/* Compliance vs Offset Mechanisms Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Compliance Mechanism */}
              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/10 flex flex-col justify-between gap-space-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold">
                      1. Compliance Mechanism
                    </span>
                    <span className="font-label-mono text-[10px] text-secondary">Obligated Entities</span>
                  </div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">
                    GHG Emission Intensity Targets
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Designed for heavy industrial units surpassing designated energy consumption thresholds. Obligated plants receive annual specific emission reduction targets (tCO2e/MT crude steel).
                  </p>

                  <div className="p-2.5 rounded bg-surface-container-lowest text-xs font-label-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">EAF Sub-Sector Target:</span>
                      <span className="text-on-surface font-semibold">~1.35 tCO2e/MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Apex Steels (Current):</span>
                      <span className="text-primary font-bold">1.42 tCO2e/MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Surplus Certificate Threshold:</span>
                      <span className="text-secondary font-semibold">0.07 tCO2e/MT to beat</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/planner"
                  className="w-full py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-xs text-center border border-primary/20 transition-colors"
                >
                  Model Levers to Beat CCTS Target →
                </Link>
              </div>

              {/* Offset Mechanism */}
              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/10 flex flex-col justify-between gap-space-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-[10px] text-tertiary-fixed uppercase font-bold">
                      2. Offset Mechanism
                    </span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">Voluntary Projects</span>
                  </div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">
                    Voluntary Decarbonization Crediting
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Non-obligated MSME steel units can register greenhouse gas reduction projects (e.g. Waste Heat Recovery Boilers or 100% captive solar plants) to earn verified Carbon Credit Certificates (CCCs).
                  </p>

                  <div className="p-2.5 rounded bg-surface-container-lowest text-xs font-label-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">WHRB Project Reduction:</span>
                      <span className="text-primary font-bold">~104 tCO2e / Qtr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Potential Annual CCCs:</span>
                      <span className="text-secondary font-semibold">~416 CCCs / year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Issuing Authority:</span>
                      <span className="text-on-surface">BEE &amp; Grid Controller of India</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://beeindia.gov.in/en/carbon-credit-trading-scheme-ccts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono text-xs text-center border border-outline-variant/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Official BEE CCTS Guidelines</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

