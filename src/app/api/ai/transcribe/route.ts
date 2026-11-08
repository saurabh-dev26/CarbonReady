import { NextRequest, NextResponse } from "next/server";
import {
  transcribeAudioWithGemini,
  validateAudioInput,
} from "@/lib/ai/gemini-transcribe";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (Audio File Upload or MediaRecorder Blob)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const language = (formData.get("language") as string) || "en";
      const model = (formData.get("model") as string) || undefined;

      if (!file) {
        return NextResponse.json(
          { error: "No audio file provided in form data." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeType = file.type || "audio/webm";
      const filename = file.name;

      const result = await transcribeAudioWithGemini({
        audio: buffer,
        mimeType,
        language: language as any,
        filename,
        model,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Gemini speech transcription failed." },
          { status: 422 }
        );
      }

      return NextResponse.json(result);
    }

    // 2. Application JSON (Base64 audio payload)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { audioBase64, mimeType, language = "en", filename, model } = body;

      if (!audioBase64 || typeof audioBase64 !== "string") {
        return NextResponse.json(
          { error: "Missing or invalid 'audioBase64' string in request body." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(audioBase64, "base64");

      const result = await transcribeAudioWithGemini({
        audio: buffer,
        mimeType: mimeType || "audio/webm",
        language,
        filename,
        model,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Gemini speech transcription failed." },
          { status: 422 }
        );
      }

      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        error:
          "Invalid Content-Type. Expected multipart/form-data or application/json.",
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("API /api/ai/transcribe exception:", message);
    return NextResponse.json(
      { error: "Internal server error during speech transcription." },
      { status: 500 }
    );
  }
}

