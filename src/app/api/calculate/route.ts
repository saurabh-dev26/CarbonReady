import { NextRequest, NextResponse } from "next/server";
import { calculateCbamEmissions, CalculationInput } from "@/lib/engine/cbam-calculator";

export async function POST(req: NextRequest) {
  try {
    const body: CalculationInput = await req.json();
    const result = await calculateCbamEmissions(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("API /api/calculate error:", err);
    return NextResponse.json(
      { error: "Internal server error during CBAM emissions calculation." },
      { status: 500 }
    );
  }
}

