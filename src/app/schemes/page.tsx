"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { GOVERNMENT_SCHEMES_DATA } from "@/lib/data/government-schemes";
import { SchemeCategory } from "@/types/schemes";

export default function GovernmentSchemesPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | SchemeCategory>("all");
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  const filteredSchemes = GOVERNMENT_SCHEMES_DATA.filter((s) => {
    if (activeCategory === "all") return true;
    return s.categories.includes(activeCategory);
  });

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                CENTRAL &amp; STATE GREEN SCHEMES
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                STATUTORY HONESTY VERIFIED
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                NO GUARANTEED DISBURSEMENT CLAIM
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Potential Government Scheme Matches
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Verified mapping of plant decarbonization initiatives against Ministry of MSME, SIDBI, and BEE schemes with authentic eligibility requirements.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/planner"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">tune</span>
              <span>Back to What-If Simulator</span>
            </Link>
          </div>
        </section>

        {/* 4 Summary Metric Tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Potential Subsidies &amp; Grants
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold">₹42.0L</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Capex Grant</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">ZED + BEE Synergies</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Historical Subvention Benchmark
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary font-bold">200 bps</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Historical</span>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary">Requires Extension Confirmation</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Plant Verification Gates
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary font-bold">2</span>
              <span className="text-xs text-on-surface-variant">Under Review /</span>
              <span className="font-metric-md text-base text-on-surface font-semibold">1</span>
              <span className="text-xs text-on-surface-variant">Doc Req</span>
            </div>
            <span className="font-label-mono text-[10px] text-on-surface-variant">Energy audit scheduled in Q2</span>
          </div>

          {/* Mandatory Statutory Disclaimer Tile */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-error/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-mono text-[10px] uppercase font-bold text-error">Statutory Principle</span>
              <span className="material-symbols-outlined text-error text-base">gavel</span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed my-1">
              Never treated as approved capital until sanctioned by respective nodal agencies (SIDBI, MoMSME, BEE).
            </p>
            <div className="flex items-center gap-1.5 font-label-mono text-[10px] text-error font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
              <span>ZERO SANCTION GUARANTEE</span>
            </div>
          </div>
        </section>

        {/* Filter and Content Layout */}
        <section className="flex flex-col gap-space-md">
          {/* Filter Bar */}
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-sm">
            <div className="flex items-center gap-space-xs overflow-x-auto w-full sm:w-auto">
              {[
                { id: "all", label: "All Schemes (3)" },
                { id: "capital", label: "Capital Subsidies (1)" },
                { id: "interest", label: "Interest Subventions (1)" },
                { id: "tech", label: "Tech Upgradation (2)" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveCategory(btn.id as typeof activeCategory)}
                  className={`px-space-sm py-1.5 rounded-lg font-label-mono text-xs transition-colors whitespace-nowrap ${
                    activeCategory === btn.id
                      ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-label-mono text-on-surface-variant">
              <span className="flex items-center gap-1 text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Potential Match
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Under Review
              </span>
            </div>
          </div>

          {/* Scheme Cards Stack */}
          <div className="flex flex-col gap-space-md">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="scheme-card rounded-xl bg-surface-container-low p-space-lg border border-outline-variant/15 shadow-sm hover:border-primary/40 transition-all flex flex-col gap-space-md"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-mono text-[10px] uppercase font-semibold">
                        {scheme.title}
                      </span>
                      <span className={`px-space-xs py-0.5 rounded font-label-mono text-[10px] uppercase ${
                        scheme.statusVariant === "historical" ? "bg-tertiary-container/30 text-tertiary-fixed" : "bg-surface-container-high text-secondary"
                      }`}>
                        {scheme.statusLabel}
                      </span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        REF: {scheme.referenceNumber}
                      </span>
                    </div>
                    <h2 className="font-headline-md text-base lg:text-lg text-on-surface font-semibold mt-0.5">
                      {scheme.fullName}
                    </h2>
                    <p className="font-label-mono text-[11px] text-secondary">
                      Issuing Authority: {scheme.issuingAuthority}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end shrink-0">
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                      Financial Incentive
                    </span>
                    <span className="font-metric-md text-base lg:text-lg text-primary font-semibold">
                      {scheme.subsidyHeadline}
                    </span>
                    <span className="font-label-mono text-[10px] text-tertiary text-left sm:text-right">
                      {scheme.subsidySubtext}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div>
                      <p className="font-label-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                        Statutory Provision &amp; Timeline Notice
                      </p>
                      <p className="font-body-md text-xs text-on-surface mt-1 leading-relaxed">
                        {scheme.statutoryNotice}
                      </p>

                      {scheme.historicalNotice && (
                        <div className="mt-2 p-2 rounded bg-surface-container-high/60 border border-error/30 flex flex-col gap-1">
                          <p className="font-label-mono text-[10px] text-error flex items-start gap-1">
                            <span className="material-symbols-outlined text-xs shrink-0 mt-0.5">event_busy</span>
                            <span><strong>{scheme.historicalNotice}</strong></span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-label-mono text-[10px] text-tertiary uppercase font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                        Plant Match Reason
                      </p>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {scheme.plantMatchReason}
                      </p>
                      <div className="mt-2 text-[10px] font-label-mono text-on-surface-variant">
                        <span>Last Verified: {scheme.lastVerifiedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Matrix & Pending Gates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
                      Eligibility Matrix
                    </span>
                    <ul className="flex flex-col gap-1 text-on-surface text-xs pl-1 mt-1">
                      {scheme.eligibilityCriteria.map((c, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                    <span className="font-label-mono text-[10px] text-tertiary uppercase flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-xs text-tertiary">hourglass_top</span>
                      Pending Verification Gate
                    </span>
                    <p className="font-body-sm text-xs text-on-surface mt-1 leading-relaxed">
                      {scheme.pendingGates}
                    </p>
                    <div className="mt-1 pt-1 border-t border-outline-variant/10 flex items-center justify-between font-label-mono text-[10px] text-on-surface-variant">
                      <span>Required Docs Indexed:</span>
                      <span className="text-primary font-bold">
                        {scheme.docsIndexedCount} / {scheme.docsTotalCount} Complete
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Deck */}
                <div className="pt-space-xs flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-outline-variant/10">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-label-mono text-xs text-secondary hover:text-primary flex items-center gap-1"
                  >
                    <span>Official Portal: {scheme.portalUrl.replace(/^https?:\/\//, "")}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>

                  <div className="flex items-center gap-space-xs w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedSchemeId(selectedSchemeId === scheme.id ? null : scheme.id)}
                      className="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono text-xs transition-colors"
                    >
                      {selectedSchemeId === scheme.id ? "Hide Details" : "View Application Guidance"}
                    </button>
                    <a
                      href={scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-primary text-on-primary font-label-mono text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Open Nodal Portal
                    </a>
                  </div>
                </div>

                {/* Expanded Guidance View */}
                {selectedSchemeId === scheme.id && (
                  <div className="p-space-md rounded-lg bg-surface-container-lowest border border-primary/20 text-xs flex flex-col gap-2">
                    <span className="font-label-mono text-primary font-bold uppercase text-[10px]">
                      CarbonReady Application Kit Guidance
                    </span>
                    <p className="text-on-surface-variant leading-relaxed">
                      To apply for {scheme.title}, ensure your Udyam registration is active and certified by your chartered accountant. Use CarbonReady&apos;s generated draft supplier emissions report and energy logs as supporting Annexure data for the nodal agency application.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

