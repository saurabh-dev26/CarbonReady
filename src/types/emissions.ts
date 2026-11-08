export interface EmissionFactorMetadata {
  id: string;
  name: string;
  factorValue: number;
  unit: string;
  source: string;
  sourceReference: string;
  publicationDate: string;
  geographicApplicability: string;
  sectorAndProcess: string;
  calculationBoundary: string;
  verificationStatus: "Verified" | "Provisional" | "Demo Data";
}

export interface ActivityEmissionBreakdown {
  streamName: string;
  activityDescription: string;
  scope: "Scope 1" | "Scope 2" | "Scope 3";
  throughputValue: number;
  throughputUnit: string;
  factorValue: number;
  factorUnit: string;
  factorSource: string;
  emissionsTco2e: number;
  percentageOfTotal: number;
}

export interface CbamCalculationResult {
  scope1DirectTco2e: number;
  scope2IndirectTco2e: number;
  scope3PrecursorTco2e: number;
  totalGrossEmissionsTco2e: number;
  crudeSteelProducedMt: number;
  specificEmissionsIntensityTco2ePerMt: number;
  euBenchmarkCapTco2ePerMt: number; // 2.15 tCO2e/MT (EU default benchmark cap)
  intensityDeltaVsBenchmark: number; // e.g. -0.73
  protectionPercentage: number; // 34.0%
  cbamDefaultPenaltyTariffEur: number; // €284,100
  auditedExposureEur: number; // €141,600
  netTariffSavedEur: number; // €142,500
  breakdowns: ActivityEmissionBreakdown[];
  auditHashSha256: string;
  generatedAt: string;
  completenessScorePct: number;
  missingDataItems: string[];
}

