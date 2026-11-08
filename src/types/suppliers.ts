export type MaterialCategory =
  | "recycled_scrap"
  | "sponge_iron_dri"
  | "ferro_alloys"
  | "petroleum_coke"
  | "graphite_electrodes";

export type VerificationState =
  | "verified_declaration"
  | "provisional_estimate"
  | "missing_documentation";

export interface SupplierRecord {
  id: string;
  name: string;
  location: string;
  materialSupplied: string;
  category: MaterialCategory;
  quarterlySupplyMt: number;
  reportedSpecificIntensityTco2ePerMt: number | null;
  verificationStatus: VerificationState;
  hasCbamDossier: boolean;
  certificateRef?: string;
  lastUpdated: string;
  potentialDecarbAction?: string;
  isDemoEntry: boolean;
}

export const INITIAL_SUPPLIERS_DATA: SupplierRecord[] = [
  {
    id: "SUP-01",
    name: "Northern Scrap Aggregators Pvt Ltd",
    location: "Mandi Gobindgarh, Punjab",
    materialSupplied: "Heavy Melting Scrap (HMS 1&2)",
    category: "recycled_scrap",
    quarterlySupplyMt: 1026.6,
    reportedSpecificIntensityTco2ePerMt: 0.0,
    verificationStatus: "verified_declaration",
    hasCbamDossier: true,
    certificateRef: "CERT-HMS-2025-019",
    lastUpdated: "2025-03-25",
    potentialDecarbAction: "Pre-sorted clean shred scrap increases metallic yield by 1.8%.",
    isDemoEntry: true,
  },
  {
    id: "SUP-02",
    name: "Raigarh Sponge & Iron Ltd",
    location: "Raigarh, Chhattisgarh",
    materialSupplied: "Coal-Based Direct Reduced Iron (DRI)",
    category: "sponge_iron_dri",
    quarterlySupplyMt: 85.0,
    reportedSpecificIntensityTco2ePerMt: 1.68,
    verificationStatus: "missing_documentation",
    hasCbamDossier: false,
    lastUpdated: "2025-02-14",
    potentialDecarbAction: "Transition to gas-based DRI vendor (Jindal/Essar) saves ~0.83 tCO2e/MT of DRI.",
    isDemoEntry: true,
  },
  {
    id: "SUP-03",
    name: "Bharat Electro-Carbons Ltd",
    location: "Barauni, Bihar",
    materialSupplied: "Calcined Petroleum Coke (CPC)",
    category: "petroleum_coke",
    quarterlySupplyMt: 22.6,
    reportedSpecificIntensityTco2ePerMt: 3.15,
    verificationStatus: "provisional_estimate",
    hasCbamDossier: true,
    certificateRef: "CPC-BATCH-8441",
    lastUpdated: "2025-03-01",
    potentialDecarbAction: "Optimizing foaming slag timing reduces recarburizer consumption by 8%.",
    isDemoEntry: true,
  },
  {
    id: "SUP-04",
    name: "Graphite Electrodes India Ltd",
    location: "Mandideep, Madhya Pradesh",
    materialSupplied: "Ultra High Power (UHP) Graphite Electrodes",
    category: "graphite_electrodes",
    quarterlySupplyMt: 2.9,
    reportedSpecificIntensityTco2ePerMt: 3.66,
    verificationStatus: "verified_declaration",
    hasCbamDossier: true,
    certificateRef: "ISO-14064-GEI-2024",
    lastUpdated: "2025-03-18",
    potentialDecarbAction: "Advanced electrode regulation system cuts specific consumption to 1.7 kg/MT.",
    isDemoEntry: true,
  },
];

