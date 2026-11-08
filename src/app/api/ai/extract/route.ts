import { NextRequest, NextResponse } from "next/server";
import { extractShopfloorTelemetryWithNugen } from "@/lib/ai/nugen-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, languageHint, source, transcriptionConfidence } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'text' in request body." }, { status: 400 });
    }

    const result = await extractShopfloorTelemetryWithNugen(text, languageHint, {
      source,
      transcriptionConfidence,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("API /api/ai/extract error:", err);
    return NextResponse.json(
      { error: "Internal server error during structured telemetry extraction." },
      { status: 500 }
    );
  }
}
