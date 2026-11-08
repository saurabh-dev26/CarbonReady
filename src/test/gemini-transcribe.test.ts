import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  validateAudioInput,
  normalizeLanguageCode,
  getLanguageVerbatimInstruction,
  transcribeAudioWithGemini,
  SUPPORTED_AUDIO_MIMES,
  SUPPORTED_EXTENSIONS,
  MAX_AUDIO_BYTES,
} from "@/lib/ai/gemini-transcribe";
import { extractShopfloorTelemetryWithNugen } from "@/lib/ai/nugen-client";
import { ShopfloorExtractionSchema, calculateDataCompleteness } from "@/lib/ai/extraction-schemas";
import { calculateCbamEmissions } from "@/lib/engine/cbam-calculator";
import fs from "fs";
import path from "path";

describe("Gemini 3.5 Transcribe — Dedicated Audio Transcription Adapter", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ============================================================================
  // 1. FORMAT, MIME & PAYLOAD SIZE VALIDATION
  // ============================================================================
  describe("Audio Input & Format Validation", () => {
    it("accepts all documented supported audio formats (WAV, WebM, MP3, OGG, M4A, MP4, AAC)", () => {
      const validBuffer = Buffer.alloc(1024, 0); // 1 KB dummy buffer

      const formats = [
        { mime: "audio/wav", file: "shift.wav" },
        { mime: "audio/webm", file: "recording.webm" },
        { mime: "audio/webm;codecs=opus", file: "mic.webm" },
        { mime: "audio/mp3", file: "voice.mp3" },
        { mime: "audio/mpeg", file: "audio.mpeg" },
        { mime: "audio/ogg", file: "note.ogg" },
        { mime: "audio/m4a", file: "memo.m4a" },
        { mime: "audio/mp4", file: "audio.mp4" },
        { mime: "audio/aac", file: "sound.aac" },
      ];

      for (const fmt of formats) {
        const res = validateAudioInput(validBuffer, fmt.mime, fmt.file);
        expect(res.valid).toBe(true);
        expect(res.byteLength).toBe(1024);
      }
    });

    it("rejects unsupported audio formats with descriptive error message", () => {
      const validBuffer = Buffer.alloc(1024, 0);
      const res = validateAudioInput(validBuffer, "audio/unsupported-xyz", "test.xyz");

      expect(res.valid).toBe(false);
      expect(res.error).toContain('Unsupported audio format "audio/unsupported-xyz"');
      expect(res.error).toContain("Supported audio formats: WAV, WebM, MP3, OGG, M4A, MP4, AAC");
    });

    it("rejects oversized audio files exceeding 20 MB limit", () => {
      // 21 MB virtual buffer representation
      const oversizedSize = MAX_AUDIO_BYTES + 1024 * 1024;
      // create sparse or virtual check
      const largeBuffer = {
        length: oversizedSize,
      } as Buffer;

      const res = validateAudioInput(largeBuffer, "audio/wav", "large-shift.wav");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceeds maximum allowed limit of 20 MB");
    });

    it("rejects empty or corrupt audio files smaller than 100 bytes", () => {
      const tinyBuffer = Buffer.alloc(50, 0);
      const res = validateAudioInput(tinyBuffer, "audio/wav", "empty.wav");

      expect(res.valid).toBe(false);
      expect(res.error).toContain("Audio file is empty or too short");
    });
  });

  // ============================================================================
  // 2. VERBATIM INSTRUCTIONS & INDUSTRIAL TERMINOLOGY PRESERVATION
  // ============================================================================
  describe("Language Prompts & Metallurgical Terminology Preservation", () => {
    it("normalizes language codes accurately (mr-IN -> mr, hi-IN -> hi, en-IN -> en)", () => {
      expect(normalizeLanguageCode("mr-IN")).toBe("mr");
      expect(normalizeLanguageCode("hi-IN")).toBe("hi");
      expect(normalizeLanguageCode("en-IN")).toBe("en");
      expect(normalizeLanguageCode("mr")).toBe("mr");
      expect(normalizeLanguageCode("hi")).toBe("hi");
      expect(normalizeLanguageCode("en")).toBe("en");
    });

    it("enforces Marathi (mr-IN) verbatim transcription without translation and preserves terms", () => {
      const prompt = getLanguageVerbatimInstruction("mr");
      expect(prompt).toContain("Marathi (मराठी) verbatim");
      expect(prompt).toContain("Do NOT translate into English");
      expect(prompt).toContain("Do NOT summarize");
      expect(prompt).toContain("हीट्स");
      expect(prompt).toContain("टन");
      expect(prompt).toContain("युनिट");
      expect(prompt).toContain("स्क्रॅप");
      expect(prompt).toContain("स्पंज आयर्न");
      expect(prompt).toContain("कोक");
      expect(prompt).toContain("नैसर्गिक वायू");
      expect(prompt).toContain("बिलेट्स");
    });

    it("enforces Hindi (hi-IN) verbatim transcription without translation and preserves terms", () => {
      const prompt = getLanguageVerbatimInstruction("hi");
      expect(prompt).toContain("Hindi (हिंदी) verbatim");
      expect(prompt).toContain("Do NOT translate into English");
      expect(prompt).toContain("Do NOT summarize");
      expect(prompt).toContain("हीट्स");
      expect(prompt).toContain("टन");
      expect(prompt).toContain("यूनिट");
      expect(prompt).toContain("स्क्रैप");
      expect(prompt).toContain("स्पंज आयरन");
      expect(prompt).toContain("कोक");
      expect(prompt).toContain("गैस");
      expect(prompt).toContain("बिलेट्स");
    });

    it("enforces Indian English (en-IN) verbatim transcription preserving exact units", () => {
      const prompt = getLanguageVerbatimInstruction("en");
      expect(prompt).toContain("Indian English verbatim");
      expect(prompt).toContain("Do NOT summarize");
      expect(prompt).toContain("MT, tonnes, kWh, units, Nm3");
      expect(prompt).toContain("furnace heats, scrap, DRI sponge iron, coke");
    });
  });

  // ============================================================================
  // 3. SERVER-SIDE GEMINI 3.5 TRANSCRIBE EXECUTION & ERROR HANDLING
  // ============================================================================
  describe("Gemini 3.5 Transcribe Adapter Invocation & Error Resilience", () => {
    it("returns clean error message when GEMINI_API_KEY is not configured", async () => {
      delete process.env.GEMINI_API_KEY;

      const dummyAudio = Buffer.alloc(1024, 1);
      const result = await transcribeAudioWithGemini({
        audio: dummyAudio,
        mimeType: "audio/wav",
        language: "en-IN",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("GEMINI_API_KEY is not configured in .env.local");
      expect(result.error).toContain("Browser Speech Recognition");
    });

    it("handles mock Gemini API HTTP error (e.g. 401 Invalid Key) safely without crashing", async () => {
      process.env.GEMINI_API_KEY = "dummy-test-key-invalid";

      // Mock global fetch to return 401 Unauthorized
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: async () => JSON.stringify({ error: { message: "API key not valid. Please pass a valid API key." } }),
      } as any);

      const dummyAudio = Buffer.alloc(1024, 1);
      const result = await transcribeAudioWithGemini({
        audio: dummyAudio,
        mimeType: "audio/webm",
        language: "hi-IN",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("API key not valid");
      expect(fetchSpy).toHaveBeenCalled();
    });

    it("transcribes English audio into faithful verbatim shift text", async () => {
      process.env.GEMINI_API_KEY = "test-active-gemini-key";

      const expectedEnglishTranscript =
        "Shopfloor update for meltshop line two. Three full heats completed today producing 142 metric tons of crude billets. We charged 145 tons of recycled scrap with 12 tons DRI sponge. Power consumption logged at 84,200 kilowatt hours. Injected 3.2 tons metallurgical coke and billet reheat furnace consumed 420 normal cubic meters natural gas.";

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: expectedEnglishTranscript }],
                role: "model",
              },
              finishReason: "STOP",
            },
          ],
        }),
      } as any);

      const audioBuffer = Buffer.alloc(2048, 2);
      const result = await transcribeAudioWithGemini({
        audio: audioBuffer,
        mimeType: "audio/wav",
        language: "en",
        filename: "shift-en-sample.wav",
      });

      expect(result.success).toBe(true);
      expect(result.language).toBe("en");
      expect(result.modelUsed).toBe("gemini-3.5-transcribe");
      expect(result.text).toBe(expectedEnglishTranscript);
      expect(result.wordCount).toBeGreaterThan(40);
    });

    it("transcribes Hindi audio into faithful verbatim Hindi text without English translation", async () => {
      process.env.GEMINI_API_KEY = "test-active-gemini-key";

      const expectedHindiTranscript =
        "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ। रीहीटिंग फर्नेस में 420 क्यूबिक मीटर गैस गई।";

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: expectedHindiTranscript }],
                role: "model",
              },
            },
          ],
        }),
      } as any);

      const audioBuffer = Buffer.alloc(2048, 2);
      const result = await transcribeAudioWithGemini({
        audio: audioBuffer,
        mimeType: "audio/wav",
        language: "hi",
        filename: "shift-hi-sample.wav",
      });

      expect(result.success).toBe(true);
      expect(result.language).toBe("hi");
      expect(result.text).toBe(expectedHindiTranscript);
      // Confirms Hindi text is preserved, not translated to English by STT
      expect(result.text).toContain("145 टन MS स्क्रैप");
      expect(result.text).toContain("84,200 यूनिट्स");
      expect(result.text).toContain("3.2 टन कोक");
    });

    it("transcribes Marathi audio into faithful verbatim Marathi text preserving technical terms", async () => {
      process.env.GEMINI_API_KEY = "test-active-gemini-key";

      const expectedMarathiTranscript =
        "आज पहिल्या शिफ्टमध्ये 2 हीट्स पूर्ण झाल्या. एकूण 95 टन स्क्रॅप आणि 10 टन स्पंज आयर्न वापरले. सब-मीटरवर 56,000 युनिट वीज खर्च झाली आणि 2.1 टन कोक लागला. एकूण 92 टन बिलेट्स तयार झाले.";

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: expectedMarathiTranscript }],
                role: "model",
              },
            },
          ],
        }),
      } as any);

      const audioBuffer = Buffer.alloc(2048, 2);
      const result = await transcribeAudioWithGemini({
        audio: audioBuffer,
        mimeType: "audio/wav",
        language: "mr",
        filename: "shift-mr-sample.wav",
      });

      expect(result.success).toBe(true);
      expect(result.language).toBe("mr");
      expect(result.text).toBe(expectedMarathiTranscript);
      expect(result.text).toContain("2 हीट्स");
      expect(result.text).toContain("95 टन स्क्रॅप");
      expect(result.text).toContain("56,000 युनिट");
      expect(result.text).toContain("2.1 टन कोक");
      expect(result.text).toContain("92 टन बिलेट्स");
    });

    it("falls back to gemini-3.8-flash if gemini-3.5-transcribe model returns 404 Not Found", async () => {
      process.env.GEMINI_API_KEY = "test-active-gemini-key";

      const expectedText = "Test audio shift log transcribed successfully.";

      // First call (gemini-3.5-transcribe) returns 404, second call (gemini-3.8-flash) returns 200
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
          text: async () => JSON.stringify({ error: { message: "models/gemini-3.5-transcribe is not found for API version v1beta" } }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: expectedText }],
                  role: "model",
                },
              },
            ],
          }),
        } as any);

      const audioBuffer = Buffer.alloc(1024, 3);
      const result = await transcribeAudioWithGemini({
        audio: audioBuffer,
        mimeType: "audio/wav",
        language: "en",
      });

      expect(result.success).toBe(true);
      expect(result.modelUsed).toBe("gemini-3.8-flash");
      expect(result.provider).toBe("gemini-fallback");
      expect(result.text).toBe(expectedText);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  // ============================================================================
  // 4. ARCHITECTURAL HANDOFF: GEMINI STT -> NUGEN EXTRACTION -> CALCULATION ENGINE
  // ============================================================================
  describe("End-to-End Pipeline: Gemini STT -> Nugen Extraction -> Carbon Calculation", () => {
    it("pipes confirmed Hindi verbatim transcript into Nugen aligned-model adapter and calculates emissions", async () => {
      // 1. Simulated faithful Gemini transcript
      const confirmedHindiTranscript =
        "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ। रीहीटिंग फर्नेस में 420 क्यूबिक मीटर गैस गई।";

      // 2. Pass confirmed transcript to Nugen extraction engine
      const nugenResult = await extractShopfloorTelemetryWithNugen(confirmedHindiTranscript, "hi", {
        source: "voice",
        transcriptionConfidence: 0.98,
      });

      expect(nugenResult.data).toBeDefined();
      const entities = nugenResult.data;

      // 3. Validate with Zod Schema
      const parsed = ShopfloorExtractionSchema.safeParse(entities);
      expect(parsed.success).toBe(true);

      // Verify physical parameters extracted by Nugen
      expect(entities.scrapMt).toBe(145.0);
      expect(entities.spongeIronDriMt).toBe(12.0);
      expect(entities.electricityKwh).toBe(84200);
      expect(entities.cokeConsumedMt).toBe(3.2);
      expect(entities.heatsCount).toBe(3);

      // 4. Data completeness check
      const completeness = calculateDataCompleteness(entities);
      expect(completeness.completenessPct).toBeGreaterThanOrEqual(80);

      // 5. Compute deterministic emissions using verified calculation engine
      const emissions = await calculateCbamEmissions({
        crudeBilletsMt: entities.crudeBilletsProducedMt || 142.0,
        scrapMt: entities.scrapMt!,
        spongeIronDriMt: entities.spongeIronDriMt || 0,
        electricityKwh: entities.electricityKwh!,
        cokeMt: entities.cokeConsumedMt || 3.2,
        reheatNaturalGasNm3: entities.reheatNaturalGasNm3 || 420,
      });

      expect(emissions.totalGrossEmissionsTco2e).toBeGreaterThan(0);
      expect(emissions.specificEmissionsIntensityTco2ePerMt).toBeLessThan(emissions.euBenchmarkCapTco2ePerMt);
      expect(emissions.euBenchmarkCapTco2ePerMt).toBe(2.15);
      expect(emissions.intensityDeltaVsBenchmark).toBeLessThan(0);
      expect(emissions.auditHashSha256).toBeDefined();
    });

    it("asks for missing parameters rather than fabricating carbon metrics when audio omits gas consumption", async () => {
      // Audio transcript that completely omits natural gas reheat
      const transcriptWithoutGas =
        "Shift report: Ran 2 heats with 90 tons scrap and 50,000 units electricity. Coke used was 2 tons. Billets produced: 85 tons.";

      const nugenResult = await extractShopfloorTelemetryWithNugen(transcriptWithoutGas, "en", {
        source: "voice",
        transcriptionConfidence: 0.95,
      });

      expect(nugenResult.data).toBeDefined();
      const entities = nugenResult.data;

      // Missing gas must be null/undefined, NOT fabricated
      expect(entities.reheatNaturalGasNm3).toBeNull();

      // Completeness score derivation
      const completeness = calculateDataCompleteness(entities);
      expect(completeness.missingList.some((m) => m.includes("Natural Gas"))).toBe(true);
      expect(completeness.completenessPct).toBeLessThan(100);
    });
  });
});
