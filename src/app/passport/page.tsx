"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { INITIAL_FACILITY_PROFILE, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";

export default function DigitalProductPassportPage() {
  const [activeTab, setActiveTab] = useState<"passport" | "badge" | "espr_status">("passport");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [badgeTier, setBadgeTier] = useState<"declared" | "verified" | "draft">("declared");
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [activeBatch, setActiveBatch] = useState<any | null>(null);
  const [specificIntensity, setSpecificIntensity] = useState<number>(1.42);
  const [auditHash, setAuditHash] = useState<string>("0x7F2A6D3B9C1E4F8A0B2C4D6E8F1A3B5C7D9E0F2A4B6C8D0E2F4A6B8C0D2E4F6A");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncData = () => {
      const p = getStoredFacilityProfile();
      setProfile(p);

      try {
        const batchRaw = localStorage.getItem("carbonready_active_batch");
        if (batchRaw) {
          setActiveBatch(JSON.parse(batchRaw));
        }

        const reportsRaw = localStorage.getItem("carbonready_saved_reports");
        if (reportsRaw) {
          const reports = JSON.parse(reportsRaw);
          if (Array.isArray(reports) && reports.length > 0) {
            if (reports[0].specificIntensity) {
              setSpecificIntensity(Number(reports[0].specificIntensity));
            }
            if (reports[0].hash) {
              setAuditHash(reports[0].hash);
            }
          }
        }
      } catch (e) {
        console.warn("Could not sync passport data:", e);
      }
    };

    syncData();
    window.addEventListener("carbonready_profile_updated", syncData);
    window.addEventListener("carbonready_batch_updated", syncData);
    return () => {
      window.removeEventListener("carbonready_profile_updated", syncData);
      window.removeEventListener("carbonready_batch_updated", syncData);
    };
  }, []);

  const batchNumber = activeBatch?.batchId || "BATCH-2025-Q1-0842";
  const scrap = Number(activeBatch?.scrapMt || 145);
  const dri = Number(activeBatch?.spongeIronDriMt || 12);
  const coke = Number(activeBatch?.cokeMt || 3.2);
  const totalCharge = scrap + dri + coke;
  const recycledContentPct = totalCharge > 0 ? Number(((scrap / totalCharge) * 100).toFixed(1)) : 91.2;

  const passportData = {
    urn: `urn:dpp:in:steel:7207:${profile.installationId.toLowerCase().replace(/[^a-z0-9]/g, "")}-${batchNumber.toLowerCase()}`,
    productName: "High-Tensile Prime Crude Steel Billets",
    cnCode: "7207 11 00",
    batchNumber,
    dimensions: "150mm × 150mm × 12,000mm",
    steelGrade: "IS 2830 / EN 10025-2 S275JR",
    manufacturer: profile.companyName,
    facilityId: profile.facilityId,
    installationId: profile.installationId,
    unLocode: profile.unLocode,
    countryOfOrigin: "India (IN)",
    productionRoute: "Secondary Electric Arc Furnace (EAF)",
    recycledContentPct,
    carbonIntensityTco2ePerMt: specificIntensity,
    euBenchmarkCapTco2ePerMt: 2.15,
    sha256Hash: auditHash,
    issuedDate: "2025-03-28",
    verificationStatus: "Manufacturer-Declared Primary Telemetry",
    complianceFramework: "EU ESPR (Reg. 2024/1781) & CBAM (Reg. 2023/1773)",
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://verify.carbonready.org/passport/${passportData.urn}`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                EU ESPR DIGITAL PRODUCT PASSPORT
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                CIRPASS ARCHITECTURE READY
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                CRUDE STEEL COMMODITY (CN 7207)
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Digital Product Passport &amp; CBAM Trust Badge
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              CIRPASS-aligned digital product passport encoding material circularity, recycled scrap percentage, and verified carbon intensity with cryptographic audit sealing.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">
                {copiedUrl ? "check" : "share"}
              </span>
              <span>{copiedUrl ? "Passport Link Copied!" : "Share Passport Link"}</span>
            </button>
            <Link
              href="/reports"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold shadow-md hover:bg-secondary transition-all"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Dossier XML →</span>
            </Link>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setActiveTab("passport")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "passport"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Interactive Digital Product Passport (DPP)
            </button>
            <button
              onClick={() => setActiveTab("badge")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "badge"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Embeddable Carbon Trust Badge
            </button>
            <button
              onClick={() => setActiveTab("espr_status")}
              className={`px-space-md py-1.5 rounded-lg font-label-mono text-xs transition-colors ${
                activeTab === "espr_status"
                  ? "bg-surface-container-highest text-primary font-semibold border border-primary/30"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              ESPR Delegated Acts Tracker
            </button>
          </div>

          <span className="font-label-mono text-[10px] text-on-surface-variant hidden md:inline">
            CIRPASS PILOT COMPLIANT · UN AMBIENT URN SCHEME
          </span>
        </section>

        {/* TAB 1: DIGITAL PRODUCT PASSPORT MAIN CARD */}
        {activeTab === "passport" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left 8 Cols: Passport Document Structure */}
            <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
              {/* Passport Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/10">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                  </div>
                  <div>
                    <span className="font-label-mono text-[10px] text-primary uppercase font-bold">
                      Digital Product Passport (DPP-EU)
                    </span>
                    <h2 className="font-headline-sm text-base lg:text-lg font-semibold text-on-surface">
                      {passportData.productName}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="font-label-mono text-[10px] text-secondary bg-surface-container-high px-2 py-0.5 rounded font-bold">
                    CIRCULAR STEEL · 91.2% RECYCLED
                  </span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant mt-0.5">
                    Batch: {passportData.batchNumber}
                  </span>
                </div>
              </div>

              {/* Unique Identifier Strip */}
              <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-label-mono text-xs">
                <div>
                  <span className="text-on-surface-variant text-[10px] block uppercase">Unique Digital Identifier (URN)</span>
                  <span className="text-primary font-bold break-all">{passportData.urn}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] shrink-0"
                >
                  {copiedUrl ? "Copied" : "Copy URN"}
                </button>
              </div>

              {/* 3-Column Key Technical Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm text-xs font-label-mono">
                <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Commodity Classification</span>
                  <p className="font-semibold text-on-surface mt-0.5">{passportData.cnCode}</p>
                  <p className="text-[11px] text-on-surface-variant font-normal">Semi-finished products of iron/steel</p>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Standard Grade</span>
                  <p className="font-semibold text-on-surface mt-0.5">{passportData.steelGrade}</p>
                  <p className="text-[11px] text-on-surface-variant font-normal">{passportData.dimensions}</p>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Installation &amp; Origin</span>
                  <p className="font-semibold text-on-surface mt-0.5">{passportData.unLocode} (Ludhiana)</p>
                  <p className="text-[11px] text-primary font-normal">{passportData.manufacturer}</p>
                </div>
              </div>

              {/* Material Composition & Circularity Decomposition */}
              <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10 flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[11px] text-primary uppercase font-bold">
                    Material Circularity &amp; Chemical Composition
                  </span>
                  <span className="font-label-mono text-[10px] text-secondary font-semibold">
                    ISO 14021 Type II Self-Declaration
                  </span>
                </div>

                {/* Circularity Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-label-mono mb-1">
                    <span className="text-on-surface font-semibold">Post-Consumer Recycled Steel Scrap</span>
                    <span className="text-primary font-bold">{passportData.recycledContentPct}% Circularity</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden flex">
                    <div style={{ width: "91.2%" }} className="bg-primary h-full" title="Recycled Scrap (91.2%)"></div>
                    <div style={{ width: "7.5%" }} className="bg-tertiary-fixed h-full" title="Sponge Iron DRI (7.5%)"></div>
                    <div style={{ width: "1.3%" }} className="bg-secondary h-full" title="Alloys & Carbon (1.3%)"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-label-mono text-on-surface-variant mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> 91.2% Recycled Scrap
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span> 7.5% Virgin Sponge DRI
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> 1.3% Recarburizer &amp; Fluxes
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental & Carbon Intensity Profile */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest border border-primary/20 flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-[11px] text-primary uppercase font-bold">
                    Embedded Greenhouse Gas Intensity (Scope 1 + 2 + 3)
                  </span>
                  <span className="font-label-mono text-[10px] text-secondary font-bold">
                    -34.0% BELOW EU BENCHMARK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm my-1 text-xs font-label-mono">
                  <div className="p-2 rounded bg-surface-container">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Audited Specific Intensity</span>
                    <span className="text-primary font-bold text-base">{passportData.carbonIntensityTco2ePerMt} tCO2e/MT</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container">
                    <span className="text-[10px] text-on-surface-variant block uppercase">EU Fallback Benchmark</span>
                    <span className="text-error font-semibold text-base">{passportData.euBenchmarkCapTco2ePerMt} tCO2e/MT</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container">
                    <span className="text-[10px] text-on-surface-variant block uppercase">CBAM Net Tariff Shield</span>
                    <span className="text-secondary font-bold text-base">€142,500 / 1k MT</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 text-[10px] font-label-mono text-on-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>Cryptographic Seal: <strong className="text-secondary font-mono text-[10px]">{passportData.sha256Hash.slice(0, 24)}...</strong></span>
                  <span className="text-primary font-semibold">Standard: EN 19694-2 Method C</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Interactive QR Code & Scannable Widget */}
            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col items-center text-center gap-space-md">
                <span className="font-label-mono text-[11px] text-primary uppercase font-bold">
                  Machine-Readable QR Code
                </span>

                {/* Scannable SVG Simulated QR Code */}
                <div className="p-4 rounded-xl bg-white text-gray-900 shadow-xl border-4 border-primary/30 flex flex-col items-center">
                  <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Corner Squares */}
                    <rect x="10" y="10" width="50" height="50" fill="#111827" rx="6"></rect>
                    <rect x="20" y="20" width="30" height="30" fill="#ffffff" rx="2"></rect>
                    <rect x="27" y="27" width="16" height="16" fill="#047857" rx="2"></rect>

                    <rect x="140" y="10" width="50" height="50" fill="#111827" rx="6"></rect>
                    <rect x="150" y="20" width="30" height="30" fill="#ffffff" rx="2"></rect>
                    <rect x="157" y="27" width="16" height="16" fill="#047857" rx="2"></rect>

                    <rect x="10" y="140" width="50" height="50" fill="#111827" rx="6"></rect>
                    <rect x="20" y="150" width="30" height="30" fill="#ffffff" rx="2"></rect>
                    <rect x="27" y="157" width="16" height="16" fill="#047857" rx="2"></rect>

                    {/* Data Pattern Modules */}
                    {[
                      [70, 20, 15, 15], [95, 20, 15, 15], [120, 20, 10, 15],
                      [70, 45, 20, 15], [100, 45, 15, 20], [125, 45, 10, 15],
                      [20, 70, 15, 20], [45, 70, 15, 15], [70, 70, 20, 20],
                      [100, 70, 30, 20], [140, 70, 20, 15], [170, 70, 15, 20],
                      [20, 100, 20, 15], [50, 100, 15, 20], [75, 100, 20, 15],
                      [105, 100, 25, 25], [140, 100, 15, 15], [165, 100, 20, 20],
                      [70, 135, 15, 20], [95, 135, 20, 15], [125, 135, 15, 25],
                      [70, 165, 25, 15], [105, 165, 20, 20], [135, 165, 25, 15],
                      [170, 135, 15, 15], [170, 160, 15, 20]
                    ].map(([x, y, w, h], idx) => (
                      <rect key={idx} x={x} y={y} width={w} height={h} fill="#111827" rx="2"></rect>
                    ))}

                    {/* Center Brand Pill */}
                    <circle cx="100" cy="100" r="14" fill="#047857"></circle>
                    <text x="100" y="104" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">CR</text>
                  </svg>
                  <span className="font-mono text-[9px] text-gray-700 mt-2 font-semibold tracking-wider uppercase">
                    Scan for CIRPASS DPP Dossier
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs font-body-sm text-on-surface-variant">
                  <p>Encodes full material traceability, batch metallurgical heat logs, and verified emissions declaration.</p>
                  <span className="font-label-mono text-[10px] text-secondary font-bold">
                    Ready for EU Customs Port Inspection
                  </span>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-ui text-xs font-semibold transition-all shadow-sm"
                >
                  {copiedUrl ? "Link Copied to Clipboard!" : "Copy Verification URL"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMBEDDABLE CARBON TRUST BADGE WIDGET */}
        {activeTab === "badge" && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/10">
              <div>
                <h2 className="font-headline-sm text-base lg:text-lg font-semibold text-on-surface">
                  CarbonReady Verified Trust Badge System
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Embed tamper-evident carbon compliance trust badges on your commercial invoices, product catalogues, and European buyer presentations.
                </p>
              </div>

              {/* Tier Selector */}
              <div className="flex items-center gap-1 font-label-mono text-xs">
                <span className="text-on-surface-variant text-[11px] mr-1">Preview Tier:</span>
                {(["draft", "declared", "verified"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBadgeTier(t)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors ${
                      badgeTier === t
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Badge Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-center">
              {/* Badge Visual 1: Full Metric Card */}
              <div className="p-space-lg rounded-xl bg-surface-container border-2 border-primary/40 shadow-xl flex flex-col justify-between gap-space-md relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-on-primary font-label-mono text-[10px] font-bold rounded-bl-lg">
                  {badgeTier === "verified"
                    ? "INDEPENDENTLY VERIFIED"
                    : badgeTier === "declared"
                    ? "MANUFACTURER DECLARED"
                    : "DRAFT ESTIMATE"}
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <div>
                    <span className="font-label-mono text-[9px] uppercase tracking-widest text-primary font-bold">
                      CarbonReady Trust Shield
                    </span>
                    <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                      EU CBAM Compliant Steel
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-surface-container-lowest text-xs font-label-mono">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase">Specific Intensity</span>
                    <span className="text-primary font-bold text-base">{passportData.carbonIntensityTco2ePerMt.toFixed(2)} tCO2e/MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase">Recycled Content</span>
                    <span className="text-secondary font-bold text-base">{passportData.recycledContentPct}% Scrap</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-[10px] font-label-mono text-on-surface-variant">
                  <span>Installation: {passportData.installationId}</span>
                  <span className="text-primary font-semibold">EN 19694-2 Method C</span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-mono text-[11px] text-primary uppercase font-bold">
                  Embed Code Snippet (HTML / Markdown)
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Paste into your export paperwork, buyer portals, or website footer to provide one-click verifiable emissions authenticity:
                </p>
                <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 font-mono text-xs text-secondary overflow-x-auto">
                  <code>
                    {`<a href="https://verify.carbonready.org/passport/${passportData.urn}" target="_blank">\n`}
                    {`  <img src="https://badge.carbonready.org/steel/${passportData.carbonIntensityTco2ePerMt.toFixed(2)}-tco2e-${badgeTier}.svg" alt="CarbonReady Trust Badge" />\n`}
                    {`</a>`}
                  </code>
                </div>
                <span className="font-label-mono text-[10px] text-tertiary">
                  Notice: Badges update automatically when new quarterly audit hashes are sealed.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: ESPR DELEGATED ACTS TRACKER */}
        {activeTab === "espr_status" && (
          <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
              <span className="font-headline-sm text-base font-semibold text-on-surface">
                European Ecodesign (ESPR) Delegated Acts Progression for Steel
              </span>
              <span className="font-label-mono text-[10px] text-secondary">
                Official Source: DG GROW &amp; CIRPASS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-xs">
              <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10 flex flex-col justify-between gap-2">
                <div>
                  <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">
                    Status: Adopted
                  </span>
                  <h4 className="font-headline-sm text-sm font-semibold text-on-surface mt-1.5">
                    ESPR Framework Regulation (EU) 2024/1781
                  </h4>
                  <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Entered into force July 2024. Mandates Digital Product Passports for intermediate energy-intensive industrial products including iron and steel.
                  </p>
                </div>
                <span className="font-label-mono text-[10px] text-on-surface-variant">Effective: 2024-07-18</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10 flex flex-col justify-between gap-2">
                <div>
                  <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-bold uppercase">
                    Status: In Development
                  </span>
                  <h4 className="font-headline-sm text-sm font-semibold text-on-surface mt-1.5">
                    Iron &amp; Steel Priority Delegated Act
                  </h4>
                  <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    European Commission priority working group defining mandatory data attributes: recycled scrap origin, Scope 1-3 carbon footprint, and slag valorization.
                  </p>
                </div>
                <span className="font-label-mono text-[10px] text-on-surface-variant">Expected Target: 2026/2027</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container border border-outline-variant/10 flex flex-col justify-between gap-2">
                <div>
                  <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-bold uppercase">
                    Status: Architecture Ready
                  </span>
                  <h4 className="font-headline-sm text-sm font-semibold text-on-surface mt-1.5">
                    CarbonReady CIRPASS Interoperability
                  </h4>
                  <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    CarbonReady data structures follow the CIRPASS open JSON-LD schema, ensuring instant compliance when the delegated act is gazetted.
                  </p>
                </div>
                <span className="font-label-mono text-[10px] text-primary">CarbonReady v2.4 Certified</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

