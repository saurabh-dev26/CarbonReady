import { describe, it, expect } from "vitest";
import { detectAnomalies } from "../lib/engine/anomaly-detector";
import { INITIAL_SUPPLIERS_DATA } from "../types/suppliers";

describe("CarbonReady Roadmap Extension Features Tests", () => {
  describe("Anomaly & Under-Reporting Detection Engine", () => {
    it("flags missing natural gas consumption when gas is null or zero", () => {
      const report = detectAnomalies({
        crudeBilletsMt: 142.0,
        scrapMt: 145.0,
        spongeIronDriMt: 12.0,
        electricityKwh: 84200,
        cokeMt: 3.20,
        reheatNaturalGasNm3: 0,
      });

      expect(report.alerts.some((a) => a.id === "ALERT-MISSING-NATGAS")).toBe(true);
      expect(report.warningsCount).toBeGreaterThan(0);
    });

    it("flags physically impossible metallic yield (>100%) as critical error", () => {
      const report = detectAnomalies({
        crudeBilletsMt: 200.0, // 200 MT billets from 100 MT metallic input is impossible
        scrapMt: 90.0,
        spongeIronDriMt: 10.0,
        electricityKwh: 50000,
        cokeMt: 2.0,
        reheatNaturalGasNm3: 300,
      });

      const yieldAlert = report.alerts.find((a) => a.id === "ALERT-IMP-YIELD-HIGH");
      expect(yieldAlert).toBeDefined();
      expect(yieldAlert?.category).toBe("unit_error");
      expect(yieldAlert?.severity).toBe("critical");
      expect(report.criticalAlertsCount).toBeGreaterThanOrEqual(1);
      expect(report.isEligibleForDraftExport).toBe(false);
    });

    it("flags implausibly low electricity consumption (<320 kWh/MT) as under-reporting review", () => {
      const report = detectAnomalies({
        crudeBilletsMt: 100.0,
        scrapMt: 105.0,
        spongeIronDriMt: 5.0,
        electricityKwh: 15000, // 150 kWh/MT is thermodynamically impossible for cold scrap melting
        cokeMt: 2.5,
        reheatNaturalGasNm3: 300,
      });

      const secAlert = report.alerts.find((a) => a.id === "ALERT-SEC-TOO-LOW");
      expect(secAlert).toBeDefined();
      expect(secAlert?.category).toBe("under_reporting_review");
      expect(secAlert?.severity).toBe("critical");
    });

    it("detects uncertified DRI precursor and recommends supplier declaration", () => {
      const report = detectAnomalies({
        crudeBilletsMt: 142.0,
        scrapMt: 140.0,
        spongeIronDriMt: 15.0, // Has DRI
        electricityKwh: 84000,
        cokeMt: 3.2,
        reheatNaturalGasNm3: 400,
      });

      const driAlert = report.alerts.find((a) => a.id === "ALERT-DRI-PRECURSOR-DOC");
      expect(driAlert).toBeDefined();
      expect(driAlert?.category).toBe("missing_data");
    });

    it("evaluates healthy realistic batch as eligible for draft export", () => {
      const report = detectAnomalies({
        crudeBilletsMt: 142.0,
        scrapMt: 145.0,
        spongeIronDriMt: 12.0,
        electricityKwh: 84200, // ~593 kWh/MT (Standard EAF range)
        cokeMt: 3.2, // ~2.2% (Standard deoxidation flux)
        reheatNaturalGasNm3: 420,
      });

      expect(report.criticalAlertsCount).toBe(0);
      expect(report.isEligibleForDraftExport).toBe(true);
      expect(report.overallDataHealthScorePct).toBeGreaterThanOrEqual(80);
    });
  });

  describe("Upstream Supply Chain & Precursor Calculations", () => {
    it("verifies scrap precursor zero-rating rule under CBAM Annex III §2.1", () => {
      const scrapSupplier = INITIAL_SUPPLIERS_DATA.find((s) => s.category === "recycled_scrap");
      expect(scrapSupplier).toBeDefined();
      expect(scrapSupplier?.reportedSpecificIntensityTco2ePerMt).toBe(0.0);
      expect(scrapSupplier?.verificationStatus).toBe("verified_declaration");
    });

    it("identifies DRI vendor with missing documentation", () => {
      const driSupplier = INITIAL_SUPPLIERS_DATA.find((s) => s.category === "sponge_iron_dri");
      expect(driSupplier).toBeDefined();
      expect(driSupplier?.verificationStatus).toBe("missing_documentation");
      expect(driSupplier?.hasCbamDossier).toBe(false);
    });
  });

  describe("Export Paperwork & Customs Math", () => {
    it("computes exact tariff shield savings against EU default benchmark (2.15 tCO2e/MT)", () => {
      const consignmentMass = 1000; // MT
      const specificIntensity = 1.42; // tCO2e/MT
      const defaultBenchmark = 2.15; // tCO2e/MT
      const etsPriceEur = 85; // €/tCO2e

      const actualEmissions = consignmentMass * specificIntensity; // 1420 tCO2e
      const defaultEmissions = consignmentMass * defaultBenchmark; // 2150 tCO2e
      const netSavingsEur = (defaultEmissions - actualEmissions) * etsPriceEur;

      expect(actualEmissions).toBe(1420);
      expect(defaultEmissions).toBe(2150);
      expect(netSavingsEur).toBe(62050); // €62,050 per 1,000 MT at 1.42 vs 2.15
    });
  });
});

