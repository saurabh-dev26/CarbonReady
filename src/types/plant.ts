export type MetallurgicalRoute = "EAF" | "INDUCTION" | "BF_BOF";

export interface FacilityProfile {
  companyName: string;
  facilityName: string;
  facilityId: string; // e.g. "IND-PB-7749"
  installationId: string; // e.g. "IN-MSME-PB-0442"
  unLocode: string; // "IN LUH"
  state: string; // "Punjab"
  city: string; // "Ludhiana"
  subSector: string; // "Iron & Steel (Integrated Mini-Mill)"
  annualCapacityMt: number; // 65000
  route: MetallurgicalRoute;
  udyamNumber: string; // "UDYAM-PB-12-004921"
  gstin: string; // "03AABCA1234D1Z5"
  cnSeries: string; // "7200 Series"
  targetPorts: string[]; // ["HAMBURG", "GENOVA", "ANTWERP"]
  contactPerson: string; // "Rajesh Sharma"
  contactTitle: string; // "Managing Director"
}

export interface ActivityBatchLog {
  id: string;
  batchTimestamp: string;
  heatsCount: number;
  crudeBilletsMt: number;
  scrapMt: number;
  spongeIronDriMt: number;
  electricityKwh: number;
  gridProvider: string; // "Punjab PSPCL"
  gridFactorKgPerKwh: number; // 0.713 kgCO2/kWh (CEA Grid factor)
  cokeMt: number;
  graphiteElectrodeKgPerMt: number; // 21.0 kg/MT
  reheatNaturalGasNm3: number; // 420.0 Nm3/hr
  reheatHours: number;
  inputSource: "voice" | "manual" | "iot";
  rawSpokenText?: string;
  translatedText?: string;
  confidenceScore?: number;
}

