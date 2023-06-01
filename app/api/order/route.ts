import { NextResponse } from "next/server";
import { openOrder } from "@/app/hooks/useTestOpenOreder";

export async function GET(request: Response) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const quantity = searchParams.get('quantity');
  
    if (!symbol || !quantity) {
      return NextResponse.json({ error: "Invalid parameters" });
    }
  
    try {
      // Pozivanje openOrder funkcije sa podacima iz zahteva
      const response = await openOrder({ symbol, quantity: Number(quantity) });
  
      // Vraćanje odgovora od openOrder funkcije kao JSON
      return NextResponse.json(response);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error processing order" });
    }
  }