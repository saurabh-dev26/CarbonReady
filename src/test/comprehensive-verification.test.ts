import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import {
  verifyNugenModelDeployment,
  extractShopfloorTelemetryWithNugen,
} from "@/lib/ai/nugen-client";
import {
  calculateCbamEmissions,
  CalculationInput,
} from "@/lib/engine/cbam-calculator";
import { detectAnomalies } from "@/lib/engine/anomaly-detector";

// Load .env.local for live API inference test
beforeAll(() => {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      });
    }
  } catch (err) {
    console.warn("Could not load .env.local:", err);
  }
});

describe("CARBONREADY Comprehensive Application Verification Suite", () => {
  // REQUIREMENT 4: Genuine Nugen Aligned-Model Inference
  it("Requirement 4: Confirms authentic Nugen aligned-model identity and DEPLOYED status", async () => {
    const status = await verifyNugenModelDeployment();
    expect(status.isConfigured).toBe(true);
    expect(status.exists).toBe(true);
    expect(status.isAlignedModel).toBe(true);
    expect(status.deploymentStatus).toBe("DEPLOYED");
    expect(status.modelId).toBe("model_01m6tqnx1n5br0ca");
    expect(status.modelName).toContain("cbam-iron-steel");
  }, 25000);

  // REQUIREMENT 5: English, Hindi, and Marathi Voice/Text Extraction
  it("Requirement 5a: Extracts structured telemetry from English shift logs with high confidence", async () => {
    const englishText =
      "Today we operated our electric arc furnace for 3 heats. We charged 145 metric tonnes of MS scrap and 12 metric tonnes of sponge iron DRI. Sub-meter registered 84,200 kWh. Consumed 3.20 metric tonnes of metallurgical coke and 0.45 metric tonnes of graphite electrodes.";
    const res = await extractShopfloorTelemetryWithNugen(englishText, "en", {
      source: "voice",
    });

    expect(res.isDemoMode).toBe(false);
    expect(res.provider).toBe("nugen-aligned-model");
    expect(res.modelUsed).toBe("model_01m6tqnx1n5br0ca");
    expect(res.data.heatsCount).toBe(3);
    expect(res.data.electricityKwh).toBeCloseTo(84200, -2);
    expect(res.data.cokeConsumedMt).toBeCloseTo(3.2, 1);
    expect(res.data.dataCompletenessPct).toBeGreaterThanOrEqual(70);
  }, 25000);

  it("Requirement 5b: Extracts structured telemetry from Hindi vernacular shift logs", async () => {
    const hindiText =
      "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।";
    const res = await extractShopfloorTelemetryWithNugen(hindiText, "hi", {
      source: "voice",
    });

    expect(res.isDemoMode).toBe(false);
    expect(res.provider).toBe("nugen-aligned-model");
    expect(res.modelUsed).toBe("model_01m6tqnx1n5br0ca");
    expect(res.data.heatsCount).toBe(3);
    expect(res.data.electricityKwh).toBeCloseTo(84200, -2);
    expect(res.data.spongeIronDriMt).toBeCloseTo(12, 0);
    expect(res.data.cokeConsumedMt).toBeCloseTo(3.2, 1);
    expect(res.data.languageDetected).toBe("hi");
  }, 25000);

  it("Requirement 5c: Extracts structured telemetry from Marathi vernacular shift logs", async () => {
    const marathiText =
      "आज आम्ही 3 heats चालवल्या. 145 टन MS भंगार स्क्रॅप आणि 12 टन स्पंज लोह वापरले. विजेचे सब-मीटर 84,200 युनिट्स दाखवत आहे आणि 3.2 टन कोक वापरला.";
    const res = await extractShopfloorTelemetryWithNugen(marathiText, "mr", {
      source: "voice",
    });

    expect(res.isDemoMode).toBe(false);
    expect(res.provider).toBe("nugen-aligned-model");
    expect(res.modelUsed).toBe("model_01m6tqnx1n5br0ca");
    expect(res.data.heatsCount).toBe(3);
    expect(res.data.electricityKwh).toBeCloseTo(84200, -2);
    expect(res.data.spongeIronDriMt).toBeCloseTo(12, 0);
    expect(res.data.cokeConsumedMt).toBeCloseTo(3.2, 1);
    expect(res.data.languageDetected).toBe("mr");
  }, 25000);

  // REQUIREMENT 6: Missing-Data Handling (Zero Fake Physical Defaults)
  it("Requirement 6: Preserves undefined/null for omitted fields and calculates completeness", async () => {
    const partialText = "Batch test run: 50 metric tonnes of steel billet cast today.";
    const res = await extractShopfloorTelemetryWithNugen(partialText, "en", {
      source: "text",
    });

    // Ensure unstated physical measurements were NOT fabricated
    expect(res.data.electricityKwh).toBeNull();
    expect(res.data.cokeConsumedMt).toBeNull();
    expect(res.data.reheatNaturalGasNm3).toBeNull();

    // Verify missing parameters list contains unprovided values
    expect(
      res.data.missingParameters.some(
        (m) => m.toLowerCase().includes("electricity") || m.includes("electricityKwh")
      )
    ).toBe(true);
    expect(
      res.data.missingParameters.some(
        (m) => m.toLowerCase().includes("coke") || m.includes("cokeConsumedMt")
      )
    ).toBe(true);
    expect(res.data.dataCompletenessPct).toBeLessThan(50);
  }, 25000);

  // REQUIREMENT 7: Deterministic Carbon Calculations Using Documented Factors
  it("Requirement 7: Computes exact EN 19694-2 Method C carbon balance with CEA v20.0 emission factor", async () => {
    const inputs: CalculationInput = {
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: 420.0,
      reheatHours: 10,
      isQuarterlyAggregation: true,
      reportingMultiplier: 7.08,
    };

    const result = await calculateCbamEmissions(inputs);

    // Total gross emissions for standard baseline
    expect(result.totalGrossEmissionsTco2e).toBeGreaterThan(1400);
    expect(result.totalGrossEmissionsTco2e).toBeLessThan(1450);

    // Specific intensity: ~1.42 tCO2e/MT
    expect(result.specificEmissionsIntensityTco2ePerMt).toBeCloseTo(1.42, 1);

    // Specific intensity must beat EU Benchmark default cap of 2.15 tCO2e/MT
    expect(result.specificEmissionsIntensityTco2ePerMt).toBeLessThan(result.euBenchmarkCapTco2ePerMt);

    // Tariff shield savings
    expect(result.netTariffSavedEur).toBeGreaterThan(130000);
  });

  // REQUIREMENT 8: Calculation Traceability & Cryptographic Audit Seal
  it("Requirement 8: Produces full factor traceability and reproducible SHA-256 seal", async () => {
    const inputs: CalculationInput = {
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: 420.0,
      reheatHours: 10,
      isQuarterlyAggregation: true,
      reportingMultiplier: 7.08,
    };

    const res1 = await calculateCbamEmissions(inputs);
    const res2 = await calculateCbamEmissions(inputs);

    // Seal must be a 64-char hex string prefixed with 0x
    expect(res1.auditHashSha256).toMatch(/^0x[A-F0-9]{64}$/);
    // Seal must be strictly deterministic and reproducible
    expect(res1.auditHashSha256).toBe(res2.auditHashSha256);

    // Breakdowns must contain verifiable factor sources
    const electricityItem = res1.breakdowns.find(
      (b) => b.streamName === "Grid Electricity (Meltshop Arc Power)"
    );
    expect(electricityItem?.factorSource).toContain("Central Electricity Authority (CEA) CO2 Baseline Database v20.0");
    const cokeItem = res1.breakdowns.find(
      (b) => b.streamName === "Metallurgical Coke Slag Foaming"
    );
    expect(cokeItem?.factorSource).toContain("EN 19694-2 Method C");
  });

  // REQUIREMENT 4b/Anomalies: Physical Metallurgy Anomaly Detection
  it("Requirement 4b: Correctly detects metallurgical anomalies (low SEC, missing gas)", () => {
    const anomalousInputs: CalculationInput = {
      crudeBilletsMt: 100,
      scrapMt: 90,
      spongeIronDriMt: 10,
      electricityKwh: 15000, // 150 kWh/t -> triggers ALERT-SEC-TOO-LOW (critical)
      cokeMt: 2,
      reheatNaturalGasNm3: 0, // triggers ALERT-MISSING-NATGAS (warning)
    };

    const anomalyReport = detectAnomalies(anomalousInputs);
    // A critical anomaly disqualifies draft report export
    expect(anomalyReport.isEligibleForDraftExport).toBe(false);
    expect(anomalyReport.criticalAlertsCount).toBeGreaterThanOrEqual(1);
    expect(anomalyReport.alerts.some((a) => a.id === "ALERT-SEC-TOO-LOW")).toBe(true);
    expect(anomalyReport.alerts.some((a) => a.id === "ALERT-MISSING-NATGAS")).toBe(true);
  });

  // REQUIREMENT 13: Secrets Leakage Protection
  it("Requirement 13: Ensures NUGEN_API_KEY is not exposed in public environment or client objects", () => {
    // NEXT_PUBLIC_ variables are what Next.js exposes to the browser
    const publicKeys = Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_"));
    for (const key of publicKeys) {
      expect(process.env[key]).not.toContain("nugen-");
      expect(key).not.toContain("NUGEN_API_KEY");
    }

    // Verify server-side key exists
    expect(process.env.NUGEN_API_KEY).toBeDefined();
    expect(process.env.NUGEN_API_KEY?.startsWith("nugen-")).toBe(true);
  });
});
