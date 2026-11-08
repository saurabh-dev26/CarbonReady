/**
 * Dedicated Server-Side Audio Transcription Adapter for Google Gemini 3.5 Transcribe.
 * 
 * ARCHITECTURE BOUNDARY:
 * - Gemini 3.5 Transcribe is responsible ONLY for converting recorded audio into verbatim text.
 * - Supported locales: Marathi (mr-IN), Hindi (hi-IN), Indian English (en-IN).
 * - Domain extraction, metallurgical interpretation, and carbon-domain reasoning remain
 *   strictly handled by the deployed Nugen aligned model (model_01m6tqnx1n5br0ca).
 * - Emissions calculations remain strictly handled by the deterministic calculation engine.
 */

export interface GeminiTranscriptionOptions {
  audio: Buffer | string; // Buffer or Base64 string
  mimeType: string;
  language: "hi" | "mr" | "en" | "hi-IN" | "mr-IN" | "en-IN";
  filename?: string;
  model?: string;
}

export interface GeminiTranscriptionResult {
  success: boolean;
  text: string;
  language: "hi" | "mr" | "en";
  modelUsed: string;
  provider: "gemini-3.5-transcribe" | "gemini-fallback" | "mock-transcriber";
  wordCount: number;
  byteSize: number;
  error?: string;
  isMock?: boolean;
}

// Supported audio MIME types and standard extensions
export const SUPPORTED_AUDIO_MIMES = [
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp3",
  "audio/mpeg",
  "audio/ogg",
  "audio/ogg;codecs=opus",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/aac",
  "audio/flac",
] as const;

export const SUPPORTED_EXTENSIONS = [
  ".wav",
  ".webm",
  ".mp3",
  ".ogg",
  ".m4a",
  ".mp4",
  ".aac",
  ".flac",
] as const;

export const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // 20 MB max payload
export const MIN_AUDIO_BYTES = 100; // minimum header/data bytes

/**
 * Validates audio format, extension, and payload size.
 */
export function validateAudioInput(
  audioData: Buffer | string,
  mimeType: string,
  filename?: string
): { valid: boolean; error?: string; byteLength: number; cleanMime: string } {
  const byteLength = Buffer.isBuffer(audioData)
    ? audioData.length
    : Buffer.from(audioData, "base64").length;

  if (byteLength < MIN_AUDIO_BYTES) {
    return {
      valid: false,
      error: `Audio file is empty or too short (${byteLength} bytes). Please record or upload a valid audio shift log.`,
      byteLength,
      cleanMime: mimeType,
    };
  }

  if (byteLength > MAX_AUDIO_BYTES) {
    const sizeMb = (byteLength / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Audio file size (${sizeMb} MB) exceeds maximum allowed limit of 20 MB.`,
      byteLength,
      cleanMime: mimeType,
    };
  }

  // Clean mime type (remove parameters like codecs=opus for Gemini inlineData)
  const baseMime = mimeType.split(";")[0].trim().toLowerCase();

  const isMimeSupported = SUPPORTED_AUDIO_MIMES.some(
    (m) => m.toLowerCase().split(";")[0] === baseMime
  );

  let isExtSupported = false;
  if (filename) {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
    isExtSupported = SUPPORTED_EXTENSIONS.includes(ext as any);
  }

  if (!isMimeSupported && !isExtSupported) {
    return {
      valid: false,
      error: `Unsupported audio format "${mimeType}". Supported audio formats: WAV, WebM, MP3, OGG, M4A, MP4, AAC.`,
      byteLength,
      cleanMime: baseMime,
    };
  }

  return {
    valid: true,
    byteLength,
    cleanMime: baseMime || "audio/webm",
  };
}

/**
 * Normalizes language selection to CarbonReady standard code.
 */
export function normalizeLanguageCode(
  lang: "hi" | "mr" | "en" | "hi-IN" | "mr-IN" | "en-IN"
): "hi" | "mr" | "en" {
  if (lang.startsWith("mr")) return "mr";
  if (lang.startsWith("hi")) return "hi";
  return "en";
}

/**
 * Returns strict verbatim prompt for faithful transcription without translation or summarization.
 */
export function getLanguageVerbatimInstruction(lang: "hi" | "mr" | "en"): string {
  switch (lang) {
    case "mr":
      return `You are a faithful verbatim audio speech-to-text transcriber for Indian industrial manufacturing.
Transcribe the provided audio faithfully in Marathi (मराठी) verbatim.
CRITICAL RULES:
1. Do NOT translate into English or Hindi.
2. Do NOT summarize, correct, or omit any spoken content.
3. Preserve all exact numerical quantities, units, and industrial terminology: हीट्स (heats), टन (tonnes / MT), युनिट (electricity kWh units), स्क्रॅप (scrap), स्पंज आयर्न (sponge iron / DRI), कोक (coke), रीहीटिंग फर्नेस (reheating furnace), नैसर्गिक वायू (natural gas Nm3), बिलेट्स (billets).
4. Output ONLY the plain transcription text. Do NOT wrap in quotes, explanations, or markdown codeblocks.`;

    case "hi":
      return `You are a faithful verbatim audio speech-to-text transcriber for Indian industrial manufacturing.
Transcribe the provided audio faithfully in Hindi (हिंदी) verbatim.
CRITICAL RULES:
1. Do NOT translate into English.
2. Do NOT summarize, correct, or omit any spoken content.
3. Preserve all exact numerical quantities, units, and industrial terminology: हीट्स (heats), टन (tonnes / MT), यूनिट (electricity kWh units), स्क्रैप (scrap), स्पंज आयरन (sponge iron / DRI), कोक (coke), रीहीटिंग फर्नेस (reheating furnace), गैस (natural gas Nm3), बिलेट्स (billets).
4. Output ONLY the plain transcription text. Do NOT wrap in quotes, explanations, or markdown codeblocks.`;

    case "en":
    default:
      return `You are a faithful verbatim audio speech-to-text transcriber for Indian industrial manufacturing.
Transcribe the provided audio faithfully in Indian English verbatim.
CRITICAL RULES:
1. Do NOT summarize, paraphrase, or omit any spoken content.
2. Preserve all exact numerical quantities, industrial units (MT, tonnes, kWh, units, Nm3), furnace heats, scrap, DRI sponge iron, coke, natural gas, and crude billets verbatim.
3. Output ONLY the plain transcription text. Do NOT wrap in quotes, explanations, or markdown codeblocks.`;
  }
}

/**
 * Executes server-side speech-to-text transcription via Google Gemini 3.5 Transcribe.
 */
export async function transcribeAudioWithGemini(
  options: GeminiTranscriptionOptions
): Promise<GeminiTranscriptionResult> {
  const normalizedLang = normalizeLanguageCode(options.language);
  const validation = validateAudioInput(options.audio, options.mimeType, options.filename);

  if (!validation.valid) {
    return {
      success: false,
      text: "",
      language: normalizedLang,
      modelUsed: options.model || "gemini-3.5-transcribe",
      provider: "gemini-3.5-transcribe",
      wordCount: 0,
      byteSize: validation.byteLength,
      error: validation.error,
    };
  }

  const base64Data = Buffer.isBuffer(options.audio)
    ? options.audio.toString("base64")
    : options.audio;

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no Gemini API key configured, return informative error and allow manual/browser fallback
  if (!apiKey) {
    return {
      success: false,
      text: "",
      language: normalizedLang,
      modelUsed: "gemini-3.5-transcribe",
      provider: "gemini-3.5-transcribe",
      wordCount: 0,
      byteSize: validation.byteLength,
      error:
        "GEMINI_API_KEY is not configured in .env.local. Please configure your Google AI Studio API key to enable Gemini 3.5 Transcribe. In the meantime, you can use Browser Speech Recognition or type your shift log directly.",
    };
  }

  const primaryModel = options.model || process.env.GEMINI_TRANSCRIBE_MODEL || "gemini-3.5-transcribe";
  const verbatimPrompt = getLanguageVerbatimInstruction(normalizedLang);

  // Attempt transcription with primary model, with fallback to gemini-3.8-flash if model not found
  const modelsToAttempt = [primaryModel];
  if (primaryModel !== "gemini-3.8-flash") {
    modelsToAttempt.push("gemini-3.8-flash");
  }

  let lastError: string | null = null;

  for (const modelName of modelsToAttempt) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: validation.cleanMime,
                  data: base64Data,
                },
              },
              {
                text: verbatimPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000), // 30-second timeout
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let parsedMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errJson = JSON.parse(errorBody);
          if (errJson.error?.message) {
            parsedMessage = errJson.error.message;
          }
        } catch {}

        // If 404 Model Not Found and we have a fallback model, try next
        if (response.status === 404 && modelsToAttempt.indexOf(modelName) < modelsToAttempt.length - 1) {
          lastError = parsedMessage;
          continue;
        }

        return {
          success: false,
          text: "",
          language: normalizedLang,
          modelUsed: modelName,
          provider: modelName === "gemini-3.5-transcribe" ? "gemini-3.5-transcribe" : "gemini-fallback",
          wordCount: 0,
          byteSize: validation.byteLength,
          error: `Gemini API transcription error: ${parsedMessage}`,
        };
      }

      const data = await response.json();
      let transcribedText = "";

      if (data.candidates && data.candidates.length > 0) {
        const parts = data.candidates[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.audioTranscription?.text) {
            transcribedText += part.audioTranscription.text;
          } else if (part.text) {
            transcribedText += part.text;
          }
        }
      }

      // Clean up markdown quotes or wrapping if present
      transcribedText = transcribedText
        .trim()
        .replace(/^```[a-z]*\s*/i, "")
        .replace(/\s*```$/, "")
        .replace(/^"|"$/g, "")
        .trim();

      if (!transcribedText) {
        return {
          success: false,
          text: "",
          language: normalizedLang,
          modelUsed: modelName,
          provider: modelName === "gemini-3.5-transcribe" ? "gemini-3.5-transcribe" : "gemini-fallback",
          wordCount: 0,
          byteSize: validation.byteLength,
          error: "Gemini transcribed audio but returned an empty text response. The audio may be silent or unclear.",
        };
      }

      const wordCount = transcribedText.split(/\s+/).filter(Boolean).length;

      return {
        success: true,
        text: transcribedText,
        language: normalizedLang,
        modelUsed: modelName,
        provider: modelName === "gemini-3.5-transcribe" ? "gemini-3.5-transcribe" : "gemini-fallback",
        wordCount,
        byteSize: validation.byteLength,
      };
    } catch (err: any) {
      lastError = err?.message || String(err);
      if (modelsToAttempt.indexOf(modelName) < modelsToAttempt.length - 1) {
        continue;
      }
    }
  }

  return {
    success: false,
    text: "",
    language: normalizedLang,
    modelUsed: primaryModel,
    provider: "gemini-3.5-transcribe",
    wordCount: 0,
    byteSize: validation.byteLength,
    error: `Gemini transcription network error: ${lastError || "Unknown connection failure"}`,
  };
}

