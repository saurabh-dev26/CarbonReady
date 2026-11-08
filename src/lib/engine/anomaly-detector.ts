import { CalculationInput } from "./cbam-calculator";

export type AnomalyCategory =
  | "missing_data"
  | "unit_error"
  | "statistical_anomaly"
  | "under_reporting_review";

export type AnomalySeverity = "critical" | "warning" | "info";

export interface AnomalyAlert {
  id: string;
  affectedInput: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  headline: string;
  reason: string;
  evidence: string;
  comparisonBasis: string;
  recommendedCorrection: string;
  userConfirmationStatus: "pending" | "confirmed_by_user" | "dismissed";
}

export interface AnomalyDetectionReport {
  overallDataHealthScorePct: number;
  totalAlertsCount: number;
  criticalAlertsCount: number;
  warningsCount: number;
  alerts: AnomalyAlert[];
  isEligibleForDraftExport: boolean;
  summaryComment: string;
}

/**
 * Physical & Regulatory Benchmarks for Secondary EAF Steel:
 * - Specific Electricity Consumption (SEC): 420 - 650 kWh / MT (EU BREF Steel, 2023)
 * - Metallic Yield (Billets / (Scrap + DRI)): 0.88 - 0.94 (WorldSteel Association)
 * - Coke consumption: 1.5 - 4.5 MT per 100 MT scrap
 * - Specific Carbon Intensity: 1.10 - 1.95 tCO2e / MT (Northern Indian Grid PSPCL baseline)
 */
export function detectAnomalies(input: CalculationInput): AnomalyDetectionReport {
  const alerts: AnomalyAlert[] = [];
  const billets = input.crudeBilletsMt || 0;
  const scrap = input.scrapMt || 0;
  const dri = input.spongeIronDriMt || 0;
  const power = input.electricityKwh || 0;
  const coke = input.cokeMt || 0;
  const gas = input.reheatNaturalGasNm3;

  // 1. Missing Records Check
  if (!gas || gas <= 0) {
    alerts.push({
      id: "ALERT-MISSING-NATGAS",
      affectedInput: "Reheat Natural Gas (Nm³)",
      category: "missing_data",
      severity: "warning",
      headline: "Reheat Furnace Natural Gas Consumption Unrecorded",
      reason: "No active fuel gas metering was entered for the billet reheat battery.",
      evidence: "Secondary rolling and reheat tunnel typically consumes 25 - 45 Nm³ natural gas per MT steel (IPCC 2006).",
      comparisonBasis: "EU CBAM Annex III §2.1 Direct Fuel Boundary",
      recommendedCorrection: "Verify natural gas sub-meter or utility billing invoice. If induction reheat is used instead, mark as Electric Reheat.",
      userConfirmationStatus: "pending",
    });
  }

  // 2. Impossible Physical Values / Metallic Yield Checks
  const totalMetallicInput = scrap + dri;
  if (billets > 0 && totalMetallicInput > 0) {
    const yieldRatio = billets / totalMetallicInput;
    if (yieldRatio > 1.02) {
      alerts.push({
        id: "ALERT-IMP-YIELD-HIGH",
        affectedInput: "Crude Billets vs Metallic Feedstock",
        category: "unit_error",
        severity: "critical",
        headline: "Physically Impossible Metallic Yield (>100%)",
        reason: `Reported billets (${billets} MT) exceeds total metallic charge (${totalMetallicInput} MT), resulting in a ${(yieldRatio * 100).toFixed(1)}% yield.`,
        evidence: "Law of conservation of mass. Slag oxidation, scale loss, and dust capture enforce maximum theoretical EAF yield of 92–95%.",
        comparisonBasis: "ISO 14064-1 & EN 19694-2 Stoichiometric Mass Balance",
        recommendedCorrection: "Check if billet weight was reported in quintals instead of metric tonnes, or if additional scrap heats were omitted.",
        userConfirmationStatus: "pending",
      });
    } else if (yieldRatio < 0.70) {
      alerts.push({
        id: "ALERT-IMP-YIELD-LOW",
        affectedInput: "Crude Billets vs Metallic Feedstock",
        category: "statistical_anomaly",
        severity: "warning",
        headline: "Abnormally Low Metallic Yield (<70%)",
        reason: `Reported billets (${billets} MT) represents only ${(yieldRatio * 100).toFixed(1)}% of metallic charge (${totalMetallicInput} MT).`,
        evidence: "Standard EAF practice yields 88–92%. Yield below 70% suggests heavy oxidation, catastrophic heat abort, or unrecorded billet output.",
        comparisonBasis: "WorldSteel Benchmark for Scrap EAF Metallurgy",
        recommendedCorrection: "Confirm scrap tare weight and ensure all billets cast in the shift were logged.",
        userConfirmationStatus: "pending",
      });
    }
  }

  // 3. Specific Electricity Consumption (SEC) Anomalies
  if (billets > 0 && power > 0) {
    const sec = power / billets; // kWh / MT
    if (sec < 320) {
      alerts.push({
        id: "ALERT-SEC-TOO-LOW",
        affectedInput: "Electricity Consumption (kWh)",
        category: "under_reporting_review",
        severity: "critical",
        headline: "Implausibly Low Specific Electricity Consumption",
        reason: `Calculated SEC is ${sec.toFixed(0)} kWh/MT, which is significantly below thermodynamic minimum for cold-scrap melting.`,
        evidence: "Thermodynamic heat of fusion for steel scrap requires minimum 300 kWh/MT theoretical; industrial EAF requires 420–580 kWh/MT.",
        comparisonBasis: "EU Best Available Techniques (BREF) Reference Document for Iron and Steel, 2023",
        recommendedCorrection: "Check if the meter reading reflects a single feeder rather than the entire 11kV meltshop incoming substation.",
        userConfirmationStatus: "pending",
      });
    } else if (sec > 850) {
      alerts.push({
        id: "ALERT-SEC-TOO-HIGH",
        affectedInput: "Electricity Consumption (kWh)",
        category: "statistical_anomaly",
        severity: "warning",
        headline: "High Electrical Intensity (>850 kWh/MT)",
        reason: `Calculated SEC is ${sec.toFixed(0)} kWh/MT, indicating high power consumption or auxiliary plant load bundled into meltshop feeder.`,
        evidence: "Typical Indian induction & EAF mini-mills operate at 520–680 kWh/MT.",
        comparisonBasis: "BEE Perform Achieve and Trade (PAT) Iron & Steel SEC Norms",
        recommendedCorrection: "Segregate auxiliary rolling mill and oxygen plant loads from primary furnace sub-meters.",
        userConfirmationStatus: "pending",
      });
    }
  }

  // 4. Coke / Recarburizer Intensity Check
  if (billets > 0 && coke > 0) {
    const cokePerBillet = coke / billets;
    if (cokePerBillet > 0.08) {
      alerts.push({
        id: "ALERT-COKE-HIGH",
        affectedInput: "Petroleum Coke (MT)",
        category: "unit_error",
        severity: "warning",
        headline: "Elevated Carbon Charge Ratio (>8% Coke)",
        reason: `Reported coke usage (${coke} MT for ${billets} MT billets = ${(cokePerBillet * 100).toFixed(1)}%) exceeds secondary steelmaking norms.`,
        evidence: "Scrap-based EAF steelmaking typically uses 1.5–3.5% carbon for foaming slag and deoxidation.",
        comparisonBasis: "EN 19694-2 Method C Default Carbon Flux Ranges",
        recommendedCorrection: "Verify whether reported quantity is in kilograms or metric tonnes, or if coke inventory was debited for multiple shifts.",
        userConfirmationStatus: "pending",
      });
    }
  }

  // 5. Precursor Data Omission (DRI without supplier emissions declaration)
  if (dri > 0) {
    alerts.push({
      id: "ALERT-DRI-PRECURSOR-DOC",
      affectedInput: "Sponge Iron / DRI Precursor",
      category: "missing_data",
      severity: "info",
      headline: "Purchased Sponge Iron DRI Precursor Certificate Recommended",
      reason: "Direct Reduced Iron carries significant upstream embedded carbon (~1.65 tCO2e/MT if coal-based).",
      evidence: "EU CBAM Implementing Regulation Article 7 requires supplier-specific emissions data or applies EU fallback penalty defaults.",
      comparisonBasis: "Regulation (EU) 2023/1773 Annex III Precursor Accounting Rules",
      recommendedCorrection: "Request formal CBAM supplier emissions communication from DRI supplier (e.g. Jindal Steel / Tata Sponge) to avoid default penalties.",
      userConfirmationStatus: "pending",
    });
  }

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningsCount = alerts.filter((a) => a.severity === "warning").length;
  const deduction = criticalCount * 25 + warningsCount * 10;
  const overallDataHealthScorePct = Math.max(20, Math.min(100, 100 - deduction));
  const isEligibleForDraftExport = criticalCount === 0;

  let summaryComment = "All physical activity streams fall within expected metallurgical ranges.";
  if (criticalCount > 0) {
    summaryComment = `${criticalCount} critical data validation issues detected. Corrections required prior to accredited audit verification.`;
  } else if (warningsCount > 0) {
    summaryComment = `${warningsCount} minor data quality warnings flagged. Operational review recommended before customs filing.`;
  }

  return {
    overallDataHealthScorePct,
    totalAlertsCount: alerts.length,
    criticalAlertsCount: criticalCount,
    warningsCount,
    alerts,
    isEligibleForDraftExport,
    summaryComment,
  };
}

