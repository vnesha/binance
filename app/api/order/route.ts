import { NextResponse } from "next/server";
import { openOrder } from "@/app/hooks/useTestOpenOreder";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const quantity = searchParams.get('quantity');
  
    if (!symbol || !quantity) {
      return NextResponse.json({ error: "Invalid parameters" });
    }
  
    try {
        const response = await openOrder({ symbol, quantity: Number(quantity) });
        return NextResponse.json(response);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error processing order" });
      }
    }
  