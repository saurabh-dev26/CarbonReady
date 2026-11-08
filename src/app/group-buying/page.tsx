"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

interface GroupCampaign {
  id: string;
  title: string;
  category: "solar_ppa" | "waste_heat_recovery" | "high_efficiency_motors" | "scrap_pooling";
  cluster: string;
  targetCapacity: string;
  currentCommittedCapacity: string;
  progressPct: number;
  participatingMills: number;
  estimatedVolumeDiscountPct: number;
  estimatedCapexSavingsInrLakhs: number;
  closingDeadline: string;
  description: string;
  keySpecs: string[];
}

const INITIAL_CAMPAIGNS: GroupCampaign[] = [
  {
    id: "GRP-SOLAR-01",
    title: "Punjab Open Access Solar PPA Consortium (Phase II)",
    category: "solar_ppa",
    cluster: "Ludhiana & Mandi Gobindgarh",
    targetCapacity: "50 MW Solar PV",
    currentCommittedCapacity: "38.5 MW",
    progressPct: 77,
    participatingMills: 16,
    estimatedVolumeDiscountPct: 18.5,
    estimatedCapexSavingsInrLakhs: 14.5,
    closingDeadline: "2025-05-30",
    description: "Collective corporate power purchase agreement pooling off-site solar generation through PSPCL open-access wheeling, cutting power tariffs from ₹7.20 to ₹4.40/kWh.",
    keySpecs: ["PSPCL 66kV Interconnection", "Zero Upfront Capex (RESCO Model)", "Contracts locked for 15 years"],
  },
  {
    id: "GRP-WHRB-02",
    title: "Secondary EAF Waste Heat Recovery Boiler (WHRB) Collective RFQ",
    category: "waste_heat_recovery",
    cluster: "Ludhiana Industrial Cluster",
    targetCapacity: "8 Modular WHRB Units",
    currentCommittedCapacity: "5 Units",
    progressPct: 62,
    participatingMills: 5,
    estimatedVolumeDiscountPct: 14.0,
    estimatedCapexSavingsInrLakhs: 6.2,
    closingDeadline: "2025-06-15",
    description: "Joint equipment procurement tender with Thermax / Forbes Marshall for pre-engineered heat recovery steam generators capturing furnace off-gas at 650°C.",
    keySpecs: ["Custom EAF flue gas heat exchanger", "Combustion air preheating to 350°C", "Payback ~2.1 years"],
  },
  {
    id: "GRP-SCRAP-03",
    title: "High-Purity Shredded Scrap (ISRI 211) Bulk Procurement Pool",
    category: "scrap_pooling",
    cluster: "North India Steel Mini-Mill Consortium",
    targetCapacity: "25,000 MT / Month",
    currentCommittedCapacity: "18,200 MT",
    progressPct: 73,
    participatingMills: 21,
    estimatedVolumeDiscountPct: 4.5,
    estimatedCapexSavingsInrLakhs: 18.0,
    closingDeadline: "2025-04-30",
    description: "Collective import and railhead pooling of high-density shredded steel scrap to eliminate domestic scrap quality variance and improve meltshop yield to 93.5%.",
    keySpecs: ["Guaranteed density > 1.1 t/m³", "Max non-ferrous content < 0.8%", "Direct container delivery at Ludhiana ICD"],
  },
];

export default function GroupBuyingCoordinatorPage() {
  const [campaigns, setCampaigns] = useState<GroupCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<GroupCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [committedVolume, setCommittedVolume] = useState<string>("2.5 MW");
  const [contactName, setContactName] = useState("Rajesh Sharma");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleOpenInterest = (campaign: GroupCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleJoinCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    setSuccessNotice(`Expression of interest registered for "${selectedCampaign.title}". Added to cluster consortium list.`);
    setIsModalOpen(false);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                GREEN EQUIPMENT GROUP-BUYING
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                MSME CLUSTER CONSORTIUM
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                LUDHIANA &amp; MANDI GOBINDGARH
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Green Equipment Group-Buying Coordinator
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Pool procurement capacity with fellow MSME mini-mills in Punjab to negotiate institutional discounts on solar PPA contracts, heat recovery boilers, and certified scrap.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/schemes"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">account_balance</span>
              <span>Combine with MSME Grants →</span>
            </Link>
          </div>
        </section>

        {/* Notice of Demonstration Scope */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-tertiary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary text-xl shrink-0">groups</span>
            <div>
              <p className="font-label-mono text-[10px] text-tertiary font-bold uppercase">
                Consortium Integrity Principle
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Campaigns represent aggregated cluster initiatives. Joining pools your plant&apos;s demand to issue a collective Request for Quotation (RFQ). CarbonReady does not execute direct financial settlements or broker fees.
              </p>
            </div>
          </div>
          <span className="font-label-mono text-[10px] text-tertiary px-space-sm py-1 rounded bg-tertiary-container/20 border border-tertiary/30 shrink-0">
            DEMO GROUP-BUYING MODE
          </span>
        </div>

        {/* Success Banner */}
        {successNotice && (
          <div className="p-space-sm rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between text-xs text-primary font-body-sm shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>{successNotice}</span>
            </div>
            <button onClick={() => setSuccessNotice(null)} className="text-primary hover:text-on-surface">
              ✕
            </button>
          </div>
        )}

        {/* 4 Summary Metric Tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Active Campaigns
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold">3</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Consortium Pools</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">Punjab Industrial Belt</span>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Participating Mills
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold">42</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">EAF &amp; Induction Mills</span>
            </div>
            <span className="font-label-mono text-[10px] text-primary">Ludhiana &amp; Mandi Gobindgarh</span>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Average Volume Discount
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-secondary font-bold">12.3%</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Discount</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">Below standalone retail Capex</span>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Collective Savings
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary-fixed font-bold">₹38.7L</span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Pooled Savings</span>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary">Verified by OEM quotes</span>
          </div>
        </section>

        {/* Campaign Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm flex flex-col justify-between gap-space-md hover:border-primary/40 transition-all"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="font-label-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-primary">
                    {camp.id}
                  </span>
                  <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-bold">
                    {camp.estimatedVolumeDiscountPct}% OFF OEM CAPEX
                  </span>
                </div>

                <h3 className="font-headline-sm text-base font-semibold text-on-surface mt-1 leading-snug">
                  {camp.title}
                </h3>
                <p className="font-label-mono text-[11px] text-secondary">
                  {camp.cluster} · Deadline: {camp.closingDeadline}
                </p>

                <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress toward collective minimum order */}
                <div className="mt-2 flex flex-col gap-1 text-xs font-label-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-on-surface-variant">Capacity Committed:</span>
                    <span className="text-primary font-bold">
                      {camp.currentCommittedCapacity} / {camp.targetCapacity} ({camp.progressPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${camp.progressPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    {camp.participatingMills} local mills participating in tender
                  </span>
                </div>

                {/* Key Specs */}
                <div className="p-2.5 rounded bg-surface-container text-[11px] font-label-mono space-y-1 mt-1 text-on-surface-variant">
                  {camp.keySpecs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-primary">check</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/10 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-label-mono">
                  <span className="text-on-surface-variant">Est. Plant Savings:</span>
                  <span className="text-primary font-bold">₹{camp.estimatedCapexSavingsInrLakhs.toFixed(1)} Lakhs</span>
                </div>
                <button
                  onClick={() => handleOpenInterest(camp)}
                  className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-ui text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">handshake</span>
                  <span>Join Consortium Pool</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Join Consortium Modal */}
        {isModalOpen && selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-space-lg w-full max-w-lg shadow-2xl flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <div>
                  <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
                    Join Group-Buying Pool
                  </h3>
                  <span className="font-label-mono text-[10px] text-primary">
                    {selectedCampaign.title}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleJoinCampaign} className="flex flex-col gap-space-sm text-xs">
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Your Plant Required Capacity / Demand
                  </label>
                  <input
                    type="text"
                    required
                    value={committedVolume}
                    onChange={(e) => setCommittedVolume(e.target.value)}
                    placeholder="e.g. 2.0 MW Solar or 1 WHRB Unit"
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Lead Plant Representative
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-3 rounded bg-surface-container text-xs font-label-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Cluster:</span>
                    <span className="text-on-surface">{selectedCampaign.cluster}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Estimated Consortium Discount:</span>
                    <span className="text-secondary font-bold">{selectedCampaign.estimatedVolumeDiscountPct}% Off</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Target Deadline:</span>
                    <span className="text-on-surface">{selectedCampaign.closingDeadline}</span>
                  </div>
                </div>

                <p className="text-[11px] font-body-sm text-on-surface-variant">
                  Registering interest adds your capacity to the collective pool and generates the multi-plant RFQ document for OEM bidding.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary text-on-primary font-semibold hover:bg-secondary"
                  >
                    Register Consortium Interest
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

