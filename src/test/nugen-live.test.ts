import { describe, it, expect } from "vitest";
import { verifyNugenModelDeployment, extractShopfloorTelemetryWithNugen } from "../lib/nugen";
import fs from "fs";
import path from "path";

// Load .env.local values for test run
const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = process.env.NUGEN_API_KEY || "";
let modelId = process.env.NUGEN_ALIGNED_MODEL_ID || "";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NUGEN_API_KEY=")) {
      apiKey = trimmed.split("=")[1]?.trim();
    } else if (trimmed.startsWith("NUGEN_ALIGNED_MODEL_ID=")) {
      modelId = trimmed.split("=")[1]?.trim();
    }
  }
}

describe("Live Nugen Aligned Model Integration Tests", () => {
  it("authenticates and confirms model_01m6tqnx1n5br0ca is DEPLOYED", async () => {
    expect(apiKey).toBeTruthy();
    expect(modelId).toBe("model_01m6tqnx1n5br0ca");

    const result = await verifyNugenModelDeployment(modelId, apiKey);

    expect(result.isConfigured).toBe(true);
    expect(result.exists).toBe(true);
    expect(result.isAlignedModel).toBe(true);
    expect(result.deploymentStatus).toBe("DEPLOYED");
    expect(result.isReadyForInference).toBe(true);
    expect(result.modelName).toBe(
      "model_02-cbam-iron-steel-methodology-meta-llama-llama-3-2-3b-instruct-aligned"
    );
  }, 25000);

  it("executes authentic live inference and extracts shopfloor telemetry", async () => {
    const hindiInput =
      "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।";

    const result = await extractShopfloorTelemetryWithNugen(hindiInput, "hi", {
      apiKey,
      modelId,
    });

    expect(result.isDemoMode).toBe(false);
    expect(result.provider).toBe("nugen-aligned-model");
    expect(result.modelUsed).toBe("model_01m6tqnx1n5br0ca");
    expect(result.latencyMs).toBeGreaterThan(0);
    expect(result.data.heatsCount).toBe(3);
    expect(result.data.scrapMt).toBeGreaterThan(10);
    expect(result.data.spongeIronDriMt).toBe(12);
    expect(result.data.electricityKwh).toBe(84200);
    expect(result.data.cokeConsumedMt).toBe(3.2);
    expect(result.data.languageDetected).toBe("hi");
    expect(result.data.translatedEnglish).toContain("EAF");
  }, 30000);
});

