import { NextRequest, NextResponse } from "next/server";
import { getOpenOrders } from "@/util/apiData";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    try {
      const openOrders = await getOpenOrders();
      const openPositionOrders = openOrders.filter(
        (order: any) => parseFloat(order.positionAmt) !== 0.0
      );

      // Return the settings
      return NextResponse.json(openPositionOrders);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error fetching settings", fullError: error },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
