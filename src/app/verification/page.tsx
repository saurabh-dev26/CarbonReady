"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { INITIAL_FACILITY_PROFILE, getStoredFacilityProfile } from "@/lib/data/initial-plant-data";

interface AuditorProfile {
  id: string;
  name: string;
  globalBrand: string;
  countryPresence: string;
  accreditationNumber: string;
  accreditingBody: string;
  specializations: string[];
  estimatedTurnaroundDays: number;
  averageAuditFeeRangeInr: string;
  euEtsAccredited: boolean;
  sampleAuditorNotice: string;
}

const SAMPLE_AUDITORS: AuditorProfile[] = [
  {
    id: "AUD-01",
    name: "TÜV Rheinland India Pvt Ltd",
    globalBrand: "TÜV Rheinland Group",
    countryPresence: "Delhi NCR / Mumbai / Ludhiana Desk",
    accreditationNumber: "NABCB/GHG/012",
    accreditingBody: "NABCB (India) & DAkkS (Germany)",
    specializations: ["EU CBAM Iron & Steel (Annex III)", "ISO 14064-1 Organizational GHG", "BEE PAT M&V"],
    estimatedTurnaroundDays: 12,
    averageAuditFeeRangeInr: "₹1.8L - ₹2.5L",
    euEtsAccredited: true,
    sampleAuditorNotice: "DEMO AUDITOR PROFILE · Representative accredited certification body",
  },
  {
    id: "AUD-02",
    name: "DNV Business Assurance India",
    globalBrand: "DNV (Det Norske Veritas)",
    countryPresence: "Mumbai / Bengaluru / Punjab Cluster",
    accreditationNumber: "NABCB/GHG/004",
    accreditingBody: "NABCB (India) & RvA (Netherlands)",
    specializations: ["EU CBAM Third-Party Verification", "Supply Chain Precursor Auditing", "ISO 14065"],
    estimatedTurnaroundDays: 14,
    averageAuditFeeRangeInr: "₹2.0L - ₹2.8L",
    euEtsAccredited: true,
    sampleAuditorNotice: "DEMO AUDITOR PROFILE · Representative accredited certification body",
  },
  {
    id: "AUD-03",
    name: "Bureau Veritas India Sustainability Services",
    globalBrand: "Bureau Veritas",
    countryPresence: "Kolkata / Delhi / Mandi Gobindgarh Desk",
    accreditationNumber: "NABCB/GHG/018",
    accreditingBody: "NABCB (India) & COFRAC (France)",
    specializations: ["Secondary Metallurgy EAF Verification", "CIRPASS DPP Traceability", "ISO 50001 EnMS"],
    estimatedTurnaroundDays: 10,
    averageAuditFeeRangeInr: "₹1.5L - ₹2.2L",
    euEtsAccredited: true,
    sampleAuditorNotice: "DEMO AUDITOR PROFILE · Representative accredited certification body",
  },
];

interface VerificationRequest {
  id: string;
  auditorId: string;
  auditorName: string;
  facilityId: string;
  targetQuarter: string;
  dossierRef: string;
  sha256Hash: string;
  submissionDate: string;
  status: "Draft Request" | "Under Review" | "Inspection Scheduled" | "Attestation Issued";
  notes: string;
}

export default function VerificationMarketplacePage() {
  const [profile, setProfile] = useState(INITIAL_FACILITY_PROFILE);
  const [auditors] = useState<AuditorProfile[]>(SAMPLE_AUDITORS);
  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: "REQ-2025-0842",
      auditorId: "AUD-01",
      auditorName: "TÜV Rheinland India Pvt Ltd",
      facilityId: INITIAL_FACILITY_PROFILE.facilityId,
      targetQuarter: "Q1 2025 (Jan - Mar)",
      dossierRef: "CBAM-DOSSIER-APEX-Q1",
      sha256Hash: "0x7F2A...CB49",
      submissionDate: "2025-03-29",
      status: "Under Review",
      notes: "Pre-audit documentation packet delivered. Preliminary desk review underway.",
    },
  ]);

  const [selectedAuditor, setSelectedAuditor] = useState<AuditorProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestQuarter, setRequestQuarter] = useState("Q1 2025 (Transitional)");
  const [requestNotes, setRequestNotes] = useState("");
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncProfile = () => {
      setProfile(getStoredFacilityProfile());
    };
    syncProfile();
    window.addEventListener("carbonready_profile_updated", syncProfile);
    return () => window.removeEventListener("carbonready_profile_updated", syncProfile);
  }, []);

  const handleOpenRequest = (auditor: AuditorProfile) => {
    setSelectedAuditor(auditor);
    setIsModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditor) return;

    const newReq: VerificationRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      auditorId: selectedAuditor.id,
      auditorName: selectedAuditor.name,
      facilityId: profile.facilityId,
      targetQuarter: requestQuarter,
      dossierRef: `CBAM-DOSSIER-${profile.installationId}`,
      sha256Hash: "0x7F2A...CB49",
      submissionDate: new Date().toISOString().slice(0, 10),
      status: "Under Review",
      notes: requestNotes || "Dossier uploaded with SHA-256 seal. Awaiting auditor allocation.",
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setRequestNotes("");
    setActionSuccessNotice(`Formal verification request dispatched to ${selectedAuditor.name}. Reference ID: ${newReq.id}`);
    setTimeout(() => setActionSuccessNotice(null), 5000);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Top Header */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm">
          <div className="flex flex-col gap-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-mono text-[10px] text-primary px-space-xs py-0.5 rounded bg-surface-container-highest tracking-wider uppercase font-semibold">
                ACCREDITED VERIFICATION WORKFLOW
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-tertiary-fixed bg-tertiary-container/30 px-space-xs py-0.5 rounded">
                EU CBAM ARTICLE 8 COMPLIANT
              </span>
              <span className="font-label-mono text-on-surface-variant">·</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">
                ISO 14065 ACCREDITED BODIES
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight font-semibold">
              Verified-Human Sign-Off &amp; Auditor Marketplace
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Connect your internally generated Draft Supplier Emissions Report with accredited independent verification bodies under European Regulation (EU) 2023/956 Article 8.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/reports"
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-ui text-xs border border-outline-variant/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-primary">description</span>
              <span>Inspect Draft Dossier →</span>
            </Link>
          </div>
        </section>

        {/* Notice of Demonstration Scope */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-tertiary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary text-xl shrink-0">verified_user</span>
            <div>
              <p className="font-label-mono text-[10px] text-tertiary font-bold uppercase">
                Statutory Regulatory Honesty Notice
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Profiles below represent genuine, accredited international verification bodies operating in India. In this hackathon demonstration mode, requests initiate an internal compliance workflow rather than an automated commercial transaction.
              </p>
            </div>
          </div>
          <span className="font-label-mono text-[10px] text-tertiary px-space-sm py-1 rounded bg-tertiary-container/20 border border-tertiary/30 shrink-0">
            DEMO MARKETPLACE MODE
          </span>
        </div>

        {/* Success Banner */}
        {actionSuccessNotice && (
          <div className="p-space-sm rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between text-xs text-primary font-body-sm shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>{actionSuccessNotice}</span>
            </div>
            <button onClick={() => setActionSuccessNotice(null)} className="text-primary hover:text-on-surface">
              ✕
            </button>
          </div>
        )}

        {/* Active Verification Requests Tracker */}
        <section className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant/15 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
            <span className="font-headline-sm text-base font-semibold text-on-surface">
              Active Verification Requests ({requests.length})
            </span>
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              Facility: {INITIAL_FACILITY_PROFILE.installationId}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-xs">
              <thead>
                <tr className="bg-surface-container font-label-mono text-[10px] text-on-surface-variant uppercase">
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Accredited Body</th>
                  <th className="py-2.5 px-3">Reporting Period</th>
                  <th className="py-2.5 px-3">Sealed Dossier Hash</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/40">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-container-high/20 transition-colors">
                    <td className="py-3 px-3 font-label-mono font-bold text-primary">
                      {req.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-on-surface">
                      {req.auditorName}
                    </td>
                    <td className="py-3 px-3 font-label-mono text-on-surface-variant">
                      {req.targetQuarter}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-secondary">
                      {req.sha256Hash}
                    </td>
                    <td className="py-3 px-3 font-label-mono text-on-surface-variant">
                      {req.submissionDate}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-bold border border-tertiary/20">
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActionSuccessNotice(`Viewing audit trail for ${req.id}. Log notes: "${req.notes}"`)}
                        className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-mono text-[11px]"
                      >
                        Inspect Progress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Accredited Verification Body Directory */}
        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg text-on-surface font-semibold">
              Accredited Independent Verification Bodies (India Desk)
            </h2>
            <span className="font-label-mono text-xs text-on-surface-variant">
              ISO 14065 &amp; EU ETS Recognized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {auditors.map((auditor) => (
              <div
                key={auditor.id}
                className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/15 shadow-sm flex flex-col justify-between gap-space-md hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                      {auditor.accreditationNumber}
                    </span>
                    <span className="font-label-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 font-semibold">
                      EU ETS VERIFIER
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-base font-semibold text-on-surface mt-1">
                    {auditor.name}
                  </h3>
                  <p className="font-label-mono text-[11px] text-on-surface-variant">
                    {auditor.countryPresence} · {auditor.accreditingBody}
                  </p>

                  <div className="my-1 flex flex-wrap gap-1">
                    {auditor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="font-label-mono text-[9px] px-1.5 py-0.5 rounded bg-surface-container text-secondary"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2 rounded bg-surface-container text-xs font-label-mono mt-1">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase">Turnaround</span>
                      <span className="text-on-surface font-semibold">~{auditor.estimatedTurnaroundDays} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase">Fee Range</span>
                      <span className="text-primary font-semibold">{auditor.averageAuditFeeRangeInr}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 flex flex-col gap-2">
                  <span className="font-label-mono text-[9px] text-tertiary">
                    {auditor.sampleAuditorNotice}
                  </span>
                  <button
                    onClick={() => handleOpenRequest(auditor)}
                    className="w-full py-2 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-ui text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Request Formal Verification</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Request Modal */}
        {isModalOpen && selectedAuditor && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-space-lg w-full max-w-lg shadow-2xl flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/10">
                <div>
                  <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
                    Request Verification: {selectedAuditor.name}
                  </h3>
                  <span className="font-label-mono text-[10px] text-primary">
                    Accreditation: {selectedAuditor.accreditationNumber} ({selectedAuditor.accreditingBody})
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="flex flex-col gap-space-sm text-xs">
                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Reporting Quarter to Verify *
                  </label>
                  <select
                    value={requestQuarter}
                    onChange={(e) => setRequestQuarter(e.target.value)}
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Q1 2025 (Transitional)">Q1 2025 (Transitional Period)</option>
                    <option value="Q4 2024 (Historical)">Q4 2024 (Historical)</option>
                    <option value="Q2 2025 (Upcoming)">Q2 2025 (Upcoming Submission)</option>
                  </select>
                </div>

                <div className="p-3 rounded bg-surface-container text-xs font-label-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Facility ID:</span>
                    <span className="text-on-surface font-semibold">{profile.facilityId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Dossier Package:</span>
                    <span className="text-primary font-semibold">CBAM XML v2.4 + Annex III Data</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Cryptographic Hash:</span>
                    <span className="text-secondary font-mono text-[11px]">0x7F2A...CB49 (Sealed)</span>
                  </div>
                </div>

                <div>
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase block mb-1">
                    Specific Plant Scope Notes or Sensor Logs
                  </label>
                  <textarea
                    rows={3}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Include 11kV substation incoming utility meter calibration certificates and scrap weighbridge slips."
                    className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary font-body-sm"
                  ></textarea>
                </div>

                <p className="text-[11px] font-body-sm text-on-surface-variant">
                  Submission will create a traceable audit request record and generate the verifier pre-audit inspection packet.
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
                    Dispatch Verification Request
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

