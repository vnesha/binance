import { NextRequest, NextResponse } from "next/server";
import { openOrder } from "@/hooks/useApiOrder";

export async function POST(request: NextRequest) {
  let symbol, markPrice, stopLoss;

  try {
    const body = await request.json();
    symbol = body.symbol;
    markPrice = body.markPrice;
    stopLoss = body.stopLoss;

    // Dodajemo logovanje sirovih podataka
    console.log("Raw body data: ", body);
  } catch (error) {
    const { searchParams } = new URL(request.nextUrl);
    symbol = searchParams.get('symbol');
    markPrice = searchParams.get('markPrice');
    stopLoss = searchParams.get('stopLoss');

    // Dodajemo logovanje sirovih podataka iz URL parametara
    console.log("Raw URL data: ", {symbol, markPrice, stopLoss});
  }

  // Provjeravamo da li symbol sadrži ".p" i ako da, izbacujemo ga
  if (symbol) {
    symbol = symbol.replace(/\.P$/, '');
  }

  if (!symbol || !markPrice || !stopLoss) {
    return NextResponse.json({ error: "Invalid parameters" });
  }

  try {
    const response = await openOrder({ symbol, markPrice, stopLoss });
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error processing order", fullError: error });
  }
}
