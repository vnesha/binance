import { NextRequest, NextResponse } from "next/server";
import { getOpenOrders } from "@/util/apiData";
import { closeAllPositionsAndOrders } from "@/util/closeAllPositionsAndOrders";
import { CombinedDataType } from "@/types/types";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      // Get all open positions
      const allPositions = await getOpenOrders();
      
      // Filter positions with a quantity different from 0
      const openPositions = allPositions.filter((position: CombinedDataType) => Number(position.positionAmt) !== 0);
      
      console.log("Filtered Positions:", openPositions);

      // Call closeAllPositionsAndOrders with open positions
      await closeAllPositionsAndOrders(openPositions);

      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: "Error closing all positions and orders", fullError: error });
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
