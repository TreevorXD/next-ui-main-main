// Import necessary modules and models
import ServerModel from "../../../models/Servers";
import { dbConnect } from "@/app/lib/db";

// Define the function for handling POST requests to add items
export async function POST(request: Request) {
    try {
        const con = await dbConnect();
        // Parse the request body as JSON to extract the data
        const body = await request.json();

        // Create a new server object using the provided data
        const newServer = new ServerModel({
            key: body.key,
            discord_name: body.discord_name,
            realm_code: body.realm_code,
            discord_invite: body.discord_invite,
            realm_id: body.realm_id,
            discord_server_id: body.discord_server_id,
            discord_owner_id: body.discord_owner_id,
            xbox_tag: body.xbox_tag,
            discord_tag: body.discord_tag,
            link: body.link,
            p2w_id: body.p2w_id,
            dangerous: body.dangerous
        });

        // Save the new server object to the database
        await newServer.save();

        // Respond with a success message and the added server object
        return new Response(JSON.stringify(newServer), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle any errors
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
