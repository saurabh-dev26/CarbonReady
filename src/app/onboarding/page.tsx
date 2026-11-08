"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import {
  INITIAL_FACILITY_PROFILE,
  getStoredFacilityProfile,
  saveStoredFacilityProfile,
} from "@/lib/data/initial-plant-data";
import { MetallurgicalRoute } from "@/types/plant";

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [selectedRoute, setSelectedRoute] = useState<MetallurgicalRoute>("EAF");
  const [activeStep, setActiveStep] = useState<number>(2);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredFacilityProfile();
      setProfile(stored);
      setSelectedRoute(stored.route || "EAF");
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFacilityProfile({ ...profile, route: selectedRoute });
    setSaveSuccess(true);
    setTimeout(() => {
      router.push("/assistant");
    }, 800);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Step Progress Tracker */}
        <section className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-space-sm p-space-sm rounded-lg cursor-pointer transition-colors ${
                activeStep === 1
                  ? "bg-surface-container-high border border-primary/30"
                  : "bg-surface-container-lowest"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-mono text-xs font-bold">
                ✓
              </div>
              <div className="flex flex-col truncate">
                <span className="font-label-mono text-[10px] text-primary uppercase leading-tight font-semibold">
                  Step 01 · Complete
                </span>
                <span className="font-body-md text-xs text-on-surface truncate">Facility Profile &amp; Governance</span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-space-sm p-space-sm rounded-lg cursor-pointer transition-colors ${
                activeStep === 2
                  ? "bg-surface-container-high border border-primary/40 shadow-sm"
                  : "bg-surface-container-lowest"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-mono text-xs font-bold">
                02
              </div>
              <div className="flex flex-col truncate">
                <span className="font-label-mono text-[10px] text-primary uppercase leading-tight font-semibold">
                  Step 02 · Active
                </span>
                <span className="font-body-md text-xs text-on-surface font-medium truncate">
                  Taxonomy &amp; Metallurgy Route
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-space-sm p-space-sm rounded-lg cursor-pointer transition-colors opacity-70 ${
                activeStep === 3
                  ? "bg-surface-container-high border border-primary/30 opacity-100"
                  : "bg-surface-container-lowest"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-mono text-xs">
                03
              </div>
              <div className="flex flex-col truncate">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase leading-tight">
                  Step 03 · Next
                </span>
                <span className="font-body-md text-xs text-on-surface-variant truncate">
                  Telemetry Ingestion
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-space-sm p-space-sm rounded-lg cursor-pointer transition-colors opacity-60 ${
                activeStep === 4
                  ? "bg-surface-container-high border border-primary/30 opacity-100"
                  : "bg-surface-container-lowest"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-mono text-xs">
                04
              </div>
              <div className="flex flex-col truncate">
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase leading-tight">
                  Step 04 · Queued
                </span>
                <span className="font-body-md text-xs text-on-surface-variant truncate">
                  Verification &amp; Port Filings
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Form: Metallurgy & Plant Capacity (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/15 flex flex-col gap-space-md shadow-sm">
              <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/10">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  <h2 className="font-headline-sm text-base lg:text-lg text-on-surface font-semibold">
                    Sector Taxonomy &amp; Primary Metallurgical Route
                  </h2>
                </div>
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[10px]">
                  CN Code: 7200 Series
                </span>
              </div>

              {/* Sub-sector and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Target Industrial Sub-Sector
                  </label>
                  <div className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between">
                    <span className="font-body-md text-sm text-on-surface font-medium">
                      {profile.subSector}
                    </span>
                    <span className="font-label-mono text-[10px] px-space-xs py-0.5 rounded bg-surface-container text-primary">
                      Annex I Validated
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Annual Liquid Steel Melting Capacity
                  </label>
                  <div className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between">
                    <input
                      type="number"
                      value={profile.annualCapacityMt}
                      onChange={(e) =>
                        setProfile({ ...profile, annualCapacityMt: Number(e.target.value) })
                      }
                      className="bg-transparent font-metric-md text-sm text-on-surface font-semibold focus:outline-none w-32"
                    />
                    <span className="font-label-mono text-[10px] text-on-surface-variant">Metric Tonnes / Yr</span>
                  </div>
                </div>
              </div>

              {/* Production Route Selection Cards */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Production Route Architecture (Select Active Pathway)
                  </label>
                  <span className="font-label-mono text-[10px] text-tertiary">
                    {selectedRoute === "EAF" ? "Direct Factor: 0.38 tCO2e/MT" : "Direct Factor: 0.45 tCO2e/MT"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  {/* Option 1: EAF */}
                  <div
                    onClick={() => setSelectedRoute("EAF")}
                    className={`cursor-pointer p-space-md rounded-xl relative flex flex-col justify-between gap-space-md transition-all ${
                      selectedRoute === "EAF"
                        ? "bg-surface-container-high border-2 border-primary shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                        : "bg-surface-container border border-outline-variant/15 hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="material-symbols-outlined text-primary text-xl">bolt</span>
                      {selectedRoute === "EAF" ? (
                        <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-mono text-[9px] font-bold">
                          SELECTED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-mono text-[9px]">
                          CHOOSE
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-sm font-semibold text-on-surface">
                        Electric Arc (EAF)
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-snug">
                        High scrap ratio, secondary metallurgy refining. Low Scope 1 footprint.
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                      <span>EEI: 88.4%</span>
                      <span className="text-primary font-bold">Standard CBAM</span>
                    </div>
                  </div>

                  {/* Option 2: Induction Furnace */}
                  <div
                    onClick={() => setSelectedRoute("INDUCTION")}
                    className={`cursor-pointer p-space-md rounded-xl relative flex flex-col justify-between gap-space-md transition-all ${
                      selectedRoute === "INDUCTION"
                        ? "bg-surface-container-high border-2 border-primary shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                        : "bg-surface-container border border-outline-variant/15 hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="material-symbols-outlined text-secondary text-xl">waves</span>
                      {selectedRoute === "INDUCTION" ? (
                        <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-mono text-[9px] font-bold">
                          SELECTED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-mono text-[9px]">
                          CHOOSE
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-sm font-semibold text-on-surface">
                        Induction Furnace (IF)
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-snug">
                        Popular MSME route in Punjab/Maharashtra. Medium specific electricity demand.
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                      <span>EEI: 84.1%</span>
                      <span className="text-secondary font-bold">Supported</span>
                    </div>
                  </div>

                  {/* Option 3: BF-BOF */}
                  <div
                    onClick={() => setSelectedRoute("BF_BOF")}
                    className={`cursor-pointer p-space-md rounded-xl relative flex flex-col justify-between gap-space-md transition-all ${
                      selectedRoute === "BF_BOF"
                        ? "bg-surface-container-high border-2 border-primary shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                        : "bg-surface-container border border-outline-variant/15 hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="material-symbols-outlined text-outline text-xl">factory</span>
                      {selectedRoute === "BF_BOF" ? (
                        <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-mono text-[9px] font-bold">
                          SELECTED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-mono text-[9px]">
                          CHOOSE
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-sm font-semibold text-on-surface">
                        Blast Furnace (BF-BOF)
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-snug">
                        Integrated primary ironmaking. High direct Scope 1 coal/coke emissions.
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                      <span>EEI: 72.0%</span>
                      <span className="text-tertiary font-bold">Primary</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plant Registration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs border-t border-outline-variant/10">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Enterprise Name &amp; Legal Entity
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Udyam MSME Registration Number
                  </label>
                  <input
                    type="text"
                    value={profile.udyamNumber}
                    onChange={(e) => setProfile({ ...profile, udyamNumber: e.target.value })}
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-label-mono text-sm text-secondary focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    Plant Works Location / Address
                  </label>
                  <input
                    type="text"
                    value="Ludhiana Industrial Area - Phase V, Punjab"
                    readOnly
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                    UN/LOCODE &amp; Installation ID
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profile.unLocode}
                      readOnly
                      className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-label-mono text-xs text-primary"
                    />
                    <input
                      type="text"
                      value={profile.installationId}
                      readOnly
                      className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-label-mono text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-space-xs">
              <Link
                href="/dashboard"
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-ui text-xs transition-colors"
              >
                ← Return to Overview
              </Link>
              <button
                type="submit"
                className="px-space-lg py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>{saveSuccess ? "Configuration Saved!" : "Save & Proceed to Voice Ingestion →"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Statutory Readiness Vault (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col gap-space-sm shadow-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <span className="font-label-mono text-[11px] text-primary uppercase font-semibold">
                  Readiness Vault Checklist
                </span>
                <span className="font-label-mono text-[10px] text-secondary">3/4 Validated</span>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">verified</span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-medium text-on-surface">Udyam Certificate</span>
                      <span className="font-label-mono text-[9px] text-on-surface-variant">UDYAM-PB-12-004921</span>
                    </div>
                  </div>
                  <span className="text-primary text-[10px] font-label-mono font-bold">INDEXED</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">verified</span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-medium text-on-surface">PPCB CTO Clearance</span>
                      <span className="font-label-mono text-[9px] text-on-surface-variant">Valid till 2026</span>
                    </div>
                  </div>
                  <span className="text-primary text-[10px] font-label-mono font-bold">INDEXED</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">verified</span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-medium text-on-surface">PSPCL 66kV Connection</span>
                      <span className="font-label-mono text-[9px] text-on-surface-variant">Sub-meter #M-04</span>
                    </div>
                  </div>
                  <span className="text-primary text-[10px] font-label-mono font-bold">INDEXED</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-base">pending</span>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-xs font-medium text-on-surface">Gas Flow Sensor Calibration</span>
                      <span className="font-label-mono text-[9px] text-tertiary">Due in 14 days</span>
                    </div>
                  </div>
                  <span className="text-tertiary text-[10px] font-label-mono font-bold">PENDING</span>
                </div>
              </div>

              <div className="mt-2 p-2.5 rounded bg-surface-container-highest/60 border border-outline-variant/15 text-[11px] text-on-surface-variant leading-relaxed">
                <span className="font-label-mono text-primary font-bold">Mandate Notice: </span>
                EU CBAM requires direct verification of production boundary installations and calibration records of all auxiliary sub-meters.
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

