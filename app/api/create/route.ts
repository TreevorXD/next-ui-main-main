// Import necessary modules and models
import ServerModel from "../../../models/Servers";
import { dbConnect } from "@/app/lib/db";
import fetch from "node-fetch"; // Import fetch for making HTTP requests
import { devKeys } from "../devKeys"; // Import devKeys array

// Define the function for handling POST requests to add items
export async function POST(request: Request) {
    try {
        const con = await dbConnect();
        // Parse the request body as JSON to extract the data
        const body = await request.json();
        
        // Extract authorization token from headers
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !isValidKey(authHeader)) {
            return new Response("Unauthorized", { status: 401 });
        }

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

        // Log the newly created server's information to a Discord webhook
        const webhookURL = "https://discord.com/api/webhooks/1233960326433869855/BOSciySRLVOAQJQ9do57N1SHkQyRDJTO9yYi3_L7PZwtuNfhaWLoCgLyeesqazUV5ZGK";
        await logToDiscordWebhook(webhookURL, newServer);

        // Respond with a success message and the added server object
        return new Response(JSON.stringify(newServer), { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle any errors
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

function isValidKey(key: string): boolean {
    // Check if the provided key exists in the devKeys array
    return devKeys.includes(key.replace("Bearer ", ""));
}

async function logToDiscordWebhook(webhookURL: string, newServer: any) {
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `New server created:\n${JSON.stringify(newServer)}`
            }),
        });

        if (!response.ok) {
            console.error(`Failed to log to Discord webhook: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error logging to Discord webhook:', error);
    }
}
