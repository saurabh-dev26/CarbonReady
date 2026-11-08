"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { INITIAL_SUPPLIERS_DATA, SupplierRecord, MaterialCategory } from "@/types/suppliers";

export default function SupplierChainNudgePage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS_DATA);
  const [activeCategory, setActiveCategory] = useState<"all" | MaterialCategory>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nudgeNotice, setNudgeNotice] = useState<string | null>(null);

  // New Supplier Form State
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [newCategory, setNewCategory] = useState<MaterialCategory>("recycled_scrap");
  const [newTonnage, setNewTonnage] = useState<number>(100);
  const [newIntensity, setNewIntensity] = useState<string>("");

  const filteredSuppliers = suppliers.filter((s) => {
    if (activeCategory === "all") return true;
    return s.category === activeCategory;
  });

  const totalTonnage = suppliers.reduce((acc, s) => acc + s.quarterlySupplyMt, 0);
  const verifiedTonnage = suppliers
    .filter((s) => s.verificationStatus === "verified_declaration")
    .reduce((acc, s) => acc + s.quarterlySupplyMt, 0);
  const verifiedPct = totalTonnage > 0 ? ((verifiedTonnage / totalTonnage) * 100).toFixed(1) : "0.0";
  const missingDocCount = suppliers.filter((s) => s.verificationStatus === "missing_documentation").length;

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newEntry: SupplierRecord = {
      id: `SUP-${Date.now().toString().slice(-2)}`,
      name: newName,
      location: newLocation || "Industrial Cluster, India",
      materialSupplied: newMaterial || "Raw Materials",
      category: newCategory,
      quarterlySupplyMt: Number(newTonnage) || 50,
      reportedSpecificIntensityTco2ePerMt: newIntensity ? Number(newIntensity) : null,
      verificationStatus: newIntensity ? "provisional_estimate" : "missing_documentation",
      hasCbamDossier: false,
      lastUpdated: new Date().toISOString().slice(0, 10),
      potentialDecarbAction: "Request formal ISO 14064 or CBAM declaration from vendor.",
      isDemoEntry: false,
    };

    setSuppliers([newEntry, ...suppliers]);
    setIsModalOpen(false);
    setNewName("");
    setNewLocation("");
    setNewMaterial("");
    setNewIntensity("");
    setNudgeNotice(`Added "${newEntry.name}" to upstream supply ledger.`);
    setTimeout(() => setNudgeNotice(null), 4000);
  };

  const handleTriggerNudge = (supplier: SupplierRecord) => {
    setNudgeNotice(`Dispatched CBAM Annex III supplier documentation request template to ${supplier.name}.`);
    setTimeout(() => setNudgeNotice(null), 4500);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                SCOPE 3 UPSTREAM METROLOGY
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                CBAM ANNEX III PRECURSOR MAPPING
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                SUPPLIER EMISSIONS AUDIT
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Supplier Chain Nudge &amp; Precursor Intelligence
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Analyze upstream raw-material carbon footprints, flag missing supplier documentation, and nudge vendors toward certified low-carbon declarations.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-ui text-xs font-semibold shadow-md hover:bg-secondary transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Add Upstream Supplier</span>
            </button>
          </div>
        </section>

        {/* Nudge Notification Banner */}
        {nudgeNotice && (
          <div className="p-space-sm rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between text-xs text-primary font-body-sm shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">outgoing_mail</span>
              <span>{nudgeNotice}</span>
            </div>
            <button onClick={() => setNudgeNotice(null)} className="text-primary hover:text-on-surface">
              ✕
            </button>
          </div>
        )}

        {/* 4 Summary Metric Tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1: Total Upstream Tonnage */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Tracked Precursors
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-on-surface font-bold">
                {totalTonnage.toLocaleString(undefined, { maximumFractionDigits: 1 })}{" "}
              </span>
              <span className="font-label-mono text-xs text-on-surface-variant">MT / Qtr</span>
            </div>
            <span className="font-label-mono text-[10px] text-secondary">
              {suppliers.length} Active Material Streams
            </span>
          </div>

          {/* Card 2: Verified Share */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Verified Documentation Share
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-primary font-bold">
                {verifiedPct}%
              </span>
              <span className="font-label-mono text-xs text-on-surface-variant ml-1">by Volume</span>
            </div>
            <span className="font-label-mono text-[10px] text-primary">
              Recycled scrap zero-rating compliant
            </span>
          </div>

          {/* Card 3: Missing Docs Risk */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Documentation Gaps
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-tertiary-fixed font-bold">
                {missingDocCount}
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant">Supplier Pending</span>
            </div>
            <span className="font-label-mono text-[10px] text-tertiary">
              Requires Annex III Supplier Certificate
            </span>
          </div>

          {/* Card 4: Potential Abatement */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15 flex flex-col justify-between shadow-sm">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Upstream Abatement Potential
            </span>
            <div className="my-1">
              <span className="font-metric-xl text-2xl lg:text-3xl text-secondary font-bold">
                -70.5 tCO2e
              </span>
            </div>
            <span className="font-label-mono text-[10px] text-on-surface-variant">
              Via gas-based DRI &amp; clean scrap yield
            </span>
          </div>
        </section>

        {/* Lower-Carbon Procurement Nudge Banner */}
        <section className="p-space-md rounded-xl bg-surface-container-low border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">recommend</span>
            </div>
            <div>
              <p className="font-label-mono text-[10px] text-primary uppercase font-bold">
                High-Impact Procurement Nudge
              </p>
              <p className="font-body-sm text-xs text-on-surface mt-0.5">
                Coal-based Sponge Iron from Raigarh carries <strong>1.68 tCO2e/MT</strong>. Shifting 50% of DRI supply to certified gas-based DRI (Jindal/Essar) compresses plant specific intensity by <strong>0.07 tCO2e/MT</strong>, protecting an additional <strong>€6,000</strong> in EU CBAM tariffs per quarter.
              </p>
            </div>
          </div>
          <Link
            href="/planner"
            className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-xs whitespace-nowrap border border-primary/20 transition-colors shrink-0"
          >
            Simulate in What-If Engine →
          </Link>
        </section>

        {/* Filter Controls */}
        <section className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-space-xs overflow-x-auto">
            {[
              { id: "all", label: `All Materials (${suppliers.length})` },
              { id: "recycled_scrap", label: "Recycled Scrap" },
              { id: "sponge_iron_dri", label: "Sponge Iron / DRI" },
              { id: "petroleum_coke", label: "Petroleum Coke" },
              { id: "graphite_electrodes", label: "Electrodes" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveCategory(btn.id as any)}
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

          <span className="font-label-mono text-[10px] text-on-surface-variant hidden sm:inline">
            DEMO DATA · ISO 14064-1 UPSTREAM BOUNDARY
          </span>
        </section>

        {/* Suppliers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between gap-space-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                        {sup.id}
                      </span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant">
                        {sup.location}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-base font-semibold text-on-surface mt-1">
                      {sup.name}
                    </h2>
                    <p className="font-body-sm text-xs text-secondary font-medium">
                      {sup.materialSupplied}
                    </p>
                  </div>

                  {/* Verification Status Badge */}
                  <span
                    className={`font-label-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                      sup.verificationStatus === "verified_declaration"
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : sup.verificationStatus === "provisional_estimate"
                        ? "bg-surface-container-highest text-secondary border border-secondary/20"
                        : "bg-tertiary-container/30 text-tertiary-fixed border border-tertiary/30"
                    }`}
                  >
                    {sup.verificationStatus === "verified_declaration"
                      ? "VERIFIED DECLARATION"
                      : sup.verificationStatus === "provisional_estimate"
                      ? "PROVISIONAL ESTIMATE"
                      : "MISSING CERTIFICATE"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-surface-container text-xs font-label-mono">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase">Quarterly Supply</span>
                    <span className="text-on-surface font-semibold">
                      {sup.quarterlySupplyMt.toLocaleString()} MT
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block uppercase">Reported Intensity</span>
                    <span className={sup.reportedSpecificIntensityTco2ePerMt === null ? "text-error font-bold" : "text-primary font-semibold"}>
                      {sup.reportedSpecificIntensityTco2ePerMt !== null
                        ? `${sup.reportedSpecificIntensityTco2ePerMt} tCO2e/MT`
                        : "Unsubstantiated"}
                    </span>
                  </div>
                </div>

                {sup.certificateRef && (
                  <div className="flex items-center gap-1.5 text-[11px] font-label-mono text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs text-primary">verified</span>
                    <span>Certificate Ref: <strong className="text-on-surface">{sup.certificateRef}</strong></span>
                  </div>
                )}

                {sup.potentialDecarbAction && (
                  <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10 text-[11px] font-body-sm text-on-surface-variant">
                    <strong className="text-primary font-label-mono text-[10px] uppercase block">Decarbonization Nudge:</strong>
                    {sup.potentialDecarbAction}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between gap-2">
                <span className="font-label-mono text-[10px] text-on-surface-variant">
                  Updated: {sup.lastUpdated}
                </span>
                <button
                  onClick={() => handleTriggerNudge(sup)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-xs border border-primary/20 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">send</span>
                  <span>Request CBAM Form</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Add Supplier Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-space-lg w-full max-w-lg shadow-2xl flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
                  Add Upstream Precursor Supplier
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="flex flex-col gap-space-sm text-xs">
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jindal Steel Sponge Division"
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Location / Industrial Cluster
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Mandi Gobindgarh, Punjab"
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Material Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as MaterialCategory)}
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="recycled_scrap">Recycled Scrap</option>
                      <option value="sponge_iron_dri">Sponge Iron / DRI</option>
                      <option value="petroleum_coke">Petroleum Coke</option>
                      <option value="graphite_electrodes">Graphite Electrodes</option>
                      <option value="ferro_alloys">Ferroalloys</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Specific Material Name
                  </label>
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="e.g. Heavy Melting Scrap HMS-1"
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Quarterly Supply (MT)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newTonnage}
                      onChange={(e) => setNewTonnage(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                      Reported Intensity (tCO2e/MT)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newIntensity}
                      onChange={(e) => setNewIntensity(e.target.value)}
                      placeholder="Leave blank if unknown"
                      className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <p className="text-[11px] font-body-sm text-on-surface-variant pt-1">
                  Note: Values left blank will be flagged as <em>Missing Documentation</em> to prompt formal supplier declaration requests.
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
                    Save Supplier Record
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

