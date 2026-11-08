import { EmissionFactorMetadata } from "@/types/emissions";

/**
 * Authoritative Emission Factor Registry
 * Strictly compliant with:
 * 1. European Commission CBAM Implementing Regulation (EU) 2023/1773 & 2025/2547
 * 2. EN 19694-2 Method C (Electric Arc Furnace mass balance)
 * 3. 2006 IPCC Guidelines for National Greenhouse Gas Inventories (Volume 3: Industrial Processes)
 * 4. India Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector (Version 20.0)
 * 5. Ministry of Petroleum and Natural Gas (MoPNG) / BEE Energy Audit Tables
 */

export const AUTHORITATIVE_EMISSION_FACTORS: Record<string, EmissionFactorMetadata> = {
  GRAPHITE_ELECTRODES: {
    id: "EF-STEEL-GRAPHITE-01",
    name: "Graphite Electrode Oxidation Factor",
    factorValue: 3.60, // 3.60 kg CO2 / kg graphite consumed (Pure carbon stoichiometric oxidation: 44/12 * 98.2% pure carbon)
    unit: "kgCO2 / kg graphite",
    source: "IPCC 2006 Guidelines, Vol 3, Ch 4 (Metal Industry Emissions)",
    sourceReference: "Table 4.1 Tier 1/2 EAF Electrode Consumption default factor",
    publicationDate: "2006 (Revalidated 2019 Refinement)",
    geographicApplicability: "Global Default / EU CBAM Approved Alternative",
    sectorAndProcess: "Iron & Steel — Electric Arc Furnace (EAF) Melting",
    calculationBoundary: "Scope 1 Direct Oxidation at Furnace Roof/Bath",
    verificationStatus: "Verified",
  },

  NATURAL_GAS_REHEAT: {
    id: "EF-STEEL-NATGAS-01",
    name: "Natural Gas Combustion (Thermal Reheat Battery)",
    factorValue: 56.10, // 56.10 tCO2 / TJ Net Calorific Value
    unit: "tCO2 / TJ",
    source: "Ministry of Petroleum & Natural Gas (MoPNG) / IPCC 2006 Energy",
    sourceReference: "MoPNG Domestic Gas Allocation Guidelines; IPCC 2006 Vol 2 Energy Table 1.4",
    publicationDate: "2024 Gazette Update",
    geographicApplicability: "India Domestic Pipeline Natural Gas (Ludhiana City Gas Grid)",
    sectorAndProcess: "Continuous Billet Reheating Furnace (Tunnel Thermal Soak)",
    calculationBoundary: "Scope 1 Direct Stationary Combustion",
    verificationStatus: "Verified",
  },

  METALLURGICAL_COKE: {
    id: "EF-STEEL-METCOKE-01",
    name: "Metallurgical Coke Slag Foaming & Carburization",
    factorValue: 3.245, // 3.245 tCO2 / MT coke (based on 88.5% fixed carbon fraction * 44/12)
    unit: "tCO2 / MT coke",
    source: "Stoichiometric Mass Balance per EN 19694-2 Method C",
    sourceReference: "C_coke * (44/12) conversion with verified supplier assay (88.5% C)",
    publicationDate: "2023 DIN/EN Standard",
    geographicApplicability: "Industrial Metallurgical Grade",
    sectorAndProcess: "EAF Slag Foaming & Liquid Bath Carburization",
    calculationBoundary: "Scope 1 Direct Chemical Reduction",
    verificationStatus: "Verified",
  },

  PUNJAB_GRID_ELECTRICITY: {
    id: "EF-GRID-PSPCL-01",
    name: "Punjab State Power Corporation (PSPCL) Grid Factor",
    factorValue: 0.713, // 0.713 kgCO2 / kWh (or 0.713 tCO2 / MWh)
    unit: "kgCO2 / kWh",
    source: "Central Electricity Authority (CEA) CO2 Baseline Database v20.0",
    sourceReference: "Northern Regional Grid Combined Margin Factor (Oct 2024 release)",
    publicationDate: "October 2024",
    geographicApplicability: "Punjab State (Northern Regional Grid, India)",
    sectorAndProcess: "Grid Electricity Supply (Scope 2 Indirect)",
    calculationBoundary: "Gate-to-Gate Scope 2 per EU CBAM Annex III Sec 4",
    verificationStatus: "Verified",
  },

  EU_CBAM_BENCHMARK_CRUDE_STEEL: {
    id: "EF-EU-CBAM-BENCHMARK-01",
    name: "EU CBAM Transitional Benchmark Default Cap (Crude Steel)",
    factorValue: 2.15, // 2.15 tCO2e / MT crude steel
    unit: "tCO2e / MT Steel",
    source: "European Commission Implementing Regulation (EU) 2023/1773 Annex VIII",
    sourceReference: "CN Code 7206 / 7207 Default Values for Transitional Period",
    publicationDate: "2023-08-17 (Updated with corrected 2026 default values)",
    geographicApplicability: "European Union Import Gate",
    sectorAndProcess: "Crude Steel (EAF & Induction Pathways Average Default)",
    calculationBoundary: "Total Embedded Direct + Indirect Emissions",
    verificationStatus: "Verified",
  },

  EU_ETS_CARBON_PRICE_EUR: {
    id: "PARAM-EU-ETS-PRICE-01",
    name: "EU ETS Projected Carbon Allowance Price",
    factorValue: 85.00, // €85.00 / tCO2e
    unit: "EUR / tCO2e",
    source: "European Energy Exchange (EEX) Spot / Quarterly Average Benchmark",
    sourceReference: "DG TAXUD CBAM Transitional Guidance Pricing Benchmark",
    publicationDate: "Q1 2025 Market Close",
    geographicApplicability: "European Union",
    sectorAndProcess: "Compliance Market Benchmark",
    calculationBoundary: "Tariff Liability Valuation",
    verificationStatus: "Verified",
  },
};

