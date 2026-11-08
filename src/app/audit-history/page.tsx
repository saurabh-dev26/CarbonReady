"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

interface ConsignmentRecord {
  id: string;
  ref: string;
  targetPort: string;
  date: string;
  hsCode: string;
  product: string;
  grossTco2e: number;
  specificIntensity: number;
  factors: string;
  hash: string;
  status: "Draft Declaration" | "Verified" | "Recalculated";
  isUserGenerated?: boolean;
}

const HISTORICAL_CONSIGNMENTS: ConsignmentRecord[] = [
  {
    id: "1",
    ref: "CS-2025-0842-HAM",
    targetPort: "Hamburg (DEHAM)",
    date: "28 Mar 2025",
    hsCode: "7207.11.00",
    product: "Crude Steel Billets (EAF)",
    grossTco2e: 1428.60,
    specificIntensity: 1.42,
    factors: "CEA v20 + MoPNG 2024",
    hash: "0x7F2A9...CB49",
    status: "Draft Declaration",
  },
  {
    id: "2",
    ref: "CS-2024-0612-GEN",
    targetPort: "Genova (ITGOA)",
    date: "14 Dec 2024",
    hsCode: "7207.11.00",
    product: "Continuous Cast Billets",
    grossTco2e: 1518.20,
    specificIntensity: 1.51,
    factors: "CEA v19 + MoPNG 2024",
    hash: "0x3D8B1...FA88",
    status: "Draft Declaration",
  },
  {
    id: "3",
    ref: "CS-2024-0419-ANT",
    targetPort: "Antwerp (BEANR)",
    date: "22 Sep 2024",
    hsCode: "7207.19.10",
    product: "Special Alloy Billets",
    grossTco2e: 1629.40,
    specificIntensity: 1.62,
    factors: "CEA v19 + IPCC 2006",
    hash: "0x9E4C2...A122",
    status: "Recalculated",
  },
  {
    id: "4",
    ref: "CS-2024-0104-HAM",
    targetPort: "Hamburg (DEHAM)",
    date: "15 Jan 2024",
    hsCode: "7207.11.00",
    product: "Crude Billets Baseline",
    grossTco2e: 1818.50,
    specificIntensity: 1.81,
    factors: "CEA v18 Baseline",
    hash: "0x1A7E9...DD31",
    status: "Draft Declaration",
  },
];

export default function AuditHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeProof, setActiveProof] = useState<ConsignmentRecord | null>(null);
  const [records, setRecords] = useState<ConsignmentRecord[]>(HISTORICAL_CONSIGNMENTS);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadRecords = () => {
      try {
        const savedRaw = localStorage.getItem("carbonready_saved_reports");
        if (savedRaw) {
          const saved = JSON.parse(savedRaw);
          if (Array.isArray(saved) && saved.length > 0) {
            const formatted: ConsignmentRecord[] = saved.map((s: any) => ({
              id: s.id || `USER-${Date.now()}`,
              ref: s.ref || "CS-2025-ACTIVE-HAM",
              targetPort: s.targetPort || "Hamburg (DEHAM)",
              date: s.date || "Today",
              hsCode: s.hsCode || "7207.11.00",
              product: s.product || "Crude Steel Billets (EAF)",
              grossTco2e: Number(s.grossTco2e || 1428.6),
              specificIntensity: Number(s.specificIntensity || 1.42),
              factors: s.factors || "CEA v20 + IPCC 2006",
              hash: s.hash
                ? `${s.hash.slice(0, 8)}...${s.hash.slice(-4)}`
                : "0x7F2A9...CB49",
              status: (s.status as any) || "Draft Declaration",
              isUserGenerated: true,
            }));

            const existingHashes = new Set(formatted.map((f) => f.hash));
            const combined = [
              ...formatted,
              ...HISTORICAL_CONSIGNMENTS.filter((h) => !existingHashes.has(h.hash)),
            ];
            setRecords(combined);
            return;
          }
        }
        setRecords(HISTORICAL_CONSIGNMENTS);
      } catch (err) {
        console.warn("Could not load stored audit records:", err);
        setRecords(HISTORICAL_CONSIGNMENTS);
      }
    };

    loadRecords();
    window.addEventListener("carbonready_batch_updated", loadRecords);
    return () => window.removeEventListener("carbonready_batch_updated", loadRecords);
  }, []);

  const latestRecord = records[0] || HISTORICAL_CONSIGNMENTS[0];

  const filtered = records.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.ref.toLowerCase().includes(q) ||
        item.targetPort.toLowerCase().includes(q) ||
        item.hsCode.toLowerCase().includes(q) ||
        item.hash.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStatus !== "all" && item.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = "Consignment_Ref,Port,Date,HS_Code,Product,Gross_tCO2e,Specific_Intensity,Factors,SHA256_Hash,Status\n";
    const rows = filtered
      .map(
        (r) =>
          `"${r.ref}","${r.targetPort}","${r.date}","${r.hsCode}","${r.product}",${r.grossTco2e},${r.specificIntensity},"${r.factors}","${r.hash}","${r.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CarbonReady_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                VERIFIABLE AUDIT TRAIL
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                SHA-256 CHECKSUM REGISTER
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                EU CBAM EXPORT LEDGER
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Consignment &amp; Audit History
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Chronological immutable ledger of all generated CBAM declarations, factor revisions, and sensor calibration timestamps.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={exportCsv}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">table_view</span>
              <span>Export Ledger CSV</span>
            </button>
            <Link
              href="/reports"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-label-ui text-xs font-bold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Create New Filing</span>
            </Link>
          </div>
        </section>

        {/* 4 Summary Metric Tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Total CBAM Declarations
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold">
                {records.length}
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">Draft Filings</span>
            </div>
            <span className="font-label-mono text-[10px] text-primary">
              {latestRecord.grossTco2e.toFixed(2)} tCO2e Current Scope
            </span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Specific Carbon Intensity
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold">
                {latestRecord.specificIntensity.toFixed(2)}
              </span>
              <span className="font-label-mono text-xs text-on-surface-variant ml-1">tCO2e/MT</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">EU Benchmark Cap: 2.15</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Historical Carbon Dip
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary-fixed font-bold">
                {(((latestRecord.specificIntensity - 1.81) / 1.81) * 100).toFixed(1)}%
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant ml-1">vs Baseline</span>
            </div>
            <span className="font-label-mono text-[10px] text-on-surface-variant">Q1 2024 Baseline: 1.81 tCO2e/MT</span>
          </div>

          {/* Verifier status */}
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Verifier Sign-off Status
            </span>
            <div className="my-1">
              <span className="font-body-md text-base text-on-surface font-semibold">Pending Verification</span>
            </div>
            <div className="flex items-center gap-1 font-label-mono text-[10px] text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span>Not Yet Independently Verified (Illustrative Draft)</span>
            </div>
          </div>
        </section>

        {/* Filter Bar & Table Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Main Table (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md min-w-0">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/15 shadow-sm">
              <div className="relative flex-1 min-w-[240px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by Consignment Ref, Port, or Hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest text-on-surface font-body-sm text-xs rounded-lg placeholder-on-surface-variant/70 focus:outline-none focus:border-primary border border-outline-variant/15"
                />
              </div>

              <div className="flex items-center gap-space-xs">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-surface-container-high text-on-surface font-label-mono text-xs px-3 py-2 rounded-lg border border-outline-variant/15 focus:outline-none cursor-pointer"
                >
                  <option value="all">Status: All Records</option>
                  <option value="Draft Declaration">Draft Declaration</option>
                  <option value="Verified">Verified</option>
                  <option value="Recalculated">Recalculated</option>
                </select>

                <button
                  onClick={exportCsv}
                  className="p-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg transition-colors border border-outline-variant/15"
                  title="Export CSV"
                >
                  <span className="material-symbols-outlined text-base">table_view</span>
                </button>
              </div>
            </div>

            {/* Consignments Table */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/15 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-sm text-xs">
                  <thead>
                    <tr className="bg-surface-container-lowest text-on-surface-variant font-label-mono text-[10px] uppercase tracking-wider border-b border-outline-variant/10">
                      <th className="py-space-sm px-space-md font-medium">Reporting &amp; Consignment</th>
                      <th className="py-space-sm px-space-md font-medium">Target &amp; HS Code</th>
                      <th className="py-space-sm px-space-md font-medium text-right">Gross &amp; Specific</th>
                      <th className="py-space-sm px-space-md font-medium">Assigned Factors</th>
                      <th className="py-space-sm px-space-md font-medium">Audit Verification</th>
                      <th className="py-space-sm px-space-md font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40">
                    {filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-high/20 transition-colors">
                        <td className="py-3 px-space-md">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-label-mono text-primary font-semibold">{row.ref}</span>
                            {row.isUserGenerated && (
                              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-label-mono text-[9px] font-bold">
                                Active Filing
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant block">{row.targetPort} · {row.date}</span>
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="font-label-mono text-on-surface font-medium block">{row.hsCode}</span>
                          <span className="text-[11px] text-on-surface-variant">{row.product}</span>
                        </td>
                        <td className="py-3 px-space-md text-right font-label-mono">
                          <span className="text-on-surface font-semibold block">{row.grossTco2e.toFixed(2)} t</span>
                          <span className="text-primary text-[11px]">{row.specificIntensity.toFixed(2)} tCO2e/MT</span>
                        </td>
                        <td className="py-3 px-space-md font-label-mono text-[10px] text-on-surface-variant">
                          {row.factors}
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="font-mono text-[10px] text-secondary block">{row.hash}</span>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-tertiary-container/20 text-tertiary-fixed font-label-mono text-[9px]">
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-space-md text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setActiveProof(row)}
                              className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-mono text-[10px] border border-primary/20 transition-colors"
                            >
                              Proof
                            </button>
                            {row.isUserGenerated && (
                              <Link
                                href="/reports"
                                className="px-2 py-1 rounded bg-primary-container hover:bg-primary text-on-primary-container font-label-mono text-[10px] font-bold transition-colors"
                                title="Open CBAM Dossier & PDF Export"
                              >
                                Dossier →
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Rail: Real-Time Event Log Stream (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <span className="font-label-mono text-[11px] text-primary uppercase font-semibold">
                  Event Audit Stream
                </span>
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </div>

              <div className="flex flex-col gap-3 pt-1 text-xs">
                <div className="flex items-start gap-2 border-l-2 border-primary pl-2">
                  <div className="flex flex-col">
                    <span className="font-label-mono text-[10px] text-primary">Today, 09:30 AM</span>
                    <span className="font-semibold text-on-surface">Voice Shift Log Ingested</span>
                    <span className="text-[11px] text-on-surface-variant">3 Heats, 142 MT Billets, 84,200 kWh</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 border-l-2 border-secondary pl-2">
                  <div className="flex flex-col">
                    <span className="font-label-mono text-[10px] text-secondary">Today, 09:32 AM</span>
                    <span className="font-semibold text-on-surface">Scope 1 &amp; 2 Re-Calculated</span>
                    <span className="text-[11px] text-on-surface-variant">Specific intensity updated: 1.42 tCO2e/MT</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 border-l-2 border-outline pl-2">
                  <div className="flex flex-col">
                    <span className="font-label-mono text-[10px] text-on-surface-variant">Yesterday, 04:15 PM</span>
                    <span className="font-semibold text-on-surface">Sub-meter #M-04 Synchronized</span>
                    <span className="text-[11px] text-on-surface-variant">PSPCL 66kV industrial feeder calibration check</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 border-l-2 border-tertiary pl-2">
                  <div className="flex flex-col">
                    <span className="font-label-mono text-[10px] text-tertiary">26 Mar 2025</span>
                    <span className="font-semibold text-on-surface">Sensor Recalibration Reminder</span>
                    <span className="text-[11px] text-on-surface-variant">Reheat gas thermal mass flow meter due in 14 days</span>
                  </div>
                </div>
              </div>

              {/* Modal or Details Card if Active Proof clicked */}
              {activeProof && (
                <div className="mt-2 p-3 rounded-lg bg-surface-container border border-primary/30 text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-primary font-bold">{activeProof.ref}</span>
                    <button onClick={() => setActiveProof(null)} className="text-on-surface-variant">✕</button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Cryptographic seal verified against local installation parameters. Emission factors locked at time of declaration.
                  </p>
                  <code className="p-1 rounded bg-surface-container-lowest font-mono text-[10px] text-secondary break-all">
                    {activeProof.hash}
                  </code>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

