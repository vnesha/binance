import { NextRequest, NextResponse } from "next/server";
import { openOrder } from "@/hooks/useTestOpenOreder";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl);
  const symbol = searchParams.get('symbol');
  const quantity = searchParams.get('quantity');

  if (!symbol || !quantity) {
    return NextResponse.json({ error: "Invalid parameters" });
  }

  try {
    const response = await openOrder({ symbol, quantity: Number(quantity) });
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error processing order", fullError: error });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl);
  const symbol = searchParams.get('symbol');
  const quantity = searchParams.get('quantity');

  if (!symbol || !quantity) {
    return NextResponse.json({ error: "Invalid parameters" });
  }

  try {
    const response = await openOrder({ symbol, quantity: Number(quantity) });
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error processing order", fullError: error });
  }
}