// Import necessary modules and models
import ServerModel from "../../../models/Servers";
import { dbConnect } from "@/app/lib/db";
import fetch from "node-fetch"; // Import fetch for making HTTP requests
import { devKeys } from "../devKeys"; // Import devKeys array

// Define the function for handling POST requests to update server values
export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const con = await dbConnect();
        // Parse the request body as JSON to extract the data
        const body = await request.json();
        
        // Extract authorization token from headers
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !isValidKey(authHeader)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Find the existing server based on the provided ID
        const existingServer = await ServerModel.findById(id);

        // Check if the server exists
        if (!existingServer) {
            return new Response("Server not found", { status: 404 });
        }

        // Update the existing server object with the provided data
        Object.assign(existingServer, body);

        // Save the updated server object to the database
        await existingServer.save();

        // Log the updated server's information to a Discord webhook
        const webhookURL = "https://discord.com/api/webhooks/1233960326433869855/BOSciySRLVOAQJQ9do57N1SHkQyRDJTO9yYi3_L7PZwtuNfhaWLoCgLyeesqazUV5ZGK";
        await logToDiscordWebhook(webhookURL, existingServer);

        // Respond with a success message and the updated server object
        return new Response(JSON.stringify(existingServer), { status: 200, headers: { "Content-Type": "application/json" } });
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

async function logToDiscordWebhook(webhookURL: string, updatedServer: any) {
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Server updated:\n${JSON.stringify(updatedServer)}`
            }),
        });

        if (!response.ok) {
            console.error(`Failed to log to Discord webhook: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error logging to Discord webhook:', error);
    }
}
