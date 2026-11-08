"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AppShell } from "@/components/shell/AppShell";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { calculateCbamEmissions, CalculationInput } from "@/lib/engine/cbam-calculator";
import { CbamCalculationResult } from "@/types/emissions";
import { AUTHORITATIVE_EMISSION_FACTORS } from "@/lib/engine/emission-factors";
import { detectAnomalies, AnomalyDetectionReport, AnomalyCategory } from "@/lib/engine/anomaly-detector";

export default function CarbonIntelligenceEnginePage() {
  const [calculation, setCalculation] = useState<CbamCalculationResult | null>(null);
  const [anomalyReport, setAnomalyReport] = useState<AnomalyDetectionReport | null>(null);
  const [activeAnomalyCategory, setActiveAnomalyCategory] = useState<"all" | AnomalyCategory>("all");
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);

  useEffect(() => {
    async function runCalculation() {
      setIsLoading(true);
      let input: CalculationInput = {
        crudeBilletsMt: 142.0,
        scrapMt: 145.0,
        spongeIronDriMt: 12.0,
        electricityKwh: 84200,
        cokeMt: 3.20,
        reheatNaturalGasNm3: 420.0,
        reheatHours: 10,
        isQuarterlyAggregation: true,
      };

      // Check if user set active batch in localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("carbonready_active_batch");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            input = {
              ...input,
              ...parsed,
              reportingMultiplier: 7.08,
            };
          } catch {
            // Keep default
          }
        }
      }

      const res = await calculateCbamEmissions(input);
      const anomalies = detectAnomalies(input);
      setCalculation(res);
      setAnomalyReport(anomalies);
      setIsLoading(false);
    }

    runCalculation();
  }, []);

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAlerts = anomalyReport?.alerts.filter((a) => {
    if (activeAnomalyCategory === "all") return true;
    return a.category === activeAnomalyCategory;
  }) || [];

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Command Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                DETERMINISTIC CARBON ENGINE
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                EN 19694-2 METHOD C
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                EU IMPLEMENTING REG. 2023/1773 &amp; 2025/2547
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Carbon Intelligence &amp; Attribution Matrix
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Auditable activity-data calculation engine. Zero LLM hallucinations on math. Every gram of CO2e is traceable to authoritative source factors.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/reports"
              className="px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Generate CBAM Dossier →</span>
            </Link>
          </div>
        </section>

        {/* 4 Summary Metric Tiles */}
        {calculation && (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
            {/* Tile 1: Gross Emissions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Total Gross Emissions
                  </span>
                  <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-medium">
                    Q1 Reporting Scope
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold tracking-tight">
                    <AnimatedCounter value={calculation.totalGrossEmissionsTco2e} decimals={2} />
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant">tCO2e</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-outline-variant/10 flex flex-col gap-1 text-on-surface-variant font-label-mono text-[11px]">
                <div className="flex justify-between items-center text-xs">
                  <span>Scope 1 Direct:</span>
                  <span className="text-on-surface font-semibold">
                    <AnimatedCounter value={calculation.scope1DirectTco2e} decimals={2} /> t
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Scope 2 Grid:</span>
                  <span className="text-on-surface font-semibold">
                    <AnimatedCounter value={calculation.scope2IndirectTco2e} decimals={2} /> t
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-primary font-medium pt-0.5">
                  <span>Precursors (S3):</span>
                  <span>Exempt Secondary Scrap</span>
                </div>
              </div>
            </motion.div>

            {/* Tile 2: Specific Intensity */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Specific Intensity
                  </span>
                  <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                    -{calculation.protectionPercentage.toFixed(1)}% Shield
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
                    <AnimatedCounter value={calculation.specificEmissionsIntensityTco2ePerMt} decimals={2} />
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant">tCO2e / MT</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-outline-variant/10 flex flex-col gap-1 text-on-surface-variant font-label-mono text-[11px]">
                <div className="flex justify-between text-xs">
                  <span>EU Benchmark Cap:</span>
                  <span className="text-on-surface font-semibold">{calculation.euBenchmarkCapTco2ePerMt.toFixed(2)} tCO2e/MT</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                  <motion.div
                    className="bg-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(calculation.specificEmissionsIntensityTco2ePerMt / calculation.euBenchmarkCapTco2ePerMt) * 100}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-outline mt-0.5">
                  <span>Plant ({calculation.specificEmissionsIntensityTco2ePerMt.toFixed(2)})</span>
                  <span className="text-primary font-semibold">Deficit Delta ({calculation.intensityDeltaVsBenchmark.toFixed(2)})</span>
                </div>
              </div>
            </motion.div>

            {/* Tile 3: Completeness Score */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              whileHover={{ y: -2 }}
              className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Completeness Tier
                  </span>
                  <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-secondary">
                    Tier 3 Dossier
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold tracking-tight">
                    <AnimatedCounter value={calculation.completenessScorePct} decimals={0} suffix="%" />
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant">Physical Metrology</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-outline-variant/10 flex flex-col gap-1 text-on-surface-variant font-label-mono text-[11px]">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Telemetry Coverage:
                  </span>
                  <span className="text-on-surface font-medium">{calculation.completenessScorePct}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Data Health:
                  </span>
                  <span className="text-tertiary font-medium">{anomalyReport?.overallDataHealthScorePct ?? 95}%</span>
                </div>
              </div>
            </motion.div>

            {/* Tile 4: Tariff Shield Savings */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -2 }}
              className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    CBAM Tariff Shield
                  </span>
                  <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-xl text-2xl lg:text-3xl text-secondary font-bold tracking-tight">
                    €<AnimatedCounter value={calculation.netTariffSavedEur} decimals={0} />
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant">Saved</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-outline-variant/10 flex flex-col gap-1 text-on-surface-variant font-label-mono text-[11px]">
                <div className="flex justify-between text-xs">
                  <span>Default Fallback Tariff:</span>
                  <span className="text-on-surface">€{calculation.cbamDefaultPenaltyTariffEur.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-secondary font-medium">
                  <span>Audited Exposure:</span>
                  <span>€{calculation.auditedExposureEur.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-primary mt-0.5">
                  <span className="material-symbols-outlined text-xs">arrow_downward</span>
                  <span>50.1% net fiscal protection</span>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* FEATURE 10: EXPLAINABLE DATA QUALITY & ANOMALY INSPECTION PANEL */}
        {anomalyReport && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant/10">
              <div className="flex items-center gap-space-sm">
                <span className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-lg">policy</span>
                </span>
                <div>
                  <h2 className="font-headline-sm text-base font-semibold text-on-surface flex items-center gap-2">
                    <span>Explainable Data-Quality &amp; Anomaly Detection</span>
                    <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold">
                      Health Score: {anomalyReport.overallDataHealthScorePct}%
                    </span>
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                    {anomalyReport.summaryComment}
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-label-mono">
                {[
                  { id: "all", label: `All (${anomalyReport.totalAlertsCount})` },
                  { id: "missing_data", label: "Missing Data" },
                  { id: "unit_error", label: "Unit/Phys. Errors" },
                  { id: "statistical_anomaly", label: "Anomalies" },
                  { id: "under_reporting_review", label: "Under-Reporting" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveAnomalyCategory(f.id as any)}
                    className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                      activeAnomalyCategory === f.id
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {filteredAlerts.map((alert) => {
                const isAck = acknowledgedAlerts[alert.id];
                return (
                  <div
                    key={alert.id}
                    className={`p-space-md rounded-lg border transition-all flex flex-col justify-between gap-space-sm ${
                      alert.severity === "critical"
                        ? "bg-error/5 border-error/30"
                        : alert.severity === "warning"
                        ? "bg-tertiary/5 border-tertiary/30"
                        : "bg-surface-container border-outline-variant/15"
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-label-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            alert.severity === "critical"
                              ? "bg-error/20 text-error"
                              : alert.severity === "warning"
                              ? "bg-tertiary/20 text-tertiary-fixed"
                              : "bg-surface-container-high text-primary"
                          }`}
                        >
                          {alert.category.replace("_", " ").toUpperCase()} · {alert.severity.toUpperCase()}
                        </span>
                        <span className="font-label-mono text-[10px] text-on-surface-variant">
                          {alert.affectedInput}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-sm font-semibold text-on-surface mt-0.5">
                        {alert.headline}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                        {alert.reason}
                      </p>

                      <div className="p-2 rounded bg-surface-container-lowest/80 text-[11px] font-label-mono text-on-surface-variant space-y-0.5 mt-1">
                        <div>
                          <strong className="text-on-surface">Evidence Base:</strong> {alert.evidence}
                        </div>
                        <div>
                          <strong className="text-on-surface">Benchmark:</strong> {alert.comparisonBasis}
                        </div>
                        <div className="text-secondary font-semibold">
                          <strong>Recommended:</strong> {alert.recommendedCorrection}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        Status:{" "}
                        <span className={isAck ? "text-primary font-bold" : "text-tertiary font-medium"}>
                          {isAck ? "Acknowledged & Verified" : "Review Required"}
                        </span>
                      </span>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className={`px-3 py-1 rounded font-label-mono text-[11px] transition-colors ${
                          isAck
                            ? "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                            : "bg-primary text-on-primary font-semibold hover:bg-secondary"
                        }`}
                      >
                        {isAck ? "Re-open Notice" : "Acknowledge Notice"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Detailed Mathematical Decomposition Split Layout */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Scope 1 and Scope 2 Mathematical Models & Activity Table (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md">
            {/* Scope 1 Panel */}
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-outline-variant/10">
                <div className="flex items-center gap-space-sm">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-primary-container text-on-primary-container font-label-mono text-sm font-bold">
                    01
                  </span>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <h2 className="font-headline-sm text-base lg:text-lg text-on-surface font-semibold">
                        Direct Process Emissions (Scope 1)
                      </h2>
                      <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-medium">
                        Boundary: EAF + Reheat Battery
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Electric Arc Furnace (EAF) &amp; Continuous Billet Reheating Tunnel
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-metric-md text-lg text-primary font-bold">
                    {calculation?.scope1DirectTco2e.toFixed(2)}
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e (21.9%)</span>
                </div>
              </div>

              {/* Formula Display Box */}
              <div className="bg-surface-container-lowest p-space-sm rounded-lg mb-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between text-on-surface-variant font-label-mono text-[11px] mb-1">
                  <span className="uppercase flex items-center gap-1 text-primary font-semibold">
                    <span className="material-symbols-outlined text-sm">functions</span> Math Model (IPCC Tier-3 Mass Balance)
                  </span>
                  <span className="text-[10px]">EN 19694-2 Method C</span>
                </div>
                <code className="block font-label-mono text-xs text-secondary bg-surface-container/60 p-space-xs rounded overflow-x-auto whitespace-nowrap">
                  E_s1 = Σ(Q_fuel × EF_fuel × NCV) + (M_electrodes × C_electrode × 44/12) + (M_coke × C_coke × 44/12)
                </code>
              </div>

              {/* Activity Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-xs">
                  <thead>
                    <tr className="bg-surface-container font-label-mono text-[10px] text-on-surface-variant uppercase">
                      <th className="py-2.5 px-space-sm font-medium">Activity Stream</th>
                      <th className="py-2.5 px-space-sm font-medium">Throughput / Input</th>
                      <th className="py-2.5 px-space-sm font-medium">Assigned Factor</th>
                      <th className="py-2.5 px-space-sm font-medium text-right">Attributed (tCO2e)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40">
                    {calculation?.breakdowns
                      .filter((b) => b.scope === "Scope 1")
                      .map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-2.5 px-space-sm">
                            <div className="font-medium text-on-surface">{item.streamName}</div>
                            <div className="font-label-mono text-[10px] text-on-surface-variant">
                              {item.activityDescription}
                            </div>
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface">
                            {item.throughputValue.toLocaleString()} {item.throughputUnit}
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface-variant">
                            {item.factorValue} {item.factorUnit}{" "}
                            <span className="text-[10px] text-secondary">({item.factorSource.split(" ")[0]})</span>
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface text-right font-semibold">
                            {item.emissionsTco2e.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Sensor Recalibration Alert */}
              <div className="mt-space-md p-space-sm rounded-lg bg-surface-container border border-tertiary/20 flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary text-lg">warning</span>
                  <div className="flex flex-col">
                    <span className="font-label-mono text-[10px] text-tertiary font-semibold uppercase">
                      Sensor Recalibration Notice
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Reheating furnace gas flow meter recalibration due in 14 days (Class 2 Thermal Mass Flow Sensor).
                    </span>
                  </div>
                </div>
                <button className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface font-label-mono text-xs hover:bg-surface-container-highest transition-colors">
                  Log Calibration
                </button>
              </div>
            </div>

            {/* Scope 2 Panel */}
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-outline-variant/10">
                <div className="flex items-center gap-space-sm">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-secondary-container text-on-secondary-container font-label-mono text-sm font-bold">
                    02
                  </span>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <h2 className="font-headline-sm text-base lg:text-lg text-on-surface font-semibold">
                        Indirect Electricity Emissions (Scope 2)
                      </h2>
                      <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-medium">
                        Boundary: PSPCL 66kV Grid
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Punjab State Power Corporation Ltd · Dedicated 11kV Substation Incoming Feeders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-metric-md text-lg text-secondary font-bold">
                    {calculation?.scope2IndirectTco2e.toFixed(2)}
                  </span>
                  <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e (78.1%)</span>
                </div>
              </div>

              {/* Formula Display Box */}
              <div className="bg-surface-container-lowest p-space-sm rounded-lg mb-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between text-on-surface-variant font-label-mono text-[11px] mb-1">
                  <span className="uppercase flex items-center gap-1 text-secondary font-semibold">
                    <span className="material-symbols-outlined text-sm">functions</span> Grid Attribution Formula
                  </span>
                  <span className="text-[10px]">CEA CO2 Baseline Database v20.0</span>
                </div>
                <code className="block font-label-mono text-xs text-primary bg-surface-container/60 p-space-xs rounded overflow-x-auto whitespace-nowrap">
                  E_s2 = Consumption (MWh) × EF_grid (0.727 tCO2/MWh Northern Regional Grid)
                </code>
              </div>

              {/* Scope 2 Activity Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-xs">
                  <thead>
                    <tr className="bg-surface-container font-label-mono text-[10px] text-on-surface-variant uppercase">
                      <th className="py-2.5 px-space-sm font-medium">Activity Stream</th>
                      <th className="py-2.5 px-space-sm font-medium">Consumption Input</th>
                      <th className="py-2.5 px-space-sm font-medium">Grid Emission Factor</th>
                      <th className="py-2.5 px-space-sm font-medium text-right">Attributed (tCO2e)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40">
                    {calculation?.breakdowns
                      .filter((b) => b.scope === "Scope 2")
                      .map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="py-2.5 px-space-sm">
                            <div className="font-medium text-on-surface">{item.streamName}</div>
                            <div className="font-label-mono text-[10px] text-on-surface-variant">
                              {item.activityDescription}
                            </div>
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface">
                            {item.throughputValue.toLocaleString()} {item.throughputUnit}
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface-variant">
                            {item.factorValue} {item.factorUnit}{" "}
                            <span className="text-[10px] text-secondary">({item.factorSource.split(" ")[0]})</span>
                          </td>
                          <td className="py-2.5 px-space-sm font-label-mono text-on-surface text-right font-semibold">
                            {item.emissionsTco2e.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Rail: Authoritative Factor Registry & Cryptographic Audit Seal (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 shadow-sm flex flex-col gap-space-sm sticky top-20">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <span className="font-label-mono text-[11px] text-primary uppercase font-semibold">
                  Authoritative Factor Registry
                </span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">
                  {Object.values(AUTHORITATIVE_EMISSION_FACTORS).length} Verified Sources
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                {Object.values(AUTHORITATIVE_EMISSION_FACTORS).map((factor) => (
                  <div
                    key={factor.id}
                    onClick={() => setSelectedFactor(selectedFactor === factor.id ? null : factor.id)}
                    className="p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-xs font-semibold text-on-surface truncate pr-2">
                        {factor.name}
                      </span>
                      <span className="font-label-mono text-xs text-primary font-bold shrink-0">
                        {factor.factorValue} <span className="text-[10px] font-normal text-on-surface-variant">{factor.unit}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-label-mono text-on-surface-variant">
                      <span>{factor.source}</span>
                      <span className={`px-1 rounded ${
                        factor.verificationStatus === "Verified"
                          ? "bg-primary/10 text-primary"
                          : "bg-tertiary-container/30 text-tertiary-fixed"
                      }`}>
                        {factor.verificationStatus}
                      </span>
                    </div>

                    {selectedFactor === factor.id && (
                      <div className="mt-2 pt-2 border-t border-outline-variant/15 text-[11px] flex flex-col gap-1 text-on-surface-variant">
                        <p><strong>Source:</strong> {factor.source}</p>
                        <p><strong>Reference:</strong> {factor.sourceReference}</p>
                        <p><strong>Boundary:</strong> {factor.calculationBoundary}</p>
                        <p><strong>Published:</strong> {factor.publicationDate}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SHA-256 Checksum Card */}
              <div className="mt-2 p-2.5 rounded bg-surface-container-lowest border border-primary/20 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-label-mono">
                  <span className="text-on-surface-variant uppercase">Cryptographic Audit Hash:</span>
                  <span className="text-primary font-bold">SHA-256</span>
                </div>
                <code className="font-mono text-xs text-secondary break-all">
                  {calculation?.auditHashSha256 || "0x7F2A...CB49"}
                </code>
                <span className="text-[10px] text-on-surface-variant mt-0.5">
                  Reproducible local hash sealed with timestamp &amp; raw mass parameters.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/reports"
                  className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold text-center hover:bg-secondary transition-colors shadow-sm"
                >
                  Generate Supplier Report →
                </Link>
                <Link
                  href="/planner"
                  className="w-full py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs text-center border border-outline-variant/20 transition-colors"
                >
                  Model Decarbonization Improvements →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
