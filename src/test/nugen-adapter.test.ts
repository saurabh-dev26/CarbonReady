import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractShopfloorTelemetryWithNugen,
  extractJsonFromLlmResponse,
  listNugenAlignedModels,
  verifyNugenModelDeployment,
  NUGEN_INFERENCE_ENDPOINT,
  NUGEN_MODELS_ALIGNED_ENDPOINT,
  ShopfloorExtractionSchema,
  calculateDataCompleteness,
} from "../lib/nugen";

describe("Nugen AI Integration & Telemetry Extraction Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts entities from spoken Hindi text correctly via demo adapter", async () => {
    const hindiInput =
      "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।";

    const result = await extractShopfloorTelemetryWithNugen(hindiInput, "hi");

    expect(result.data.heatsCount).toBe(3);
    expect(result.data.scrapMt).toBe(145.0);
    expect(result.data.spongeIronDriMt).toBe(12.0);
    expect(result.data.electricityKwh).toBe(84200);
    expect(result.data.cokeConsumedMt).toBe(3.2);
    expect(result.data.languageDetected).toBe("hi");

    // Both missing natural gas and unmentioned crude billets must be flagged
    expect(result.data.missingParameters.length).toBeGreaterThan(0);
    expect(result.data.missingParameters.some((p) => p.includes("Natural Gas"))).toBe(true);
    expect(result.data.missingParameters.some((p) => p.includes("Billets"))).toBe(true);
  });

  it("extracts entities from spoken Marathi text correctly via demo adapter", async () => {
    const marathiInput =
      "आज पहिल्या शिफ्टमध्ये 2 हीट्स पूर्ण झाल्या. एकूण 95 टन स्क्रॅप आणि 10 टन स्पंज आयर्न वापरले. सब-मीटरवर 56,000 युनिट वीज खर्च झाली आणि 2.1 टन कोक लागला. एकूण 92 टन बिलेट्स तयार झाले.";

    const result = await extractShopfloorTelemetryWithNugen(marathiInput, "mr");

    expect(result.data.heatsCount).toBe(2);
    expect(result.data.scrapMt).toBe(95.0);
    expect(result.data.spongeIronDriMt).toBe(10.0);
    expect(result.data.electricityKwh).toBe(56000);
    expect(result.data.cokeConsumedMt).toBe(2.1);
    expect(result.data.crudeBilletsProducedMt).toBe(92.0);
    expect(result.data.languageDetected).toBe("mr");
  });

  it("verifies Nugen demo adapter transparency notice when credentials are not configured", async () => {
    const result = await extractShopfloorTelemetryWithNugen("EAF 3 heats 145 tons scrap 84200 units", "en");

    // When NUGEN_API_KEY is not configured in .env, it must explicitly report demo mode
    if (!process.env.NUGEN_API_KEY) {
      expect(result.isDemoMode).toBe(true);
      expect(result.provider).toBe("demo-adapter");
      expect(result.message).toContain("Demo Simulation Mode");
    }
  });

  it("extracts and parses JSON wrapped in markdown code blocks and conversational text", () => {
    const rawWithMarkdown = `Here is the telemetry JSON extracted from the shopfloor voice input:
\`\`\`json
{
  "heatsCount": 4,
  "crudeBilletsProducedMt": 180.5,
  "scrapMt": 185.0,
  "spongeIronDriMt": 15.0,
  "electricityKwh": 105000,
  "cokeConsumedMt": 4.1,
  "reheatNaturalGasNm3": 510,
  "languageDetected": "hi",
  "confidenceScorePct": 99.1,
  "missingParameters": [],
  "explanation": "Processed 4 EAF heats with full reheat gas data.",
  "translatedEnglish": "English translation"
}
\`\`\`
Extraction completed successfully.`;

    const parsed: any = extractJsonFromLlmResponse(rawWithMarkdown);
    expect(parsed.heatsCount).toBe(4);
    expect(parsed.crudeBilletsProducedMt).toBe(180.5);
    expect(parsed.reheatNaturalGasNm3).toBe(510);
  });

  it("correctly executes live Nugen chat completion parsing when credentials are provided", async () => {
    const mockNugenResponse = {
      id: "chatcmpl-test-001",
      object: "chat.completion",
      created: 1710000000,
      model: "nugen-carbonready-v1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              heatsCount: 3,
              crudeBilletsProducedMt: 142.0,
              scrapMt: 145.0,
              spongeIronDriMt: 12.0,
              electricityKwh: 84200,
              cokeConsumedMt: 3.2,
              reheatNaturalGasNm3: null,
              languageDetected: "hi",
              confidenceScorePct: 98.9,
              missingParameters: ["Natural gas consumption for billet reheating furnace was omitted in speech."],
              explanation: "Parsed 3 EAF melt cycles via live Nugen aligned model.",
              translatedEnglish: "Shift 1 completed 3 heats.",
            }),
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 350,
        completion_tokens: 120,
        total_tokens: 470,
      },
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockNugenResponse,
    } as Response);

    const result = await extractShopfloorTelemetryWithNugen("Shift 1 completed 3 heats", "hi", {
      apiKey: "test-nugen-api-key",
      modelId: "nugen-carbonready-v1",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      NUGEN_INFERENCE_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-nugen-api-key",
        }),
      })
    );

    expect(result.isDemoMode).toBe(false);
    expect(result.provider).toBe("nugen-aligned-model");
    expect(result.modelUsed).toBe("nugen-carbonready-v1");
    expect(result.data.heatsCount).toBe(3);
    expect(result.data.electricityKwh).toBe(84200);
  });

  it("gracefully catches Nugen API HTTP error (e.g. 401 Unauthorized) and activates demo fallback", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized: Invalid API Key",
    } as Response);

    const result = await extractShopfloorTelemetryWithNugen("Shift 1 completed 3 heats", "hi", {
      apiKey: "invalid-key",
      modelId: "nugen-carbonready-v1",
    });

    expect(result.isDemoMode).toBe(true);
    expect(result.provider).toBe("demo-adapter");
    expect(result.message).toContain("Nugen API HTTP 401");
  });

  it("verifies aligned model listing and checks deployment_status", async () => {
    const mockAlignedResponse = {
      models: [
        {
          model_id: "carbonready-aligned-v1",
          model_name: "CarbonReady Steel Domain Aligned",
          base_model_id: "Qwen/Qwen2.5-7B-Instruct",
          alignment_id: "align_01",
          deployment_status: "DEPLOYED",
        },
        {
          model_id: "carbonready-draft-v2",
          model_name: "CarbonReady Candidate",
          base_model_id: "Qwen/Qwen2.5-7B-Instruct",
          alignment_id: "align_02",
          deployment_status: "READY",
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAlignedResponse,
    } as Response);

    const checkDeployed = await verifyNugenModelDeployment("carbonready-aligned-v1", "mock-key");
    expect(checkDeployed.isConfigured).toBe(true);
    expect(checkDeployed.exists).toBe(true);
    expect(checkDeployed.isAlignedModel).toBe(true);
    expect(checkDeployed.deploymentStatus).toBe("DEPLOYED");
    expect(checkDeployed.isReadyForInference).toBe(true);
  });

  it("rejects undeployed model (status: READY) from inference", async () => {
    const mockAlignedResponse = {
      models: [
        {
          model_id: "carbonready-draft-v2",
          model_name: "CarbonReady Candidate",
          base_model_id: "Qwen/Qwen2.5-7B-Instruct",
          alignment_id: "align_02",
          deployment_status: "READY",
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAlignedResponse,
    } as Response);

    const checkReady = await verifyNugenModelDeployment("carbonready-draft-v2", "mock-key");
    expect(checkReady.exists).toBe(true);
    expect(checkReady.deploymentStatus).toBe("READY");
    expect(checkReady.isReadyForInference).toBe(false);
    expect(checkReady.statusMessage).toContain("Only DEPLOYED models can be used for inference");
  });

  it("rejects base model or missing model IDs", async () => {
    const mockAlignedResponse = {
      models: [
        {
          model_id: "carbonready-aligned-v1",
          model_name: "CarbonReady Steel Domain Aligned",
          base_model_id: "Qwen/Qwen2.5-7B-Instruct",
          alignment_id: "align_01",
          deployment_status: "DEPLOYED",
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockAlignedResponse,
    } as Response);

    const checkBase = await verifyNugenModelDeployment("Qwen/Qwen2.5-7B-Instruct", "mock-key");
    expect(checkBase.exists).toBe(false);
    expect(checkBase.isReadyForInference).toBe(false);
    expect(checkBase.statusMessage).toContain("Ensure you are using an aligned model ID and not a base model ID");
  });

  it("never invents physical defaults and computes data completeness accurately", () => {
    // Partial telemetry without natural gas or billets
    const partialData = {
      heatsCount: 2,
      scrapMt: 95.0,
      spongeIronDriMt: 10.0,
      electricityKwh: 56000,
      cokeConsumedMt: 2.1,
    };

    // Parse with schema
    const parsed = ShopfloorExtractionSchema.parse(partialData);

    expect(parsed.heatsCount).toBe(2);
    expect(parsed.scrapMt).toBe(95.0);
    // Missing fields MUST be undefined/null, NEVER invented numbers!
    expect(parsed.crudeBilletsProducedMt).toBeUndefined();
    expect(parsed.reheatNaturalGasNm3).toBeUndefined();

    const { completenessPct, missingList } = calculateDataCompleteness(parsed);
    // 5 out of 7 required metrics provided = 71.4%
    expect(completenessPct).toBe(71.4);
    expect(missingList.length).toBe(2);
  });
});
