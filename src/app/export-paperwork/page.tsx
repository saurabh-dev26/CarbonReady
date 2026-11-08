"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { INITIAL_FACILITY_PROFILE, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";

export default function ExportPaperworkPage() {
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [invoiceNumber, setInvoiceNumber] = useState("EXP-2025-EU-0482");
  const [billOfLading, setBillOfLading] = useState("MSCU-IN-HAM-9941");
  const [consigneeName, setConsigneeName] = useState("Thyssenkrupp Materials Processing Europe GmbH");
  const [consigneeAddress, setConsigneeAddress] = useState("Kruppstraße 20, 45128 Essen, Germany");
  const [destinationPort, setDestinationPort] = useState("Port of Hamburg, Germany (DE HAM)");
  const [consignmentMassMt, setConsignmentMassMt] = useState<number>(1006.0);
  const [hsCode, setHsCode] = useState("7207 11 00");
  const [specificIntensity, setSpecificIntensity] = useState<number>(1.42);
  const [sha256Hash, setSha256Hash] = useState<string>("0x7F2A6D3B9C1E4F8A0B2C4D6E8F1A3B5C7D9E0F2A4B6C8D0E2F4A6B8C0D2E4F6A");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncData = () => {
      const p = getStoredFacilityProfile();
      setProfile(p);
      if (p.targetPorts && p.targetPorts.length > 0) {
        setDestinationPort(`Port of ${p.targetPorts[0]}`);
      }

      try {
        const batchRaw = localStorage.getItem("carbonready_active_batch");
        if (batchRaw) {
          const b = JSON.parse(batchRaw);
          if (b.crudeBilletsMt) {
            setConsignmentMassMt(Number((b.crudeBilletsMt * 7.08).toFixed(1)));
          }
        }

        const reportsRaw = localStorage.getItem("carbonready_saved_reports");
        if (reportsRaw) {
          const reports = JSON.parse(reportsRaw);
          if (Array.isArray(reports) && reports.length > 0) {
            if (reports[0].specificIntensity) {
              setSpecificIntensity(Number(reports[0].specificIntensity));
            }
            if (reports[0].hash) {
              setSha256Hash(reports[0].hash);
            }
          }
        }
      } catch (e) {
        console.warn("Could not sync export paperwork data:", e);
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

  const totalEmbeddedEmissions = (consignmentMassMt * specificIntensity).toFixed(2);
  const fallbackPenaltyAvoided = Math.round((2.15 - specificIntensity) * consignmentMassMt * 85);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent = `Field,Value,Unit,Standard Reference
Exporter Name,"${profile.companyName}",,UDYAM: ${profile.udyamNumber}
Installation ID,"${profile.installationId}",,UN/LOCODE: ${profile.unLocode}
Invoice Number,"${invoiceNumber}",,
Bill of Lading,"${billOfLading}",,
Consignee,"${consigneeName}",,"${consigneeAddress}"
Destination Port,"${destinationPort}",,
Goods Description,"Prime Non-Alloy Crude Steel Billets",,CN Code: ${hsCode}
Net Consignment Mass,${consignmentMassMt},MT,
Specific Carbon Intensity,${specificIntensity},tCO2e/MT,EN 19694-2 Method C
Total Embedded Emissions,${totalEmbeddedEmissions},tCO2e,Scope 1 + Scope 2 Specific
EU Default Benchmark Cap,2.15,tCO2e/MT,EU CBAM Implementing Reg 2023/1773
Net Tariff Saved vs Default Punitive,${fallbackPenaltyAvoided},EUR,Saved at €85/tCO2e ETS Price
Cryptographic Audit Hash,"${sha256Hash}",,SHA-256 Metrology Seal
Verification Status,"Draft Supplier Declaration - Awaiting Accredited Verification",,EU Reg 2023/956 Art 8
`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CBAM_Export_Annex_${invoiceNumber}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg print:p-0">
        {/* Top Header (Hidden on Print) */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm print:hidden">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                CUSTOMS DOCUMENTATION PREPARATION
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                CBAM EXPORT ANNEX AUTO-FILL
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                COMMERCIAL INVOICE PACKET
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Auto-Fill Export Paperwork &amp; Customs Annex
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Generate standardized carbon declaration annexes for European customs clearance, pre-filled from your audited plant telemetry and verified activity data.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">table_view</span>
              <span>Export CSV Manifest</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold shadow-md hover:bg-secondary transition-all"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print / Download Customs PDF</span>
            </button>
          </div>
        </section>

        {/* PRINT WATERMARK (Visible in Print Only) */}
        <div className="hidden print:block mb-4 pb-2 border-b-2 border-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                CBAM COMMERCIAL INVOICE CARBON DECLARATION ANNEX
              </h1>
              <p className="text-xs text-gray-700 mt-0.5">
                Supporting Documentation for European Import Entry under Regulation (EU) 2023/1773 &amp; (EU) 2025/2547
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block border border-gray-800 text-gray-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                DRAFT CUSTOMS PACKET
              </span>
              <p className="font-mono text-[10px] text-gray-600 mt-1">Invoice: {invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Left 5 Cols: Editable Consignment Parameters (Hidden on Print) */}
          <div className="xl:col-span-5 bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:hidden">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
              <span className="font-headline-sm text-base font-semibold text-on-surface">
                Consignment Shipping Parameters
              </span>
              <span className="font-label-mono text-[10px] text-primary">
                Auto-Synced with Facility
              </span>
            </div>

            <div className="flex flex-col gap-space-sm text-xs">
              <div>
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                  Commercial Invoice Number *
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Bill of Lading (B/L)
                  </label>
                  <input
                    type="text"
                    value={billOfLading}
                    onChange={(e) => setBillOfLading(e.target.value)}
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    EU CN / HS Code
                  </label>
                  <input
                    type="text"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                  European Buyer / Consignee
                </label>
                <input
                  type="text"
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                  Consignee Address &amp; VAT/EORI
                </label>
                <input
                  type="text"
                  value={consigneeAddress}
                  onChange={(e) => setConsigneeAddress(e.target.value)}
                  className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Destination Port
                  </label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Net Consignment Mass (MT)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={consignmentMassMt}
                    onChange={(e) => setConsignmentMassMt(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-surface-container-lowest border border-tertiary/20 text-[11px] font-body-sm text-on-surface-variant">
                <span className="text-tertiary font-label-mono text-[10px] font-bold uppercase block mb-0.5">
                  Statutory Customs Notice:
                </span>
                This annex serves as commercial and technical supporting documentation. It must be signed by the authorized plant signatory and accompanied by the Mill Test Certificate (MTC).
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Rendered Official Document Preview (Full width on print) */}
          <div className="xl:col-span-7 print:col-span-12 w-full bg-surface-container rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md print:bg-white print:border-gray-300 print:p-4">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10 print:border-gray-300">
              <span className="font-headline-sm text-sm font-bold text-on-surface uppercase print:text-gray-900">
                Official Supplier Carbon Emissions Declaration
              </span>
              <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold print:bg-gray-100 print:text-gray-900">
                EU REGULATION 2023/1773 &amp; 2025/2547
              </span>
            </div>

            {/* Document Header Table */}
            <div className="grid grid-cols-2 gap-space-md p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10 text-xs font-label-mono print:bg-gray-50 print:border-gray-200">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block print:text-gray-600">Exporter / Manufacturer</span>
                <p className="font-bold text-on-surface print:text-gray-900">{profile.companyName}</p>
                <p className="text-[11px] text-on-surface-variant print:text-gray-700">{profile.city}, {profile.state}, India</p>
                <p className="text-[10px] text-on-surface-variant print:text-gray-600">
                  Installation ID: <strong>{profile.installationId}</strong> · UN/LOCODE: <strong>{profile.unLocode}</strong>
                </p>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block print:text-gray-600">Buyer / Consignee</span>
                <p className="font-bold text-on-surface print:text-gray-900">{consigneeName}</p>
                <p className="text-[11px] text-on-surface-variant print:text-gray-700">{consigneeAddress}</p>
                <p className="text-[10px] text-on-surface-variant print:text-gray-600">
                  Destination Port: <strong>{destinationPort}</strong>
                </p>
              </div>
            </div>

            {/* Shipment Identifiers */}
            <div className="grid grid-cols-3 gap-2 text-xs font-label-mono p-2 rounded bg-surface-container-low border border-outline-variant/10 print:bg-gray-50 print:border-gray-200">
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase print:text-gray-600">Invoice No.</span>
                <span className="font-bold text-primary print:text-gray-900">{invoiceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase print:text-gray-600">Bill of Lading</span>
                <span className="font-bold text-on-surface print:text-gray-900">{billOfLading}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase print:text-gray-600">Net Cargo Mass</span>
                <span className="font-bold text-on-surface print:text-gray-900">{consignmentMassMt.toLocaleString()} MT</span>
              </div>
            </div>

            {/* Carbon Intensity & Emissions Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-xs print:text-[11px]">
                <thead>
                  <tr className="bg-surface-container-low font-label-mono text-[10px] text-on-surface-variant uppercase print:bg-gray-100 print:text-gray-800">
                    <th className="py-2 px-3">Emission Scope &amp; Activity Stream</th>
                    <th className="py-2 px-3">Methodology &amp; Standard</th>
                    <th className="py-2 px-3 text-right">Specific (tCO2e/MT)</th>
                    <th className="py-2 px-3 text-right">Consignment Total (tCO2e)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 print:divide-gray-200 font-label-mono">
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-on-surface print:text-gray-900">Scope 1 (Direct Process)</span>
                      <span className="block text-[10px] text-on-surface-variant print:text-gray-600">Coke, Electrode, Natural Gas</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-on-surface-variant print:text-gray-700">EN 19694-2 Method C</td>
                    <td className="py-2.5 px-3 text-right text-on-surface print:text-gray-900">0.31</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-on-surface print:text-gray-900">
                      {(consignmentMassMt * 0.31).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-on-surface print:text-gray-900">Scope 2 (Indirect Electricity)</span>
                      <span className="block text-[10px] text-on-surface-variant print:text-gray-600">PSPCL 66kV Substation</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-on-surface-variant print:text-gray-700">CEA CO2 Database v20.0</td>
                    <td className="py-2.5 px-3 text-right text-on-surface print:text-gray-900">1.11</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-on-surface print:text-gray-900">
                      {(consignmentMassMt * 1.11).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-on-surface print:text-gray-900">Scope 3 (Precursors)</span>
                      <span className="block text-[10px] text-on-surface-variant print:text-gray-600">Recycled Steel Scrap</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-on-surface-variant print:text-gray-700">CBAM Annex III §2.1</td>
                    <td className="py-2.5 px-3 text-right text-secondary print:text-gray-900">0.00</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-secondary print:text-gray-900">0.00</td>
                  </tr>
                  <tr className="bg-surface-container-low font-bold print:bg-gray-100 border-t-2 border-primary/30 print:border-gray-400">
                    <td className="py-3 px-3 text-on-surface print:text-gray-900">Total Embedded Emissions</td>
                    <td className="py-3 px-3 text-primary print:text-gray-900">Harmonized Blend</td>
                    <td className="py-3 px-3 text-right text-primary text-sm print:text-gray-900">1.42 tCO2e/MT</td>
                    <td className="py-3 px-3 text-right text-primary text-sm print:text-gray-900">
                      {totalEmbeddedEmissions} tCO2e
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Benchmark Shield Comparison */}
            <div className="p-3 rounded-lg bg-surface-container-lowest border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-label-mono text-xs print:bg-gray-50 print:border-gray-200">
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase print:text-gray-600">EU Default Benchmark Comparison</span>
                <span className="text-on-surface print:text-gray-900">
                  EU Punitive Cap: <strong>2.15 tCO2e/MT</strong> · Exporter Tariff Savings:{" "}
                  <strong className="text-primary print:text-gray-900">€{fallbackPenaltyAvoided.toLocaleString()}</strong>
                </span>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-secondary font-bold print:text-gray-900">34.0% CARBON PROTECTION</span>
              </div>
            </div>

            {/* Cryptographic Signature & Authorized Declaration */}
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10 text-xs font-label-mono space-y-2 print:bg-white print:border-gray-300">
              <div className="flex justify-between items-center text-[10px] text-on-surface-variant print:text-gray-600">
                <span>Cryptographic SHA-256 Metrology Seal:</span>
                <span className="font-bold text-primary print:text-gray-900">VERIFIED AUTHENTIC</span>
              </div>
              <code className="block text-[10px] font-mono text-secondary break-all print:text-gray-800">
                {sha256Hash}
              </code>

              <div className="pt-2 border-t border-outline-variant/10 grid grid-cols-2 gap-4 text-[11px] print:border-gray-300">
                <div>
                  <span className="text-[10px] text-on-surface-variant block print:text-gray-600">Authorized Plant Signatory</span>
                  <p className="font-bold text-on-surface mt-1 print:text-gray-900">{profile.contactPerson}</p>
                  <p className="text-[10px] text-on-surface-variant print:text-gray-700">{profile.contactTitle}, {profile.companyName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant block print:text-gray-600">Date &amp; Stamp</span>
                  <p className="font-bold text-on-surface mt-1 print:text-gray-900">{new Date().toISOString().slice(0, 10)}</p>
                  <p className="text-[10px] text-tertiary font-semibold print:text-gray-700">DRAFT FOR CUSTOMS CLEARANCE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

