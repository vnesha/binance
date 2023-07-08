import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();

    const updateData: Record<string, unknown> = {};

    ['riskPercent', 'riskRewardRatio', 'openPositionLimit', 'autoTrading', 'tralingTP', 'tralingTPLimit', 'tralingTPDeviation', 'maxProfit'].forEach(key => {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    });

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

      // Update the existing object in the database
      await collection.updateOne(
        { _id: ObjectId.createFromHexString("64a5bd6b70b55b8804ca7c93") },
        { $set: updateData }
      );

      // Close the database connection
      await client.close();

      return NextResponse.json(
        { message: "Settings updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error updating settings", fullError: error },
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

