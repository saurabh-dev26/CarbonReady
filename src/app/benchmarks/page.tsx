"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

interface PeerEntry {
  rank: number;
  alias: string;
  cluster: string;
  state: string;
  route: string;
  scrapRatioPct: number;
  intensityTco2ePerMt: number;
  deltaEuBenchmarkPct: number;
  trendYoYPct: number;
  isCurrentUser?: boolean;
}

const PEER_LEADERBOARD_DATA: PeerEntry[] = [
  {
    rank: 1,
    alias: "MH-JALNA-EAF-03",
    cluster: "Jalna Industrial Area",
    state: "Maharashtra",
    route: "EAF (Secondary)",
    scrapRatioPct: 94.5,
    intensityTco2ePerMt: 1.22,
    deltaEuBenchmarkPct: -43.3,
    trendYoYPct: -16.4,
  },
  {
    rank: 2,
    alias: "PB-MANDI-MINIMILL-11",
    cluster: "Mandi Gobindgarh",
    state: "Punjab",
    route: "EAF (Secondary)",
    scrapRatioPct: 93.0,
    intensityTco2ePerMt: 1.34,
    deltaEuBenchmarkPct: -37.7,
    trendYoYPct: -11.2,
  },
  {
    rank: 3,
    alias: "Apex Steels & Alloys Ltd (You)",
    cluster: "Ludhiana Focal Point",
    state: "Punjab",
    route: "EAF (Secondary)",
    scrapRatioPct: 91.2,
    intensityTco2ePerMt: 1.42,
    deltaEuBenchmarkPct: -34.0,
    trendYoYPct: -12.4,
    isCurrentUser: true,
  },
  {
    rank: 4,
    alias: "GJ-KUTCH-INDUCTION-07",
    cluster: "Gandhidham / Kutch",
    state: "Gujarat",
    route: "Induction + EAF",
    scrapRatioPct: 88.0,
    intensityTco2ePerMt: 1.49,
    deltaEuBenchmarkPct: -30.7,
    trendYoYPct: -8.5,
  },
  {
    rank: 5,
    alias: "PB-LUDHIANA-WORKS-19",
    cluster: "Ludhiana Industrial Area",
    state: "Punjab",
    route: "EAF (Secondary)",
    scrapRatioPct: 86.5,
    intensityTco2ePerMt: 1.58,
    deltaEuBenchmarkPct: -26.5,
    trendYoYPct: -6.1,
  },
  {
    rank: 6,
    alias: "MH-NAGPUR-STEEL-02",
    cluster: "Nagpur Mini-Mill Hub",
    state: "Maharashtra",
    route: "EAF (Secondary)",
    scrapRatioPct: 85.0,
    intensityTco2ePerMt: 1.66,
    deltaEuBenchmarkPct: -22.8,
    trendYoYPct: -4.0,
  },
];

const CLUSTER_BENCHMARKS = [
  {
    name: "Jalna Steel Cluster",
    state: "Maharashtra",
    participatingMills: 14,
    avgIntensity: 1.38,
    solarAdoptionPct: 32,
    topStrength: "High solar captive wheeling & continuous scrap shredding",
  },
  {
    name: "Ludhiana Mini-Mill Cluster",
    state: "Punjab",
    participatingMills: 19,
    avgIntensity: 1.44,
    solarAdoptionPct: 18,
    topStrength: "Short logistics for local engineering scrap & bilateral PPA",
  },
  {
    name: "Mandi Gobindgarh Hub",
    state: "Punjab",
    participatingMills: 27,
    avgIntensity: 1.52,
    solarAdoptionPct: 12,
    topStrength: "Deep regional re-rolling integration & scrap sorting yards",
  },
  {
    name: "Kutch / Ahmedabad Cluster",
    state: "Gujarat",
    participatingMills: 16,
    avgIntensity: 1.47,
    solarAdoptionPct: 28,
    topStrength: "Proximity to Kandla / Mundra ports for low-freight export",
  },
];

export default function BenchmarksAndLeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "clusters">("leaderboard");
  const [isConsentEnabled, setIsConsentEnabled] = useState(true);

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                ANONYMIZED PEER BENCHMARKING
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                SECONDARY EAF MINI-MILL SECTOR
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                CONSENT-BASED PRIVACY PRESERVED
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Green Score Leaderboard &amp; Cluster Benchmarks
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Compare your plant&apos;s specific carbon intensity against peer mini-mills in Ludhiana, Mandi Gobindgarh, and Jalna with zero exposure of proprietary identity.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={() => setIsConsentEnabled(!isConsentEnabled)}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-mono text-xs border transition-all ${
                isConsentEnabled
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-surface-container-high border-outline-variant/20 text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isConsentEnabled ? "check_circle" : "cancel"}
              </span>
              <span>Anonymous Sharing: {isConsentEnabled ? "ACTIVE" : "PAUSED"}</span>
            </button>
          </div>
        </section>

        {/* 4 Summary Metric Tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1: Your Rank */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Your Cohort Ranking
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold">#3</span>
              <span className="font-body-sm text-xs text-on-surface-variant">of 76 Mills</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">
              Top 4th Percentile in EAF Category
            </span>
          </div>

          {/* Card 2: Sector Average */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Indian Mini-Mill Average
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold">1.51</span>
              <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e / MT</span>
            </div>
            <span className="font-label-mono text-[10px] text-primary">
              Your Plant: 1.42 (6.0% below sector avg)
            </span>
          </div>

          {/* Card 3: EU Benchmark Cap */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              EU CBAM Fallback Cap
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-error font-bold">2.15</span>
              <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e / MT</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">
              100% of participating cohort beats cap
            </span>
          </div>

          {/* Card 4: Top Abatement Gap */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Leader Gap to Close
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary-fixed font-bold">
                0.20
              </span>
              <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e / MT</span>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary">
              Achievable via 40% Solar PPA (in Planner)
            </span>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "leaderboard"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Anonymous Leaderboard (Top 6)
            </button>
            <button
              onClick={() => setActiveTab("clusters")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "clusters"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Industrial Cluster Benchmarks (4 Hubs)
            </button>
          </div>

          <span className="font-label-mono text-[10px] text-on-surface-variant">
            DEMO DATA · SYNTHETIC COHORT · ZERO CONFIDENTIAL DATA EXPOSED
          </span>
        </section>

        {/* Tab 1: Anonymous Leaderboard Table */}
        {activeTab === "leaderboard" && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
              <span className="font-headline-sm text-base font-semibold text-on-surface">
                Secondary EAF Crude Steel Ranking (CN 7207)
              </span>
              <span className="font-label-mono text-[10px] text-primary">
                Updated: Q1 2025 Reporting Cycle
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-xs">
                <thead>
                  <tr className="bg-surface-container font-label-mono text-[10px] text-on-surface-variant uppercase">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Participant Alias</th>
                    <th className="py-2.5 px-3">Cluster / Region</th>
                    <th className="py-2.5 px-3">Process Route</th>
                    <th className="py-2.5 px-3 text-right">Scrap Ratio</th>
                    <th className="py-2.5 px-3 text-right">Intensity (tCO2e/MT)</th>
                    <th className="py-2.5 px-3 text-right">vs EU Cap (2.15)</th>
                    <th className="py-2.5 px-3 text-right">YoY Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40">
                  {PEER_LEADERBOARD_DATA.map((p) => (
                    <tr
                      key={p.rank}
                      className={`transition-colors ${
                        p.isCurrentUser
                          ? "bg-primary/10 border-l-4 border-l-primary hover:bg-primary/15"
                          : "hover:bg-surface-container-high/30"
                      }`}
                    >
                      <td className="py-3 px-3 font-label-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            p.rank === 1
                              ? "bg-tertiary-container/40 text-tertiary-fixed"
                              : p.rank === 2
                              ? "bg-surface-container-highest text-secondary"
                              : p.isCurrentUser
                              ? "bg-primary text-on-primary font-bold"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {p.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-medium ${p.isCurrentUser ? "text-primary font-bold" : "text-on-surface"}`}>
                          {p.alias}
                        </span>
                        {p.isCurrentUser && (
                          <span className="font-label-mono text-[9px] ml-1.5 px-1 py-0.5 rounded bg-primary text-on-primary font-bold">
                            YOU
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant font-label-mono text-[11px]">
                        {p.cluster}, {p.state}
                      </td>
                      <td className="py-3 px-3 text-on-surface font-label-mono text-[11px]">
                        {p.route}
                      </td>
                      <td className="py-3 px-3 font-label-mono text-on-surface text-right">
                        {p.scrapRatioPct}%
                      </td>
                      <td className="py-3 px-3 font-label-mono text-right font-bold text-sm text-primary">
                        {p.intensityTco2ePerMt.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-label-mono text-secondary text-right">
                        {p.deltaEuBenchmarkPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 font-label-mono text-right text-primary font-semibold">
                        ▼ {Math.abs(p.trendYoYPct)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 2: Cluster Benchmarks */}
        {activeTab === "clusters" && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {CLUSTER_BENCHMARKS.map((c, i) => (
              <div
                key={i}
                className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm flex flex-col justify-between gap-space-md hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold">
                      {c.state} CLUSTER
                    </span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">
                      {c.participatingMills} Participating Mills
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                    {c.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 my-2 p-2.5 rounded-lg bg-surface-container text-xs font-label-mono">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase">Cluster Intensity</span>
                      <span className="text-primary font-bold text-sm">{c.avgIntensity} tCO2e/MT</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase">Solar PPA Share</span>
                      <span className="text-secondary font-semibold text-sm">{c.solarAdoptionPct}% Avg</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    <strong className="text-on-surface">Key Advantage:</strong> {c.topStrength}.
                  </p>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="font-label-mono text-[10px] text-secondary">
                    Beat EU Benchmark by {(((2.15 - c.avgIntensity) / 2.15) * 100).toFixed(1)}%
                  </span>
                  <Link
                    href="/planner"
                    className="text-primary hover:underline font-label-mono text-xs flex items-center gap-1"
                  >
                    <span>Adopt Cluster Levers</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}

