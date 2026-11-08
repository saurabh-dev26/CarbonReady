import { GovernmentScheme, DecarbonizationLever } from "@/types/schemes";

export const GOVERNMENT_SCHEMES_DATA: GovernmentScheme[] = [
  {
    id: "scheme-01",
    code: "SIDBI-MSE-GIFT",
    title: "SIDBI MSE-GIFT",
    fullName: "Green Investment and Financing for Transformation (GIFT)",
    issuingAuthority: "Small Industries Development Bank of India (SIDBI) & Ministry of MSME",
    portalUrl: "https://sidbi.in",
    referenceNumber: "SIDBI-GIFT-2024-PB",
    categories: ["capital", "interest"],
    statusVariant: "historical",
    statusLabel: "Historical Provision · Requires Availability Confirmation",
    subsidyHeadline: "Up to 2% (200 bps)",
    subsidySubtext: "Subject to Extension Confirmation with SIDBI/Lender",
    historicalNotice:
      "Published sanction window ended 31 March 2026. Verify current availability or any extension with SIDBI or the participating financial institution before treating as active capital.",
    statutoryNotice:
      "Historical Provision: Up to 2% annual interest subvention (200 bps) on eligible green term loans under SIDBI concessional financing framework. Zero automated disbursement guarantee.",
    plantMatchReason:
      "Planned ₹42 Lakh Waste Heat Recovery Boiler (WHRB) for billet reheating furnace meets eligible green equipment guidelines with an estimated 18% thermal efficiency gain.",
    eligibilityCriteria: [
      "Registered MSME (Udyam: UDYAM-PB-12-004921)",
      "Investment in certified BEE Schedule equipment",
      "Clean banking record / CIBIL Commercial > 720",
    ],
    pendingGates:
      "Energy audit sign-off by BEE Certified Energy Auditor scheduled for Q2 2025. Pre-audit heat balance logs generated.",
    docsIndexedCount: 4,
    docsTotalCount: 4,
    ingestedDocs: [
      { name: "Udyam Registration Certificate", status: "valid" },
      { name: "3-Yr Audited Financials", status: "valid" },
      { name: "PSPCL 66kV Sanction Letter", status: "valid" },
      { name: "Historical Provision Notice", status: "historical" },
    ],
    lastVerifiedDate: "2026-03-31",
    isSanctionGuaranteed: false,
  },
  {
    id: "scheme-02",
    code: "MSME-ZED",
    title: "MSME ZED",
    fullName: "MSME Sustainable (ZED) Certification Scheme",
    issuingAuthority: "Ministry of Micro, Small and Medium Enterprises (MoMSME) / QCI",
    portalUrl: "https://zed.msme.gov.in/subsidy-on-cost-of-certification",
    referenceNumber: "MoMSME-ZED-CERT-2024",
    categories: ["tech", "capital"],
    statusVariant: "potential",
    statusLabel: "Potential Match · Eligibility to be Confirmed",
    subsidyHeadline: "50% – 80% Subsidy",
    subsidySubtext: "Up to 100% for Women MSMEs (Certification Cost Only)",
    statutoryNotice:
      "Statutory subsidies apply strictly to assessment and certification costs (Bronze, Silver, Gold), distinct from separate standalone technology-upgradation assistance: Micro 80%, Small 60%, Medium 50%, Women-owned up to 100%.",
    plantMatchReason:
      "Classified as Small/Medium Enterprise under Ludhiana plant turnover. EAF mini-mill scrap sorting and water management qualify towards Gold/Platinum certification benchmark requirements.",
    eligibilityCriteria: [
      "Manufacturing MSME with active Udyam registration",
      "Valid Punjab Pollution Control Board (PPCB) Consent to Operate (CTO)",
      "Undertaking ZED pledge on official MoMSME portal",
    ],
    pendingGates:
      "Geo-tagged water recycling metering documentation & hazardous waste manifest copies (Schedule II) awaiting physical plant sign-off.",
    docsIndexedCount: 2,
    docsTotalCount: 3,
    ingestedDocs: [
      { name: "PPCB CTO Renewal (Valid till 2026)", status: "valid" },
      { name: "ISO 14001:2015 Audit Certificate", status: "valid" },
      { name: "Factory Electrical Load Inspection (Overdue)", status: "pending" },
    ],
    lastVerifiedDate: "2025-01-15",
    isSanctionGuaranteed: false,
  },
  {
    id: "scheme-03",
    code: "RAMP-BEE-PAT",
    title: "RAMP & BEE PAT",
    fullName: "RAMP & BEE PAT Scheme Synergies (Perform, Achieve and Trade)",
    issuingAuthority: "World Bank & Ministry of MSME / Bureau of Energy Efficiency (BEE)",
    portalUrl: "https://beeindia.gov.in",
    referenceNumber: "RAMP-BEE-PAT-2024",
    categories: ["tech", "interest"],
    statusVariant: "doc_required",
    statusLabel: "Documentation Required · Audit Gate",
    subsidyHeadline: "ESCerts Trading & Tech Grants",
    subsidySubtext: "Energy Savings Certificates under SEC compliance",
    statutoryNotice:
      "Requires baseline specific energy consumption (SEC) audit by an accredited BEE Energy Auditor. Tradable ESCerts are issued solely upon verified reduction exceeding the designated target.",
    plantMatchReason:
      "Specific energy consumption of 593 kWh/MT crude steel is within 4% of BEE PAT cluster benchmark; oxygen injection and WHRB upgrade can generate surplus ESCerts.",
    eligibilityCriteria: [
      "MSME steel melting unit with annual connected load > 3 MVA",
      "Operational sub-metering on primary furnace and reheating units",
      "Submission of Form 1 annual energy return to State Designated Agency (PEDA)",
    ],
    pendingGates:
      "Comprehensive investment grade energy audit (IGEA) report by BEE accredited firm required before grant submission.",
    docsIndexedCount: 1,
    docsTotalCount: 3,
    ingestedDocs: [
      { name: "Monthly PSPCL Sub-meter Billing Logs", status: "valid" },
      { name: "Furnace Refractory Lining Log", status: "pending" },
      { name: "IGEA Energy Audit Report", status: "pending" },
    ],
    lastVerifiedDate: "2025-02-01",
    isSanctionGuaranteed: false,
  },
];

export const DECARBONIZATION_LEVERS_DATA: DecarbonizationLever[] = [
  {
    id: "lever-whrb",
    name: "Waste Heat Recovery Boiler (WHRB) on Reheat Battery",
    description: "Install recuperator and heat recovery steam generator on billet reheating furnace flue gases.",
    baselineState: "420 Nm³/hr natural gas flue exhaust vented at 680°C without heat capture.",
    optimizedState: "Recuperative combustion air preheating to 350°C reducing fuel gas draw to 345 Nm³/hr.",
    estimatedInvestmentInrLakhs: 42.0,
    potentialEnergySavingsPct: 17.8,
    potentialEmissionsReductionTco2eYr: 198.4,
    estimatedPaybackPeriodYears: 2.1,
    assumptions: [
      "Natural gas tariff at ₹48 / SCM delivered",
      "300 operational days / year with 16 hours daily rolling",
      "Recuperator thermal efficiency: 62%",
    ],
    calculationMethod: "Q_saved = V_gas_saved × NCV × EF_gas = 75 Nm³/hr × 0.0000385 TJ/Nm³ × 56.10 tCO2/TJ × 4800 hrs",
  },
  {
    id: "lever-solar-ppa",
    name: "Open Access 40% Solar PPA Procurement",
    description: "Contract 2.5 MW captive group solar under Punjab State Electricity Regulatory Commission (PSERC) open access regulations.",
    baselineState: "100% PSPCL state grid power at 0.713 kgCO2/kWh tariff.",
    optimizedState: "40% blend of dedicated solar power at zero direct Scope 2 emission factor.",
    estimatedInvestmentInrLakhs: 18.5,
    potentialEnergySavingsPct: 40.0,
    potentialEmissionsReductionTco2eYr: 446.5,
    estimatedPaybackPeriodYears: 1.4,
    assumptions: [
      "Solar PPA tariff at ₹3.80 / kWh vs PSPCL industrial tariff at ₹7.20 / kWh",
      "Cross-subsidy surcharge (CSS) and wheeling charges included as per PSERC FY25 schedule",
      "Scope 2 emissions zero-rated for certified solar component under market-based GHG accounting",
    ],
    calculationMethod: "E_saved = Total kWh × 40% × 0.713 kgCO2/kWh / 1000",
  },
  {
    id: "lever-scrap-blend",
    name: "High-Circularity Heavy Melting Scrap (HMS 1/2) Sorting & Preheating",
    description: "Upgrade scrap processing with hydraulic shredder, magnetic separation, and oxy-gas burner preheating.",
    baselineState: "85% scrap : 15% sponge iron ratio, charged cold.",
    optimizedState: "92% scrap : 8% sponge iron ratio, scrap preheated to 280°C with off-gas.",
    estimatedInvestmentInrLakhs: 28.0,
    potentialEnergySavingsPct: 8.5,
    potentialEmissionsReductionTco2eYr: 154.2,
    estimatedPaybackPeriodYears: 1.9,
    assumptions: [
      "Every 1% increase in clean scrap displaces ~0.015 tCO2e of DRI precursor emissions",
      "Tap-to-tap time reduced by 6 minutes per heat",
      "Electrical energy savings of 22 kWh / MT liquid steel from scrap preheating",
    ],
    calculationMethod: "ΔE = (DRI_reduced × EF_dri) + (Billets_produced × 22 kWh/MT × EF_grid)",
  },
];

