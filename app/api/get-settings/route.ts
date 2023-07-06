import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
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

      // Return the settings
      return NextResponse.json(settings);
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
