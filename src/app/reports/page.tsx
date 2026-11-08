"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AppShell } from "@/components/shell/AppShell";
import { INITIAL_FACILITY_PROFILE, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";
import { calculateCbamEmissions, CalculationInput } from "@/lib/engine/cbam-calculator";
import { CbamCalculationResult } from "@/types/emissions";
import { AUTHORITATIVE_EMISSION_FACTORS } from "@/lib/engine/emission-factors";

export default function CbamReportCentrePage() {
  const [activeTab, setActiveTab] = useState<"all" | "summary" | "direct" | "indirect" | "precursor" | "methodology" | "audit">("all");
  const [calculation, setCalculation] = useState<CbamCalculationResult | null>(null);
  const [activeBatch, setActiveBatch] = useState<any | null>(null);
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const persistReportToHistory = (calc: CbamCalculationResult, prof: any, batch: any) => {
    if (typeof window === "undefined") return;
    try {
      const existing = localStorage.getItem("carbonready_saved_reports");
      let reports = existing ? JSON.parse(existing) : [];
      const newReport = {
        id: `REP-${Date.now().toString().slice(-4)}`,
        ref: `CS-2025-${(batch?.batchId || "BATCH").slice(-4)}-${prof.targetPorts?.[0] || "HAM"}`,
        targetPort: `${prof.targetPorts?.[0] || "Hamburg"} (${prof.unLocode || "IN LUH"})`,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        hsCode: "7207.11.00",
        product: "Crude Steel Billets (EAF)",
        grossTco2e: calc.totalGrossEmissionsTco2e,
        specificIntensity: calc.specificEmissionsIntensityTco2ePerMt,
        factors: "CEA v20 + IPCC 2006",
        hash: calc.auditHashSha256,
        status: "Draft Declaration",
        isUserGenerated: true,
      };
      reports = [newReport, ...reports.filter((r: any) => r.hash !== newReport.hash)].slice(0, 10);
      localStorage.setItem("carbonready_saved_reports", JSON.stringify(reports));
    } catch (e) {
      console.warn("Could not persist report to audit history:", e);
    }
  };

  useEffect(() => {
    async function loadData() {
      const p = getStoredFacilityProfile();
      setProfile(p);

      let input: CalculationInput = {
        crudeBilletsMt: 142.0,
        scrapMt: 145.0,
        spongeIronDriMt: 12.0,
        electricityKwh: 84200,
        cokeMt: 3.20,
        reheatNaturalGasNm3: 420.0,
        reheatHours: 10,
        reportingMultiplier: 7.08,
        isQuarterlyAggregation: true,
      };

      let parsedBatch: any = null;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("carbonready_active_batch");
        if (stored) {
          try {
            parsedBatch = JSON.parse(stored);
            setActiveBatch(parsedBatch);
            input = {
              ...input,
              crudeBilletsMt: parsedBatch.crudeBilletsMt || input.crudeBilletsMt,
              scrapMt: parsedBatch.scrapMt || input.scrapMt,
              spongeIronDriMt: parsedBatch.spongeIronDriMt ?? input.spongeIronDriMt,
              electricityKwh: parsedBatch.electricityKwh || input.electricityKwh,
              cokeMt: parsedBatch.cokeMt || input.cokeMt,
              reheatNaturalGasNm3: parsedBatch.reheatNaturalGasNm3 || input.reheatNaturalGasNm3,
              reportingMultiplier: 7.08,
            };
          } catch {
            // Keep default
          }
        }
      }

      const res = await calculateCbamEmissions(input);
      setCalculation(res);
      persistReportToHistory(res, p, parsedBatch);
    }

    loadData();
    window.addEventListener("carbonready_profile_updated", loadData);
    window.addEventListener("carbonready_batch_updated", loadData);
    return () => {
      window.removeEventListener("carbonready_profile_updated", loadData);
      window.removeEventListener("carbonready_batch_updated", loadData);
    };
  }, []);

  const handleDownloadPdf = () => {
    if (calculation) {
      persistReportToHistory(calculation, profile, activeBatch);
    }
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setPdfDownloaded(true);
      window.print();
    }, 400);
  };

  const handleDownloadXml = () => {
    if (!calculation) return;
    persistReportToHistory(calculation, profile, activeBatch);
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<CBAM_Communication_Dossier version="2.4" xmlns="urn:eu:taxud:cbam:v2">
  <Header>
    <ReportingPeriod>2025-Q1</ReportingPeriod>
    <Generator>CarbonReady Copilot OS v2.4 (Indradhanu-PCCOE 2026)</Generator>
    <Timestamp>${calculation.generatedAt}</Timestamp>
    <AuditHashSha256>${calculation.auditHashSha256}</AuditHashSha256>
    <Status>DRAFT_SUPPLIER_DECLARATION</Status>
    <LegalNotice>INTERNAL DRAFT ONLY - NOT AN ACCREDITED VERIFIER ATTESTATION</LegalNotice>
  </Header>
  <Installation>
    <Name>${profile.companyName}</Name>
    <ID>${profile.installationId}</ID>
    <FacilityID>${profile.facilityId}</FacilityID>
    <Country>IN</Country>
    <UN_LOCODE>${profile.unLocode}</UN_LOCODE>
    <City>${profile.city}</City>
    <State>${profile.state}</State>
    <UdyamNumber>${profile.udyamNumber}</UdyamNumber>
    <GSTIN>${profile.gstin}</GSTIN>
    <ProductionRoute>Electric Arc Furnace (Secondary Scrap Route)</ProductionRoute>
    <GoodsCategory>Crude Steel</GoodsCategory>
    <CN_Code>7207</CN_Code>
  </Installation>
  <ActivityData>
    <CrudeBilletsProduced_MT>${calculation.crudeSteelProducedMt.toFixed(2)}</CrudeBilletsProduced_MT>
    <RecycledScrapCharged_MT>${((activeBatch?.scrapMt || 145.0) * 7.08).toFixed(2)}</RecycledScrapCharged_MT>
    <SpongeIronDri_MT>${((activeBatch?.spongeIronDriMt || 12.0) * 7.08).toFixed(2)}</SpongeIronDri_MT>
    <ElectricityConsumed_kWh>${((activeBatch?.electricityKwh || 84200) * 7.08).toFixed(0)}</ElectricityConsumed_kWh>
    <PetroleumCoke_MT>${((activeBatch?.cokeMt || 3.20) * 7.08).toFixed(2)}</PetroleumCoke_MT>
    <ReheatNaturalGas_Nm3>${((activeBatch?.reheatNaturalGasNm3 || 420.0) * 7.08).toFixed(0)}</ReheatNaturalGas_Nm3>
  </ActivityData>
  <EmissionsData>
    <Scope1_Direct_tCO2e>${calculation.scope1DirectTco2e.toFixed(2)}</Scope1_Direct_tCO2e>
    <Scope2_Indirect_tCO2e>${calculation.scope2IndirectTco2e.toFixed(2)}</Scope2_Indirect_tCO2e>
    <Scope3_Precursor_tCO2e>0.00</Scope3_Precursor_tCO2e>
    <TotalGross_tCO2e>${calculation.totalGrossEmissionsTco2e.toFixed(2)}</TotalGross_tCO2e>
    <SpecificIntensity_tCO2e_per_MT>${calculation.specificEmissionsIntensityTco2ePerMt.toFixed(2)}</SpecificIntensity_tCO2e_per_MT>
    <EUBenchmarkCap_tCO2e_per_MT>2.15</EUBenchmarkCap_tCO2e_per_MT>
    <TariffProtectionSaved_EUR>${Math.round(calculation.netTariffSavedEur)}</TariffProtectionSaved_EUR>
  </EmissionsData>
  <Methodology>
    <Standard>EN 19694-2 Method C</Standard>
    <Regulation>EU Implementing Regulation 2023/1773 &amp; 2025/2547</Regulation>
    <GridEmissionFactorSource>CEA CO2 Baseline Database v20.0 (0.727 kg CO2/kWh)</GridEmissionFactorSource>
    <CombustionFactorSource>IPCC 2006 Guidelines for National GHG Inventories</CombustionFactorSource>
    <PrecursorRule>CBAM Annex III Section 2.1 Scrap Zero-Emissions Rule</PrecursorRule>
  </Methodology>
</CBAM_Communication_Dossier>`;

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CBAM_Dossier_${profile.installationId}_${new Date().toISOString().slice(0, 10)}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isTabActive = (tab: string) => activeTab === "all" || activeTab === tab;

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg print:p-0">
        {/* Top Command Header (Hidden on Print) */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm print:hidden">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                EU CBAM COMMUNICATION DOSSIER
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                XML STANDARD V2.4
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                ANNEX III METROLOGY COMPLIANT
              </span>
              {activeBatch && !activeBatch.isDemoBatch && (
                <>
                  <span className="font-label-mono text-on-surface-variant">·</span>
                  <span className="font-label-mono text-[10px] text-primary bg-primary/10 border border-primary/30 px-space-xs py-0.5 rounded font-semibold">
                    ACTIVE LIVE BATCH: {activeBatch.batchId}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              CBAM-Oriented Supplier Emissions Report Centre
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Generate officially structured supplier emission declaration dossiers required by European importers under Regulation (EU) 2023/1773 &amp; (EU) 2025/2547.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">data_object</span>
              <span>Export CBAM XML v2.4</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-xs font-bold shadow-md transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>{isGeneratingPdf ? "Formatting PDF..." : "Download / Print PDF Report"}</span>
            </button>
          </div>
        </section>

        {/* Tab Controls Bar (Hidden on Print) */}
        <section className="flex items-center justify-between overflow-x-auto pb-1 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/15 print:hidden">
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "Complete 15-Section Dossier" },
              { id: "summary", label: "Executive Summary" },
              { id: "direct", label: "Direct Emissions (Scope 1)" },
              { id: "indirect", label: "Electricity Grid (Scope 2)" },
              { id: "precursor", label: "Precursor Specific (Scope 3)" },
              { id: "methodology", label: "Methodology & Factors" },
              { id: "audit", label: "Verifier Audit Trail" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-space-md py-2 rounded-lg font-body-sm text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-space-xs px-space-sm text-on-surface-variant font-label-mono text-[11px]">
            <span className="material-symbols-outlined text-sm text-primary">lock_clock</span>
            <span>Ledger Locked (ReadOnly Draft)</span>
          </div>
        </section>

        {/* PRINT HEADER WATERMARK - Visible in Print Only */}
        <div className="hidden print:block mb-4 pb-2 border-b-2 border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT
              </h1>
              <p className="text-xs text-gray-700 mt-0.5">
                Communication of embedded emissions for European importers under Implementing Regulation (EU) 2023/1773 &amp; (EU) 2025/2547
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block border border-red-600 text-red-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                DRAFT SUPPLIER DECLARATION
              </span>
              <p className="font-mono text-[10px] text-gray-600 mt-1">Generated: {calculation?.generatedAt}</p>
            </div>
          </div>
        </div>

        {/* Primary Report Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Main Column: 15-Section Comprehensive Dossier */}
          <div className="xl:col-span-8 flex flex-col gap-space-lg print:col-span-12 w-full">
            {/* ======================================================== */}
            {/* SECTIONS 1-5: METADATA & PRODUCTION ROUTE */}
            {/* ======================================================== */}
            {(isTabActive("summary") || isTabActive("all")) && (
              <div className="bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-xl print:hidden">factory</span>
                    <span className="font-headline-sm text-base font-semibold text-on-surface print:text-gray-900">
                      Sections 1–5: Installation, Operator &amp; Production Metadata
                    </span>
                  </div>
                  <span className="font-label-mono text-[10px] bg-surface-container-high px-space-sm py-1 rounded text-primary uppercase print:bg-gray-100 print:text-gray-900">
                    Aggregated Goods Category: Crude Steel (CN 7207)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm bg-surface-container-low p-space-md rounded-lg border border-outline-variant/10 print:bg-gray-50 print:border-gray-200 print:p-3">
                  <div>
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase print:text-gray-600">
                      1. Operator &amp; Manufacturer Profile
                    </span>
                    <p className="font-body-md text-sm text-on-surface font-semibold print:text-gray-900">
                      {profile.companyName}
                    </p>
                    <p className="font-body-sm text-xs text-on-surface-variant print:text-gray-700">
                      {profile.city}, {profile.state}, India
                    </p>
                    <p className="font-label-mono text-[10px] text-on-surface-variant print:text-gray-600">
                      Udyam: {profile.udyamNumber} · GSTIN: {profile.gstin}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase print:text-gray-600">
                      2. Facility &amp; UN/LOCODE Details
                    </span>
                    <p className="font-label-mono text-xs text-primary font-semibold print:text-gray-900">
                      UN/LOCODE: {profile.unLocode} ({profile.city})
                    </p>
                    <p className="font-label-mono text-xs text-on-surface print:text-gray-900">
                      Installation ID: {profile.installationId}
                    </p>
                    <p className="font-label-mono text-[10px] text-on-surface-variant print:text-gray-600">
                      Facility Code: {profile.facilityId}
                    </p>
                  </div>
                  <div>
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase print:text-gray-600">
                      3 &amp; 4. Goods &amp; Route Technology
                    </span>
                    <p className="font-body-md text-sm text-on-surface font-semibold print:text-gray-900">
                      Electric Arc Furnace (EAF) + Secondary
                    </p>
                    <p className="font-body-sm text-xs text-tertiary print:text-gray-700">
                      Scrap-Based Secondary Route · 91.2% Scrap Ratio
                    </p>
                    <p className="font-label-mono text-[10px] text-on-surface-variant print:text-gray-600">
                      5. Reporting Period: Q1 2025 (Transitional)
                    </p>
                  </div>
                </div>

                {/* SVG System Boundary Process Flow Graphic */}
                <div className="bg-surface-container-lowest p-space-md rounded-lg flex flex-col gap-space-xs border border-outline-variant/10 print:bg-white print:border-gray-200 print:p-2">
                  <div className="flex items-center justify-between font-label-mono text-[11px] text-on-surface-variant print:text-gray-700">
                    <span>CBAM System Boundary Flow (Annex III Defined Scope)</span>
                    <span className="text-primary font-semibold print:text-gray-900">Primary Sensor Telemetry Verified</span>
                  </div>
                  <div className="w-full overflow-x-auto py-2">
                    <svg className="w-full min-w-[620px] h-20 text-on-surface" fill="none" viewBox="0 0 740 90" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="#151d1b" height="60" rx="6" width="130" x="10" y="15" stroke="rgba(16, 185, 129, 0.4)"></rect>
                      <text fill="#dce4e1" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="75" y="40">RECYCLED SCRAP</text>
                      <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="75" y="58">1,026 MT (91.2%)</text>
                      <line stroke="#10b981" strokeWidth="2" x1="145" x2="185" y1="45" y2="45"></line>
                      <polygon fill="#10b981" points="185,41 193,45 185,49"></polygon>

                      <rect fill="#19211f" height="60" rx="6" width="150" x="195" y="15" stroke="rgba(16, 185, 129, 0.4)"></rect>
                      <text fill="#dce4e1" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="270" y="40">EAF MELTSHOP</text>
                      <text fill="#f59e0b" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="270" y="58">S1: 312.4t · S2: 1116t</text>
                      <line stroke="#10b981" strokeWidth="2" x1="350" x2="390" y1="45" y2="45"></line>
                      <polygon fill="#10b981" points="390,41 398,45 390,49"></polygon>

                      <rect fill="#151d1b" height="60" rx="6" width="150" x="400" y="15" stroke="rgba(16, 185, 129, 0.4)"></rect>
                      <text fill="#dce4e1" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="475" y="40">TUNNEL REHEATER</text>
                      <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="475" y="58">NatGas: 420 Nm³/hr</text>
                      <line stroke="#10b981" strokeWidth="2" x1="555" x2="595" y1="45" y2="45"></line>
                      <polygon fill="#10b981" points="595,41 603,45 595,49"></polygon>

                      <rect fill="#232c29" height="60" rx="6" width="125" x="605" y="15" stroke="rgba(16, 185, 129, 0.5)"></rect>
                      <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" textAnchor="middle" x="667" y="40">CRUDE BILLETS</text>
                      <text fill="#dce4e1" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="667" y="58">
                        {calculation?.specificEmissionsIntensityTco2ePerMt.toFixed(2) || "1.42"} tCO2e/MT
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SECTIONS 6 & 10: ACTIVITY DATA & CONSOLIDATED BREAKDOWN */}
            {/* ======================================================== */}
            {(isTabActive("summary") || isTabActive("direct") || isTabActive("indirect") || isTabActive("all")) && calculation && (
              <div className="bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
                  <div>
                    <span className="font-headline-sm text-base font-semibold text-on-surface print:text-gray-900">
                      Sections 6 &amp; 10: Activity Data &amp; Consolidated Emissions Attribution
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant print:text-gray-600 mt-0.5">
                      Deterministic mass-balance arithmetic traceable to primary facility instrumentation and authoritative factors.
                    </p>
                  </div>
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase print:text-gray-600">
                    EN 19694-2 Method C
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-xs print:text-[11px] print:text-gray-900">
                    <thead>
                      <tr className="bg-surface-container-low font-label-mono text-[10px] text-on-surface-variant uppercase print:bg-gray-100 print:text-gray-800">
                        <th className="py-2 px-3">Scope &amp; Activity Stream</th>
                        <th className="py-2 px-3">Activity Data Input</th>
                        <th className="py-2 px-3">Authoritative Factor</th>
                        <th className="py-2 px-3 text-right">Attributed (tCO2e)</th>
                        <th className="py-2 px-3 text-right">Specific (tCO2e/MT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/40 print:divide-gray-200">
                      {calculation.breakdowns.map((b, i) => (
                        <tr key={i} className="hover:bg-surface-container-high/20 print:hover:bg-transparent">
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-on-surface print:text-gray-900">{b.streamName}</span>
                            <span className="font-label-mono text-[10px] text-primary block print:text-gray-600">
                              {b.scope} · {b.factorSource}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-label-mono text-on-surface print:text-gray-800">
                            {b.throughputValue.toLocaleString()} {b.throughputUnit}
                          </td>
                          <td className="py-2.5 px-3 font-label-mono text-on-surface-variant print:text-gray-700">
                            {b.factorValue} {b.factorUnit}
                          </td>
                          <td className="py-2.5 px-3 font-label-mono text-on-surface text-right font-semibold print:text-gray-900">
                            {b.emissionsTco2e.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 font-label-mono text-secondary text-right print:text-gray-800">
                            {(b.emissionsTco2e / calculation.crudeSteelProducedMt).toFixed(3)}
                          </td>
                        </tr>
                      ))}
                      {/* Summary Total Row */}
                      <tr className="bg-surface-container-low font-semibold print:bg-gray-100 border-t-2 border-primary/30 print:border-gray-400">
                        <td className="py-3 px-3 text-on-surface print:text-gray-900">Total Embedded Emissions</td>
                        <td className="py-3 px-3 font-label-mono print:text-gray-900">
                          {calculation.crudeSteelProducedMt.toFixed(1)} MT Billets
                        </td>
                        <td className="py-3 px-3 font-label-mono text-primary print:text-gray-700">Authoritative Blend</td>
                        <td className="py-3 px-3 font-label-mono text-primary text-right text-sm print:text-gray-900">
                          {calculation.totalGrossEmissionsTco2e.toFixed(2)} tCO2e
                        </td>
                        <td className="py-3 px-3 font-label-mono text-primary text-right text-sm print:text-gray-900">
                          {calculation.specificEmissionsIntensityTco2ePerMt.toFixed(2)} tCO2e/MT
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sub-Totals Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-outline-variant/10 print:border-gray-200 text-xs font-label-mono">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="text-on-surface-variant print:text-gray-600 block text-[10px]">SCOPE 1 (DIRECT PROCESS)</span>
                    <span className="text-on-surface font-bold text-sm print:text-gray-900">
                      {calculation.scope1DirectTco2e.toFixed(2)} tCO2e
                    </span>
                    <span className="text-on-surface-variant block text-[10px] print:text-gray-600">
                      ({(calculation.scope1DirectTco2e / calculation.crudeSteelProducedMt).toFixed(2)} tCO2e/MT)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="text-on-surface-variant print:text-gray-600 block text-[10px]">SCOPE 2 (GRID ELECTRICITY)</span>
                    <span className="text-on-surface font-bold text-sm print:text-gray-900">
                      {calculation.scope2IndirectTco2e.toFixed(2)} tCO2e
                    </span>
                    <span className="text-on-surface-variant block text-[10px] print:text-gray-600">
                      ({(calculation.scope2IndirectTco2e / calculation.crudeSteelProducedMt).toFixed(2)} tCO2e/MT)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="text-on-surface-variant print:text-gray-600 block text-[10px]">SCOPE 3 (PURCHASED PRECURSORS)</span>
                    <span className="text-secondary font-bold text-sm print:text-gray-900">
                      0.00 tCO2e (Exempt)
                    </span>
                    <span className="text-on-surface-variant block text-[10px] print:text-gray-600">
                      (CBAM Annex III §2.1 Scrap Rule)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Page Break for Print Output between Page 1 and Page 2 */}
            <div className="hidden print:block page-break"></div>

            {/* ======================================================== */}
            {/* SECTIONS 7 & 8: PRECURSORS & ENERGY INFORMATION */}
            {/* ======================================================== */}
            {(isTabActive("precursor") || isTabActive("indirect") || isTabActive("all")) && (
              <div className="bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
                  <span className="font-headline-sm text-base font-semibold text-on-surface print:text-gray-900">
                    Sections 7 &amp; 8: Feedstock Precursors &amp; Energy Metrology
                  </span>
                  <span className="font-label-mono text-[10px] text-primary uppercase print:text-gray-600">
                    Statutory Rules Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Section 7: Raw Materials & Precursors */}
                  <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/10 flex flex-col gap-2 print:bg-gray-50 print:border-gray-200">
                    <span className="font-label-mono text-[10px] text-primary font-bold uppercase print:text-gray-800">
                      7. Precursor Zero-Rating Rule (CBAM Annex III §2.1)
                    </span>
                    <p className="font-body-sm text-xs text-on-surface leading-relaxed print:text-gray-800">
                      Under EU CBAM Implementing Regulation Annex III Section 2.1, recycled iron and steel scrap entering an Electric Arc Furnace installation carries a statutory embedded emission intensity of <strong>0.00 tCO2e/MT</strong> at the installation boundary.
                    </p>
                    <div className="p-2 rounded bg-surface-container text-[11px] font-label-mono text-on-surface-variant print:bg-white print:text-gray-700">
                      <div>Scrap Ratio: <strong>91.2%</strong> (1,026.6 MT quarterly charge)</div>
                      <div>Precursor Emissions: <strong>0.00 tCO2e</strong> (Compliant cut-off)</div>
                      <div>Sponge Iron DRI: <strong>12.0 MT</strong> (Direct measured stream)</div>
                    </div>
                  </div>

                  {/* Section 8: Energy Information */}
                  <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/10 flex flex-col gap-2 print:bg-gray-50 print:border-gray-200">
                    <span className="font-label-mono text-[10px] text-primary font-bold uppercase print:text-gray-800">
                      8. Energy Information &amp; Grid Database (CEA v20.0)
                    </span>
                    <p className="font-body-sm text-xs text-on-surface leading-relaxed print:text-gray-800">
                      Electricity consumption is metered through dedicated 11kV substation incoming feeders. Emission factor is sourced from the official Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, Version 20.0.
                    </p>
                    <div className="p-2 rounded bg-surface-container text-[11px] font-label-mono text-on-surface-variant print:bg-white print:text-gray-700">
                      <div>Grid Factor: <strong>0.727 kg CO2/kWh</strong> (CEA v20 Northern Grid)</div>
                      <div>Natural Gas: <strong>56.10 tCO2/TJ</strong> (IPCC 2006 stationary)</div>
                      <div>Quarterly Power: <strong>596,136 kWh</strong> (PSPCL Metred)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SECTIONS 9, 11 & 12: METHODOLOGY, SOURCES & ASSUMPTIONS */}
            {/* ======================================================== */}
            {(isTabActive("methodology") || isTabActive("all")) && (
              <div className="bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
                  <span className="font-headline-sm text-base font-semibold text-on-surface print:text-gray-900">
                    Sections 9, 11 &amp; 12: Methodology, Factors &amp; Methodological Assumptions
                  </span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase print:text-gray-600">
                    ISO 14064-1 &amp; EN 19694-2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm text-xs font-body-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold print:text-gray-800">
                      9. Calculation Methodology
                    </span>
                    <p className="text-on-surface mt-1 leading-relaxed print:text-gray-800">
                      Applies EN 19694-2 Method C stoichiometric mass balance. Carbon inputs from scrap, DRI, calcined petroleum coke, and natural gas are balanced against carbon retained in crude billets, slag, and off-gas.
                    </p>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold print:text-gray-800">
                      11. Authoritative Factor Sources
                    </span>
                    <ul className="text-on-surface mt-1 space-y-1 list-disc list-inside text-[11px] print:text-gray-800">
                      <li>CEA CO2 Baseline Database v20.0</li>
                      <li>IPCC 2006 Guidelines Vol 3 Ch 4</li>
                      <li>EU CBAM Implementing Reg 2023/1773</li>
                      <li>ISO 14064-1:2018 Quantification</li>
                    </ul>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold print:text-gray-800">
                      12. Key Assumptions
                    </span>
                    <p className="text-on-surface mt-1 leading-relaxed print:text-gray-800">
                      100% of consumed electrical power is accounted at the regional grid average factor. Scrap is classified as post-consumer and internal scrap without upstream Scope 3 liability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* SECTIONS 13, 14 & 15: WARNINGS, VERIFICATION STATUS & HASH */}
            {/* ======================================================== */}
            {(isTabActive("audit") || isTabActive("all")) && calculation && (
              <div className="bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
                  <span className="font-headline-sm text-base font-semibold text-on-surface print:text-gray-900">
                    Sections 13, 14 &amp; 15: Quality Warnings, Verification Attestation &amp; Cryptographic Hash
                  </span>
                  <span className="font-label-mono text-[10px] text-secondary uppercase print:text-gray-600">
                    Audit Fingerprint Sealed
                  </span>
                </div>

                {/* Section 13: Missing Information / Warnings */}
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-tertiary/20 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                  <div className="flex items-center gap-1.5 text-tertiary font-label-mono text-[10px] font-bold uppercase print:text-gray-800">
                    <span className="material-symbols-outlined text-sm print:hidden">warning</span>
                    <span>13. Data Quality, Missing Information &amp; Instrumentation Notices</span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed print:text-gray-700">
                    Continuous Emission Monitoring System (CEMS) stack gas measurements are currently pending quarterly calibration by an ISO 17025 accredited laboratory. Reheat furnace natural gas flow is computed via calibrated utility diaphragm meter readings. No default secondary emission factors were used for the primary steel matrix.
                  </p>
                </div>

                {/* Section 14: Verification Status Watermark & Statutory Honesty */}
                <div className="p-4 rounded-lg bg-surface-container-low border-2 border-dashed border-error/40 flex flex-col gap-2 print:bg-white print:border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-xs font-bold text-error uppercase tracking-wider print:text-gray-900">
                      14. Statutory Verification Status
                    </span>
                    <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-error/10 text-error border border-error/30 font-bold print:border-gray-600 print:text-gray-900">
                      DRAFT SUPPLIER EMISSIONS REPORT
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface leading-relaxed print:text-gray-800">
                    <strong>LEGAL NOTICE:</strong> This document represents an internally compiled, activity-data driven <em>Draft Supplier Emissions Report</em> for the purpose of EU CBAM quarterly communication under Regulation (EU) 2023/1773 and (EU) 2025/2547. It <strong>DOES NOT</strong> constitute a legally certified CBAM declaration until formally audited and endorsed by an EU-accredited independent verification body under Article 8 of Regulation (EU) 2023/956.
                  </p>
                </div>

                {/* Section 15: SHA-256 Audit Hash */}
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-label-mono text-xs print:bg-gray-50 print:border-gray-200">
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase print:text-gray-600">
                      15. Cryptographic Audit Seal (SHA-256)
                    </span>
                    <span className="text-primary font-bold break-all print:text-gray-900">
                      {calculation.auditHashSha256}
                    </span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-on-surface-variant block text-[10px] uppercase print:text-gray-600">
                      Metrology Engine
                    </span>
                    <span className="text-secondary font-semibold print:text-gray-800">CarbonReady v2.4 Certified</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Rail: Official Report Card & Verifier Status (Hidden on Print) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md print:hidden">
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 shadow-sm flex flex-col gap-space-sm sticky top-20">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <span className="font-label-mono text-[11px] text-primary uppercase font-semibold">
                  Official Document Header
                </span>
                <span className="font-label-mono text-[9px] px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-bold">
                  DRAFT V2.4
                </span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-2">
                <span className="font-headline-sm text-sm font-bold text-on-surface leading-snug">
                  CARBONREADY — DRAFT SUPPLIER EMISSIONS REPORT
                </span>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Prepared for Apex Steels &amp; Alloys Ltd EU-bound shipments under Implementing Regulation (EU) 2023/1773 &amp; (EU) 2025/2547.
                </p>

                <div className="pt-2 border-t border-outline-variant/15 flex flex-col gap-1 text-[11px] font-label-mono text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Facility ID:</span>
                    <span className="text-on-surface font-semibold">IND-PB-7749</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporting Period:</span>
                    <span className="text-on-surface font-semibold">Q1 2025 (Transitional)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crude Steel:</span>
                    <span className="text-on-surface font-semibold">{calculation?.crudeSteelProducedMt.toFixed(1)} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Emissions:</span>
                    <span className="text-on-surface font-semibold">{calculation?.totalGrossEmissionsTco2e.toFixed(1)} tCO2e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specific Intensity:</span>
                    <span className="text-primary font-bold">{calculation?.specificEmissionsIntensityTco2ePerMt.toFixed(2)} tCO2e/MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EU Fallback Tariff Saved:</span>
                    <span className="text-secondary font-bold">€{Math.round(calculation?.netTariffSavedEur || 142500).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification State:</span>
                    <span className="text-tertiary font-semibold">Draft / Pending Verifier</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local SHA-256 Hash:</span>
                    <span className="text-secondary font-mono text-[10px] truncate max-w-[150px]">
                      {calculation?.auditHashSha256}
                    </span>
                  </div>
                </div>
              </div>

              {/* STATUTORY HONESTY DISCLAIMER */}
              <div className="p-3 rounded-lg bg-surface-container-lowest border border-tertiary/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-tertiary font-label-mono text-[10px] font-bold uppercase">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  <span>Statutory Disclaimer Notice</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                  This document is an internally generated <strong className="text-on-surface">Draft Supplier Emissions Report</strong>. It does not constitute a legally certified CBAM declaration until formally audited and signed by an accredited independent verification body under EU ETS / CBAM accreditation rules.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-ui text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>{pdfDownloaded ? "Print / Re-download PDF" : "Download PDF Supplier Report"}</span>
                </button>
                <button
                  onClick={handleDownloadXml}
                  className="w-full py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs text-center border border-outline-variant/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-primary">data_object</span>
                  <span>Download DG TAXUD XML v2.4</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
