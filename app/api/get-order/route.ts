import { NextRequest, NextResponse } from "next/server";
import { openOrder } from "@/hooks/useApiOrder";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.nextUrl);
//   const symbol = searchParams.get('symbol');
//   const quantity = searchParams.get('quantity');

//   if (!symbol || !quantity) {
//     return NextResponse.json({ error: "Invalid parameters" });
//   }

//   try {
//     const response = await openOrder({ symbol, quantity: Number(quantity) });
//     return NextResponse.json(response);
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({ error: "Error processing order", fullError: error });
//   }
// }

export async function POST(request: NextRequest) {
  let symbol, markPrice, stopLoss;

  try {
    // Pretpostavimo da je telo zahteva validan JSON
    const body = await request.json();
    symbol = body.symbol;
    markPrice = body.markPrice;
    stopLoss = body.stopLoss;
  } catch (error) {
    // Ako telo zahteva nije validan JSON, pretpostavimo da su parametri u zaglavlju
    const { searchParams } = new URL(request.nextUrl);
    symbol = searchParams.get('symbol');
    markPrice = searchParams.get('markPrice');
    stopLoss = searchParams.get('stopLoss');
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
