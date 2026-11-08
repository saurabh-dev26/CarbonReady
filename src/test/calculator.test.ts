import { describe, it, expect } from "vitest";
import { calculateCbamEmissions } from "../lib/engine/cbam-calculator";
import { naturalGasNm3ToTj, kwhToMwh } from "../lib/engine/unit-converter";
import { AUTHORITATIVE_EMISSION_FACTORS } from "../lib/engine/emission-factors";

describe("CBAM Carbon Calculation Engine Unit Tests", () => {
  it("converts industrial units accurately according to MoPNG and international standards", () => {
    // 1000 Nm3 natural gas should convert to 0.0385 TJ
    const tj = naturalGasNm3ToTj(1000);
    expect(tj).toBeCloseTo(0.0385, 4);

    // 84,200 kWh should convert to 84.2 MWh
    const mwh = kwhToMwh(84200);
    expect(mwh).toBe(84.2);
  });

  it("verifies authoritative emission factor registry values", () => {
    expect(AUTHORITATIVE_EMISSION_FACTORS.GRAPHITE_ELECTRODES.factorValue).toBe(3.60);
    expect(AUTHORITATIVE_EMISSION_FACTORS.PUNJAB_GRID_ELECTRICITY.factorValue).toBe(0.713);
    expect(AUTHORITATIVE_EMISSION_FACTORS.EU_CBAM_BENCHMARK_CRUDE_STEEL.factorValue).toBe(2.15);
    expect(AUTHORITATIVE_EMISSION_FACTORS.NATURAL_GAS_REHEAT.factorValue).toBe(56.10);
  });

  it("calculates Scope 1, Scope 2, and specific emissions intensity deterministically", async () => {
    const result = await calculateCbamEmissions({
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: 420.0,
      reheatHours: 10,
      reportingMultiplier: 7.08,
    });

    // Total gross emissions should be approximately 1428.60 tCO2e for this standard baseline
    expect(result.totalGrossEmissionsTco2e).toBeGreaterThan(1400);
    expect(result.totalGrossEmissionsTco2e).toBeLessThan(1450);

    // Specific intensity should be around 1.42 tCO2e / MT
    expect(result.specificEmissionsIntensityTco2ePerMt).toBeCloseTo(1.42, 1);

    // Specific intensity must be lower than the EU Benchmark default cap of 2.15 tCO2e/MT
    expect(result.specificEmissionsIntensityTco2ePerMt).toBeLessThan(result.euBenchmarkCapTco2ePerMt);

    // Protection percentage should be around 34.0%
    expect(result.protectionPercentage).toBeGreaterThan(30);

    // Net tariff saved should be positive (around €142,500)
    expect(result.netTariffSavedEur).toBeGreaterThan(130000);

    // Cryptographic audit hash must be present and valid
    expect(result.auditHashSha256).toMatch(/^0x[0-9A-F]+/);
  });

  it("flags missing reheat natural gas parameter correctly", async () => {
    const result = await calculateCbamEmissions({
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: undefined, // Omitted
    });

    expect(result.missingDataItems).toContain("Natural gas consumption for billet reheating furnace");
    expect(result.completenessScorePct).toBeLessThan(90);
  });
});

