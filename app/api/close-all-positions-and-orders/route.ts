import { NextRequest, NextResponse } from "next/server";
import { closeAllPositionsAndOrders } from "@/hooks/useCloseAllPositionsAndOrdes";
import { CombinedDataType } from "@/types/types";
import { getOpenOrders } from "@/util/apiData";

export async function POST(request: NextRequest) {
    try {
      // Dohvatite sve otvorene pozicije
      let allPositions;
      try {
        allPositions = await getOpenOrders();
      } catch (error) {
        console.error(error);
        throw error;
      }
  
      // Filtrirajte pozicije sa količinom različitom od 0
      const openPositions = allPositions.filter((position: CombinedDataType) => position.positionAmt !== 0);
  
      // Pozovite closeAllPositionsAndOrders sa otvorenim pozicijama
      const response = await closeAllPositionsAndOrders(openPositions);
      
      return NextResponse.json(response);
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: "Error closing all positions and orders", fullError: error });
    }
  }
  
  
