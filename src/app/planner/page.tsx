"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AppShell } from "@/components/shell/AppShell";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { DECARBONIZATION_LEVERS_DATA } from "@/lib/data/government-schemes";
import { calculateCbamEmissions } from "@/lib/engine/cbam-calculator";

export default function DecarbonizationPlannerPage() {
  // Levers state
  const [scrapRatio, setScrapRatio] = useState<number>(92); // 80 to 95%
  const [solarPpaPct, setSolarPpaPct] = useState<number>(40); // 0 to 100%
  const [whrbEnabled, setWhrbEnabled] = useState<boolean>(true);
  const [mode, setMode] = useState<"baseline" | "optimized">("optimized");

  // Dynamic baseline state
  const [baseIntensity, setBaseIntensity] = useState<number>(1.42); // tCO2e / MT
  const [baseEmissions, setBaseEmissions] = useState<number>(1428.6); // tCO2e
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("carbonready_active_batch");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          calculateCbamEmissions({
            crudeBilletsMt: parsed.crudeBilletsMt || 142.0,
            scrapMt: parsed.scrapMt || 145.0,
            spongeIronDriMt: parsed.spongeIronDriMt ?? 12.0,
            electricityKwh: parsed.electricityKwh || 84200,
            cokeMt: parsed.cokeMt || 3.20,
            reheatNaturalGasNm3: parsed.reheatNaturalGasNm3 || 420.0,
            reheatHours: 10,
            reportingMultiplier: 7.08,
            isQuarterlyAggregation: true,
          }).then((res) => {
            setBaseIntensity(Number(res.specificEmissionsIntensityTco2ePerMt.toFixed(2)));
            setBaseEmissions(Number(res.totalGrossEmissionsTco2e.toFixed(1)));
            if (!parsed.isDemoBatch && parsed.batchId) {
              setActiveBatchId(parsed.batchId);
            }
          });
        } catch {
          // Default
        }
      }
    }
  }, []);

  // Deterministic What-If Calculations
  // 1. Scrap ratio impact: Every +1% scrap over 85% reduces intensity by ~0.008 tCO2e/MT
  const scrapDelta = (scrapRatio - 85) * 0.008;

  // 2. Solar PPA impact: Reduces Scope 2 grid emissions proportional to solar share
  const solarDelta = (solarPpaPct / 100) * 0.44;

  // 3. WHRB impact: Reduces natural gas consumption by 17.8% -> ~0.026 tCO2e/MT
  const whrbDelta = whrbEnabled ? 0.026 : 0;

  const currentModeIntensity =
    mode === "baseline"
      ? baseIntensity
      : Math.max(0.75, Number((baseIntensity - scrapDelta - solarDelta - whrbDelta).toFixed(2)));

  const intensityReductionPct = (((baseIntensity - currentModeIntensity) / baseIntensity) * 100).toFixed(1);

  // Financial calculations
  const totalInvestmentLakhs =
    mode === "baseline"
      ? 0
      : (whrbEnabled ? 42.0 : 0) + (solarPpaPct > 0 ? 18.5 : 0) + (scrapRatio > 85 ? 28.0 : 0);

  const annualSavingsLakhs =
    mode === "baseline"
      ? 0
      : (whrbEnabled ? 20.0 : 0) + (solarPpaPct * 0.72) + ((scrapRatio - 80) * 1.2);

  const paybackYears =
    annualSavingsLakhs > 0 ? Number((totalInvestmentLakhs / annualSavingsLakhs).toFixed(1)) : 0;

  const cbamAdditionalSavedEur =
    mode === "baseline" ? 0 : Math.round((baseIntensity - currentModeIntensity) * 1006 * 85);

  const handleApplyOptimization = () => {
    setMode("optimized");
    setScrapRatio(92);
    setSolarPpaPct(40);
    setWhrbEnabled(true);
  };

  const handleApplyBaseline = () => {
    setMode("baseline");
    setScrapRatio(85);
    setSolarPpaPct(0);
    setWhrbEnabled(false);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                TECHNO-ECONOMIC DECISION SUPPORT
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                MACC OPTIMIZATION ENGINE
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              {activeBatchId ? (
                <span className="font-label-mono text-[10px] text-primary bg-primary/10 border border-primary/30 px-space-xs py-0.5 rounded font-semibold">
                  BASELINE CALIBRATED TO LIVE BATCH: {activeBatchId} ({baseIntensity} tCO2e/MT)
                </span>
              ) : (
                <span className="font-label-mono text-[10px] text-on-surface-variant">
                  BENCHMARK BASELINE: {baseIntensity} tCO2e/MT
                </span>
              )}
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Decarbonization Planner &amp; What-If Simulator
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Simulate operational interventions to compress carbon intensity, avoid EU CBAM tariffs, and maximize MSME subsidies with deterministic payback timelines.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/schemes"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">account_balance</span>
              <span>Match Subsidies &amp; Grants →</span>
            </Link>
          </div>
        </section>

        {/* Interactive What-If Scenario Simulator Hero Panel */}
        <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 flex flex-col gap-space-lg shadow-xl relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-tertiary/5 blur-3xl pointer-events-none"></div>

          {/* Panel Header & Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-space-md relative z-10 pb-space-sm border-b border-outline-variant/10">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
              <div>
                <h2 className="font-headline-sm text-base lg:text-lg text-on-surface font-semibold">
                  Multi-Variable Stress Test Engine
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Adjust shopfloor levers in real-time to compute marginal abatement cost curves and payback.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
              <button
                onClick={handleApplyBaseline}
                className={`px-space-md py-1.5 rounded-md font-label-mono text-xs transition-all ${
                  mode === "baseline"
                    ? "bg-surface-container-highest text-on-surface font-semibold shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Baseline ({baseIntensity} tCO2e/MT)
              </button>
              <button
                onClick={handleApplyOptimization}
                className={`px-space-md py-1.5 rounded-md font-label-mono text-xs transition-all ${
                  mode === "optimized"
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-md"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Proposed Mix (WHRB + Solar PPA + Scrap)
              </button>
            </div>
          </div>

          {/* Simulator Body: Controls (Left 5 cols) & Live Outputs (Right 7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg relative z-10">
            {/* Interactive Sliders (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container rounded-lg p-space-md border border-outline-variant/15 shadow-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <span className="font-label-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
                  Operating Variable Levers
                </span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">3 Active Levers</span>
              </div>

              {/* Lever 1: Scrap Blending Ratio */}
              <div className="flex flex-col gap-space-xs p-space-sm rounded bg-surface-container-low border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <label className="font-body-md text-xs text-on-surface font-medium flex items-center gap-1">
                    <span>Scrap Blending Ratio</span>
                  </label>
                  <span className="font-metric-md text-sm text-secondary font-bold">{scrapRatio}%</span>
                </div>
                <div className="flex items-center justify-between font-label-mono text-[10px] text-on-surface-variant">
                  <span>Base: 85%</span>
                  <span>Target: 95% Max</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="95"
                  value={scrapRatio}
                  onChange={(e) => {
                    setScrapRatio(Number(e.target.value));
                    setMode("optimized");
                  }}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-1"
                />
                <div className="flex justify-between font-label-mono text-[9px] text-on-surface-variant">
                  <span>80% Heavy DRI</span>
                  <span className="text-primary font-semibold">Modelled: {scrapRatio}%</span>
                  <span>95% Clean Scrap</span>
                </div>
              </div>

              {/* Lever 2: Solar PPA Mix */}
              <div className="flex flex-col gap-space-xs p-space-sm rounded bg-surface-container-low border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <span className="font-body-md text-xs text-on-surface font-medium">Electricity Sourcing Mix</span>
                  <span className="font-label-mono text-[11px] text-secondary px-1.5 py-0.5 rounded bg-surface-container font-bold">
                    {solarPpaPct}% Solar PPA
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={solarPpaPct}
                  onChange={(e) => {
                    setSolarPpaPct(Number(e.target.value));
                    setMode("optimized");
                  }}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-1"
                />
                <div className="flex justify-between font-label-mono text-[9px] text-on-surface-variant">
                  <span>100% PSPCL Grid (0.713 kg/kWh)</span>
                  <span className="text-primary font-semibold">{100 - solarPpaPct}% Grid · {solarPpaPct}% Solar</span>
                  <span>100% Green PPA</span>
                </div>
              </div>

              {/* Lever 3: WHRB Toggle */}
              <div className="flex items-center justify-between p-space-sm rounded bg-surface-container-low border border-outline-variant/10">
                <div className="flex flex-col">
                  <span className="font-body-md text-xs text-on-surface font-medium">Waste Heat Recovery Boiler (WHRB)</span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant">Preheat combustion air to 350°C</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWhrbEnabled(!whrbEnabled);
                    setMode("optimized");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-label-mono text-xs font-semibold transition-all ${
                    whrbEnabled
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {whrbEnabled ? "ACTIVE (₹42L)" : "BYPASS"}
                </button>
              </div>
            </div>

            {/* Visualized Outputs & ROI Metrics (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="grid grid-cols-2 gap-space-sm">
                {/* Output 1: Intensity */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-space-md rounded-xl bg-surface-container border border-outline-variant/15 flex flex-col justify-between"
                >
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Modelled Specific Intensity
                  </span>
                  <div className="my-1">
                    <span className="font-metric-xl text-3xl text-primary font-bold">
                      <AnimatedCounter value={currentModeIntensity} decimals={2} />
                    </span>
                    <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e/MT</span>
                  </div>
                  <span className="text-secondary font-label-mono text-[10px] font-semibold">
                    ▼ {intensityReductionPct}% Reduction vs Baseline
                  </span>
                </motion.div>

                {/* Output 2: Payback Period */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-space-md rounded-xl bg-surface-container border border-outline-variant/15 flex flex-col justify-between"
                >
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Estimated Payback Period
                  </span>
                  <div className="my-1">
                    <span className="font-metric-xl text-3xl text-tertiary-fixed font-bold">
                      {paybackYears > 0 ? (
                        <>
                          <AnimatedCounter value={paybackYears} decimals={1} /> Yrs
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-label-mono text-[10px]">
                    Capex: ₹{totalInvestmentLakhs.toFixed(1)}L · Annual: ₹{annualSavingsLakhs.toFixed(1)}L
                  </span>
                </motion.div>

                {/* Output 3: Annual Opex Savings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-space-md rounded-xl bg-surface-container border border-outline-variant/15 flex flex-col justify-between"
                >
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Annual Energy Cost Savings
                  </span>
                  <div className="my-1">
                    <span className="font-metric-xl text-2xl text-on-surface font-bold">
                      ₹<AnimatedCounter value={annualSavingsLakhs} decimals={1} /> Lakhs
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-label-mono text-[10px]">
                    Power tariff differential + fuel gas reduction
                  </span>
                </motion.div>

                {/* Output 4: Additional CBAM Tariff Savings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-space-md rounded-xl bg-surface-container border border-outline-variant/15 flex flex-col justify-between"
                >
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Additional CBAM Fiscal Protection
                  </span>
                  <div className="my-1">
                    <span className="font-metric-xl text-2xl text-secondary font-bold">
                      +€<AnimatedCounter value={cbamAdditionalSavedEur} decimals={0} />
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-label-mono text-[10px]">
                    Further buffer below EU 2.15 tCO2e/MT cap
                  </span>
                </motion.div>
              </div>

              {/* Formula & Method Notice */}
              <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-[11px] font-label-mono text-on-surface-variant">
                <span className="text-primary font-bold">Deterministic Abatement Equation: </span>
                ΔE = (DRI_reduced × 1.25 tCO2/MT) + (kWh_solar × 0.713 kg/kWh) + (Gas_saved_Nm³ × NCV × 56.10 tCO2/TJ).
              </div>
            </div>
          </div>
        </section>

        {/* Concrete Decarbonization Investment Projects Feed */}
        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg text-on-surface font-semibold">
              Prioritized Decarbonization Roadmap
            </h2>
            <span className="font-label-mono text-xs text-on-surface-variant">
              3 Evaluated MSME Opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {DECARBONIZATION_LEVERS_DATA.map((lever) => (
              <div
                key={lever.id}
                className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm flex flex-col justify-between gap-space-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold">
                      {lever.id.toUpperCase()}
                    </span>
                    <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-1.5 py-0.5 rounded">
                      {lever.estimatedPaybackPeriodYears} Yrs Payback
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface mt-1 leading-snug">
                    {lever.name}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {lever.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 flex flex-col gap-1 text-[11px] font-label-mono text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Investment:</span>
                    <span className="text-on-surface font-semibold">₹{lever.estimatedInvestmentInrLakhs.toFixed(1)} Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emissions Cut:</span>
                    <span className="text-primary font-bold">▼ {lever.potentialEmissionsReductionTco2eYr} tCO2e/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Savings:</span>
                    <span className="text-secondary font-semibold">{lever.potentialEnergySavingsPct}%</span>
                  </div>
                </div>

                <Link
                  href="/schemes"
                  className="w-full mt-1 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-mono text-[10px] text-center border border-primary/20 transition-colors"
                >
                  Find Matching Government Subsidy →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
