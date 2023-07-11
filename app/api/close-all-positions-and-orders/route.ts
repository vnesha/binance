import { NextRequest, NextResponse } from "next/server";
import { getOpenOrders } from "@/util/apiData";
import { closeAllPositionsAndOrders } from "@/util/closeAllPositionsAndOrders";
import { CombinedDataType } from "@/types/types";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    try {
      // Connect to the database
      const MONGODB_URI = process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
      }
      const client = new MongoClient(MONGODB_URI);

      await client.connect();
      const database = client.db("BinanceDB");
      const collection = database.collection("Settings");

      // Fetch the settings from the database
      const settings = await collection.findOne({ _id: ObjectId.createFromHexString("64a5bd6b70b55b8804ca7c93") });

      // Close the database connection
      await client.close();

      if (!settings) {
        throw new Error("Settings not found");
      }

      // Extract excluded symbols from settings
      const excludedSymbols = settings.excludedSymbols;

      // Get all open positions
      const allPositions = await getOpenOrders();
      
      // Filter positions with a quantity different from 0 and not included in excluded symbols
      const openPositions = allPositions.filter((position: CombinedDataType) => Number(position.positionAmt) !== 0 && !excludedSymbols.includes(position.symbol));
      
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
