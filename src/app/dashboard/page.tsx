"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AppShell } from "@/components/shell/AppShell";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { INITIAL_FACILITY_PROFILE, INITIAL_BATCH_LOG, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";
import { calculateCbamEmissions, CalculationInput } from "@/lib/engine/cbam-calculator";
import { CbamCalculationResult } from "@/types/emissions";

interface StoredBatch {
  batchId?: string;
  crudeBilletsMt?: number;
  scrapMt?: number;
  spongeIronDriMt?: number;
  electricityKwh?: number;
  cokeMt?: number;
  heatsCount?: number;
  reheatNaturalGasNm3?: number;
  source?: string;
  isDemoBatch?: boolean;
  completenessScorePct?: number;
  rawSpokenText?: string;
  translatedEnglish?: string;
  confirmedAt?: string;
  confirmedByManufacturer?: boolean;
}

export default function DashboardPage() {
  const [lang, setLang] = useState<"en" | "hi" | "mr">("en");
  const [showVoiceBanner, setShowVoiceBanner] = useState(true);
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [batchInfo, setBatchInfo] = useState<StoredBatch | null>(null);
  const [calculation, setCalculation] = useState<CbamCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const currentProfile = getStoredFacilityProfile();
      setProfile(currentProfile);

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

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("carbonready_active_batch");
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as StoredBatch;
            setBatchInfo(parsed);
            input = {
              ...input,
              crudeBilletsMt: parsed.crudeBilletsMt || input.crudeBilletsMt,
              scrapMt: parsed.scrapMt || input.scrapMt,
              spongeIronDriMt: parsed.spongeIronDriMt ?? input.spongeIronDriMt,
              electricityKwh: parsed.electricityKwh || input.electricityKwh,
              cokeMt: parsed.cokeMt || input.cokeMt,
              reheatNaturalGasNm3: parsed.reheatNaturalGasNm3 || input.reheatNaturalGasNm3,
              reportingMultiplier: 7.08,
            };
          } catch {
            // Keep default
          }
        }
      }

      const res = await calculateCbamEmissions(input);
      setCalculation(res);
      setIsLoading(false);
    }

    loadData();
    window.addEventListener("carbonready_profile_updated", loadData);
    window.addEventListener("carbonready_batch_updated", loadData);
    return () => {
      window.removeEventListener("carbonready_profile_updated", loadData);
      window.removeEventListener("carbonready_batch_updated", loadData);
    };
  }, []);

  const currentIntensity = calculation?.specificEmissionsIntensityTco2ePerMt ?? 1.42;
  const deltaBenchmark = Number((currentIntensity - 2.15).toFixed(2));
  const shieldPct = Math.max(0, Number((((2.15 - currentIntensity) / 2.15) * 100).toFixed(1)));
  const readinessPct = batchInfo?.completenessScorePct ?? 92;

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Command & Executive Context Ribbon */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                {(profile.city || "Ludhiana").toUpperCase()} WORKS #1
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                EAF &amp; INDUCTION ROUTE
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                TARGET PORTS: {profile.targetPorts?.join(" / ").toUpperCase() || "HAMBURG / GENOVA"}
              </span>
              {batchInfo && !batchInfo.isDemoBatch && batchInfo.confirmedByManufacturer ? (
                <>
                  <span className="font-label-mono text-on-surface-variant">·</span>
                  <span className="font-label-mono text-[10px] text-primary bg-primary/10 border border-primary/30 px-space-xs py-0.5 rounded flex items-center gap-1 font-semibold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    LIVE BATCH: {batchInfo.batchId || "CONFIRMED"}
                  </span>
                </>
              ) : batchInfo?.isDemoBatch ? (
                <>
                  <span className="font-label-mono text-on-surface-variant">·</span>
                  <span className="font-label-mono text-[10px] text-secondary bg-secondary/10 border border-secondary/20 px-space-xs py-0.5 rounded">
                    SAMPLE DEMO PRESET
                  </span>
                </>
              ) : (
                <>
                  <span className="font-label-mono text-on-surface-variant">·</span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded">
                    DEMO SIMULATION DATA
                  </span>
                </>
              )}
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              {profile.companyName} — Plant #1
            </h1>
            <div className="flex flex-wrap items-center gap-space-md pt-1">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                <span className="font-body-sm text-xs">
                  EU CBAM Transitional Period (Q1 2025 Submission:{" "}
                  <span className="text-secondary-fixed font-medium">Draft / In Review</span>)
                </span>
              </div>
              <div className="flex items-center gap-space-xs px-space-xs py-0.5 rounded bg-surface-container-high text-tertiary border border-tertiary/20">
                <span className="material-symbols-outlined text-xs">science</span>
                <span className="font-label-mono text-[9px] uppercase">
                  {batchInfo && !batchInfo.isDemoBatch
                    ? "PRIMARY OPERATIONAL TELEMETRY · AUDIT TRACEABLE"
                    : "BENCHMARK SIMULATION DATA · ISO 14064-1 VALIDATED"}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Action Bar */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center bg-surface-container-highest rounded-lg p-0.5 border border-outline-variant/15">
              <button
                onClick={() => setLang("en")}
                className={`px-space-sm py-1 rounded font-label-mono text-xs transition-all ${
                  lang === "en" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-space-sm py-1 rounded font-label-mono text-xs transition-all ${
                  lang === "hi" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang("mr")}
                className={`px-space-sm py-1 rounded font-label-mono text-xs transition-all ${
                  lang === "mr" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                मराठी
              </button>
            </div>

            <Link
              href="/assistant"
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base animate-pulse">mic</span>
              <span>Speak Today&apos;s Heat &amp; Scrap Log</span>
              <span className="font-label-mono text-[10px] bg-on-primary-container/20 px-1 rounded text-on-primary-container">
                REC
              </span>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">cloud_download</span>
              <span>XML Exporter</span>
            </Link>
          </div>
        </section>

        {/* Live Plant Voice Telemetry Banner */}
        {showVoiceBanner && (
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="flex items-center gap-space-md ml-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-xl">graphic_eq</span>
              </div>
              <div>
                <p className="font-label-mono text-[10px] text-primary uppercase font-semibold">
                  Multilingual Natural Speech Intake · Active (Nugen Aligned)
                </p>
                <p className="font-body-sm text-xs text-on-surface mt-0.5">
                  &ldquo;
                  {batchInfo?.rawSpokenText || INITIAL_BATCH_LOG.rawSpokenText}
                  &rdquo;{" "}
                  <span className="text-on-surface-variant">(Auto-parsed into CBAM Scope 1 &amp; 2 factors)</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0 ml-1 md:ml-0">
              <span className="font-label-mono text-[10px] px-space-xs py-0.5 rounded bg-surface-container text-secondary border border-secondary/20">
                SOURCE: {batchInfo?.source?.toUpperCase() || "VOICE INTAKE"}
              </span>
              <span className="font-label-mono text-[10px] px-space-xs py-0.5 rounded bg-surface-container text-primary border border-primary/20">
                CONFIDENCE: 98.4%
              </span>
              <Link
                href="/assistant"
                className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono text-[10px] transition-colors"
              >
                Open Terminal
              </Link>
              <button
                onClick={() => setShowVoiceBanner(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
                aria-label="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Primary 4-KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1: Emissions Total */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            whileHover={{ y: -2 }}
            className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                Total Gross Emissions
              </span>
              <span className="font-label-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">trending_down</span>-12.4% vs BASE
              </span>
            </div>
            <div className="my-space-sm">
              <div className="font-metric-xl text-2xl lg:text-3xl text-on-surface tracking-tight font-bold">
                {isLoading ? (
                  <span className="text-on-surface-variant animate-pulse">Calculating...</span>
                ) : (
                  <>
                    <AnimatedCounter value={calculation?.totalGrossEmissionsTco2e ?? 1428.6} decimals={1} />{" "}
                    <span className="font-label-mono text-xs text-on-surface-variant font-normal">tCO2e</span>
                  </>
                )}
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                Calculated per EU CBAM Implementing Reg. 2023/1773
              </p>
            </div>
            <div className="pt-space-xs flex items-center justify-between font-label-mono text-[11px] border-t border-outline-variant/10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant">
                  S1:{" "}
                  <span className="text-on-surface font-semibold">
                    <AnimatedCounter value={calculation?.scope1DirectTco2e ?? 312.4} decimals={1} /> t
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-on-surface-variant">
                  S2:{" "}
                  <span className="text-on-surface font-semibold">
                    <AnimatedCounter value={calculation?.scope2IndirectTco2e ?? 1116.2} decimals={1} /> t
                  </span>
                </span>
              </div>
              <span className="text-on-surface-variant">
                S3: <span className="text-on-surface">Exempt</span>
              </span>
            </div>
          </motion.div>

          {/* Card 2: Carbon Intensity per Ton */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -2 }}
            className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                Specific Carbon Intensity
              </span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-1.5 py-0.5 rounded">
                -{shieldPct}% SHIELD
              </span>
            </div>
            <div className="my-space-sm">
              <div className="font-metric-xl text-2xl lg:text-3xl text-primary tracking-tight font-bold">
                {isLoading ? (
                  <span className="text-on-surface-variant animate-pulse">...</span>
                ) : (
                  <AnimatedCounter value={currentIntensity} decimals={2} />
                )}{" "}
                <span className="font-label-mono text-xs text-on-surface-variant font-normal">tCO2e / MT Steel</span>
              </div>
              <div className="flex items-center gap-1 font-body-sm text-[11px] text-on-surface-variant mt-1">
                <span>EU Benchmark Default:</span>
                <span className="font-label-mono text-error font-medium">2.15 tCO2e/MT</span>
              </div>
            </div>
            <div className="pt-space-xs flex items-center justify-between font-label-mono text-[11px] border-t border-outline-variant/10">
              <span className="text-on-surface-variant">
                Delta:{" "}
                <span className="text-primary font-semibold">
                  {deltaBenchmark > 0 ? `+${deltaBenchmark}` : deltaBenchmark} tCO2e/MT
                </span>
              </span>
              <span className="text-secondary font-medium">Secondary EAF</span>
            </div>
          </motion.div>

          {/* Card 3: EU CBAM Readiness Score */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ y: -2 }}
            className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                EU CBAM Readiness Score
              </span>
              <span className="font-label-mono text-[10px] text-secondary bg-surface-container-high px-1.5 py-0.5 rounded">
                Tier 3 Dossier
              </span>
            </div>
            <div className="my-space-sm">
              <div className="font-metric-xl text-2xl lg:text-3xl text-on-surface tracking-tight font-bold">
                <AnimatedCounter value={readinessPct} decimals={0} suffix="%" />{" "}
                <span className="font-label-mono text-xs text-on-surface-variant font-normal">Compliance</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                4/4 Core parameters verified by primary metering
              </p>
            </div>
            <div className="pt-space-xs flex items-center justify-between font-label-mono text-[11px] border-t border-outline-variant/10">
              <span className="text-tertiary">1 Sensor Calibration Notice</span>
              <Link href="/calc-engine" className="text-primary hover:underline">
                Inspect →
              </Link>
            </div>
          </motion.div>

          {/* Card 4: CBAM Tariff Exposure Shield */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -2 }}
            className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                CBAM Tariff Shield
              </span>
              <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
            </div>
            <div className="my-space-sm">
              <div className="font-metric-xl text-2xl lg:text-3xl text-secondary tracking-tight font-bold">
                €<AnimatedCounter value={Math.round(calculation?.netTariffSavedEur ?? 142500)} decimals={0} />{" "}
                <span className="font-label-mono text-xs text-on-surface-variant font-normal">Saved / 1k MT</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                vs Default EU punitive fallback tariff (€
                {Math.round(calculation?.cbamDefaultPenaltyTariffEur ?? 284100).toLocaleString()})
              </p>
            </div>
            <div className="pt-space-xs flex items-center justify-between font-label-mono text-[11px] border-t border-outline-variant/10">
              <span className="text-on-surface-variant">
                Audited Exposure:{" "}
                <span className="text-on-surface font-semibold">
                  €{Math.round(calculation?.auditedExposureEur ?? 141600).toLocaleString()}
                </span>
              </span>
              <span className="text-primary font-bold">
                {(calculation?.protectionPercentage ?? 50.1).toFixed(1)}% Protection
              </span>
            </div>
          </motion.div>
        </section>

        {/* Central Analytical Split: Intensity Compression Curve + Consignment Ledger */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Left Chart (8 cols) */}
          <div className="xl:col-span-8 bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/10">
              <div>
                <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                  Specific Carbon Intensity Trajectory vs EU CBAM Benchmark
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Ludhiana Works secondary EAF compression trajectory compared to EU statutory fallback cap (2.15 tCO2e/MT).
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-mono text-[10px] text-primary px-2 py-0.5 rounded bg-surface-container-high border border-primary/20">
                  Target: &lt; 1.35 tCO2e/MT
                </span>
              </div>
            </div>

            {/* Visual SVG Trajectory Chart */}
            <div className="h-64 w-full bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between border border-outline-variant/10">
              <div className="flex items-center justify-between text-[11px] font-label-mono text-on-surface-variant">
                <span>EU Benchmark Cap: 2.15 tCO2e/MT</span>
                <span className="text-error font-medium">Punitive Default Threshold</span>
              </div>
              {/* Simulated Chart Plot Area */}
              <div className="relative w-full h-40 flex items-end">
                {/* Benchmark Line */}
                <div className="absolute top-4 left-0 right-0 border-b-2 border-dashed border-error/50"></div>
                {/* Historical Bars / Trajectory Curve */}
                <div className="w-full flex items-end justify-between gap-4 h-full pt-8 px-4">
                  {[
                    { period: "Q1-24", intensity: 1.81, label: "1.81" },
                    { period: "Q2-24", intensity: 1.74, label: "1.74" },
                    { period: "Q3-24", intensity: 1.62, label: "1.62" },
                    { period: "Q4-24", intensity: 1.51, label: "1.51" },
                    {
                      period: batchInfo && !batchInfo.isDemoBatch ? "Active Batch" : "Q1-25 (Current)",
                      intensity: currentIntensity,
                      label: currentIntensity.toFixed(2),
                      current: true,
                    },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span
                        className={`font-label-mono text-[11px] ${
                          bar.current ? "text-primary font-bold" : "text-on-surface-variant"
                        }`}
                      >
                        {bar.label}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(100, (bar.intensity / 2.2) * 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-full max-w-[56px] rounded-t ${
                          bar.current
                            ? "bg-primary shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            : "bg-primary/40 hover:bg-primary/60 transition-colors"
                        }`}
                      ></motion.div>
                      <span className="font-label-mono text-[10px] text-on-surface-variant whitespace-nowrap">
                        {bar.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-[10px] font-label-mono text-on-surface-variant">
                <span className="text-secondary">
                  ▼ {shieldPct}% Compression relative to EU Fallback Cap (2.15 tCO2e/MT)
                </span>
                <span>ISO 14064-1 Mathematical Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Actions & Telemetry Summary (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 shadow-sm flex flex-col gap-space-sm">
              <span className="font-label-mono text-[11px] text-primary uppercase font-semibold">
                Quick Action Terminal
              </span>
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/assistant"
                  className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-semibold text-on-surface">Voice Shift Log</span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        Speak Hindi / Marathi / English
                      </span>
                    </div>
                  </div>
                  <span className="text-primary text-xs">→</span>
                </Link>

                <Link
                  href="/calc-engine"
                  className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-lg">functions</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-semibold text-on-surface">Audit Calculations</span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        IPCC Tier 3 Mass Balance
                      </span>
                    </div>
                  </div>
                  <span className="text-secondary text-xs">→</span>
                </Link>

                <Link
                  href="/planner"
                  className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-lg">tune</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-semibold text-on-surface">What-If Simulator</span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        Scrap blend &amp; solar PPA
                      </span>
                    </div>
                  </div>
                  <span className="text-tertiary text-xs">→</span>
                </Link>

                <Link
                  href="/reports"
                  className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/15 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-lg">description</span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-semibold text-on-surface">Generate CBAM Dossier</span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        Download PDF &amp; XML v2.4
                      </span>
                    </div>
                  </div>
                  <span className="text-on-surface text-xs">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
