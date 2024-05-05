import { dbConnect, disconnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import ServerModel from "../../../models/Servers"; // Import your Server model
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const con = await dbConnect();
    console.log("Connected to the database");

    // Fetch all servers from the "servers" collection
    const servers = await ServerModel.find();

    // Return the fetched servers as a JSON response
    return new NextResponse(JSON.stringify(servers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Error fetching data", { status: 500 });
  } finally {
    // Ensure to disconnect from the database after fetching data
    disconnect();
    console.log("Disconnected from the database");
  }
}
