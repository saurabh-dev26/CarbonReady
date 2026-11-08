export type SchemeCategory = "capital" | "interest" | "tech";
export type SchemeStatusVariant = "potential" | "under_review" | "doc_required" | "historical";

export interface GovernmentScheme {
  id: string;
  code: string; // "SIDBI-MSE-GIFT" | "MSME-ZED" | "RAMP-BEE-PAT"
  title: string;
  fullName: string;
  issuingAuthority: string;
  portalUrl: string;
  referenceNumber: string;
  categories: SchemeCategory[];
  statusVariant: SchemeStatusVariant;
  statusLabel: string;
  subsidyHeadline: string;
  subsidySubtext: string;
  statutoryNotice?: string;
  historicalNotice?: string;
  plantMatchReason: string;
  eligibilityCriteria: string[];
  pendingGates: string;
  docsIndexedCount: number;
  docsTotalCount: number;
  ingestedDocs: Array<{ name: string; status: "valid" | "pending" | "historical" }>;
  lastVerifiedDate: string;
  isSanctionGuaranteed: false; // Mandatory regulatory honesty guarantee
}

export interface DecarbonizationLever {
  id: string;
  name: string;
  description: string;
  baselineState: string;
  optimizedState: string;
  estimatedInvestmentInrLakhs: number;
  potentialEnergySavingsPct: number;
  potentialEmissionsReductionTco2eYr: number;
  estimatedPaybackPeriodYears: number;
  assumptions: string[];
  calculationMethod: string;
}

