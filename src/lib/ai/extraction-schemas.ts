import { z } from "zod";
import { ExtractedShopfloorEntities } from "@/types/nugen";

/**
 * Strict Zod schema for Nugen domain-aligned LLM extraction output.
 * CRITICAL RULE: Physical measurements must NEVER receive invented defaults.
 * Missing physical values remain null/undefined so the system can flag them
 * to the manufacturer rather than silently fabricating carbon metrics.
 */
export const ShopfloorExtractionSchema = z.object({
  heatsCount: z.number().int().positive().nullish(),
  crudeBilletsProducedMt: z.number().positive().nullish(),
  scrapMt: z.number().positive().nullish(),
  spongeIronDriMt: z.number().nonnegative().nullish(),
  electricityKwh: z.number().positive().nullish(),
  cokeConsumedMt: z.number().nonnegative().nullish(),
  reheatNaturalGasNm3: z.number().nonnegative().nullish(),
  languageDetected: z.enum(["hi", "mr", "en"]).default("hi"),
  confidenceScorePct: z.number().nullish(),
  missingParameters: z.array(z.string()).default([]),
  explanation: z.string().nullish(),
  translatedEnglish: z.string().default(""),
});

export type ShopfloorExtraction = z.infer<typeof ShopfloorExtractionSchema>;

/**
 * Mandatory physical fields required for an audit-ready EU CBAM Scope 1 & Scope 2 calculation
 * in an Electric Arc Furnace (EAF) / Induction mini-mill.
 */
export const REQUIRED_CBAM_METRICS = [
  { key: "crudeBilletsProducedMt", label: "Crude Billets Produced (MT)", scope: "Production Output" },
  { key: "scrapMt", label: "Recycled Steel Scrap Charged (MT)", scope: "Scope 3 / Circularity" },
  { key: "spongeIronDriMt", label: "Direct Reduced Iron / Sponge Iron (MT)", scope: "Metallic Charge" },
  { key: "electricityKwh", label: "Electricity Consumed (kWh)", scope: "Scope 2 Indirect" },
  { key: "cokeConsumedMt", label: "Metallurgical Coke / Carbon Raiser (MT)", scope: "Scope 1 Direct" },
  { key: "reheatNaturalGasNm3", label: "Natural Gas Reheat Consumption (Nm³)", scope: "Scope 1 Direct" },
  { key: "heatsCount", label: "Furnace Heat Cycles (Heats)", scope: "Process Batch Count" },
] as const;

/**
 * Deterministically calculates real data completeness based strictly on actual provided fields.
 * No arbitrary percentages.
 */
export function calculateDataCompleteness(
  data: Partial<ShopfloorExtraction>
): { completenessPct: number; missingList: string[]; presentList: string[] } {
  const missingList: string[] = [];
  const presentList: string[] = [];

  for (const metric of REQUIRED_CBAM_METRICS) {
    const val = data[metric.key as keyof ShopfloorExtraction];
    if (val === null || val === undefined || (typeof val === "number" && isNaN(val))) {
      missingList.push(`${metric.label} (${metric.scope})`);
    } else {
      presentList.push(metric.label);
    }
  }

  const completenessPct = Number(
    ((presentList.length / REQUIRED_CBAM_METRICS.length) * 100).toFixed(1)
  );

  return { completenessPct, missingList, presentList };
}

/**
 * Explicit DEMO baseline scenario for Apex Steels & Alloys Ltd (Ludhiana Works #3).
 * Stored SEPARATELY from live manufacturer telemetry. Clearly labeled as DEMO DATA.
 */
export const DEMO_SHOPFLOOR_DATA: ExtractedShopfloorEntities = {
  heatsCount: 3,
  crudeBilletsProducedMt: 142.0,
  scrapMt: 145.0,
  spongeIronDriMt: 12.0,
  electricityKwh: 84200,
  cokeConsumedMt: 3.2,
  reheatNaturalGasNm3: 420.0,
  languageDetected: "hi",
  transcriptionConfidenceScore: 0.98,
  aiModelConfidenceScore: 92.21,
  confidenceScorePct: 92.21,
  dataCompletenessPct: 100.0,
  missingParameters: [],
  explanation: "Baseline verification heat log for Apex Steels & Alloys Ludhiana mini-mill (EAF route).",
  rawTextSpoken: "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।",
  translatedEnglish: "Today we ran 3 heats in the EAF furnace. Charged 145 MT MS scrap and used 12 MT sponge iron. Sub-meter reading is 84,200 units electricity, and 3.2 tonnes coke consumed. Reheating gas: 420 Nm³.",
  source: "demo_preset",
  isDemoData: true,
  confirmedByManufacturer: true,
};
