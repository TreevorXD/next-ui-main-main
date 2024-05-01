import ArchiveModel from "../../../../models/Archive";
import ServerModel from "../../../../models/Servers";
import { dbConnect, disconnect } from "@/app/lib/db";
import fetch from "node-fetch"; // Import fetch for making HTTP requests
import KeyModel from "../../../../models/Keys";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const con = await dbConnect();
    const { id } = params;

    // Extract authorization token from headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !isValidKey(authHeader)) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Get the server information before deleting it
    const serverToDelete = await ServerModel.findById(id);

    // Assuming you're using a database, you can perform a delete operation here
    await ServerModel.findByIdAndDelete(id);

    // Log the deleted server's ID and server information to a Discord webhook
    const webhookURL = "https://discord.com/api/webhooks/1233959505394536500/saZx6CgA_GdaCI5l37FqOezCz9bTRPSTCIoXzmjQn6gMcHPNIYpal0750lQGy8Y6XA67";
    await logToDiscordWebhook(webhookURL, id, serverToDelete);

    // Add the deleted server information to the archive database collection

    // Respond with a JSON object containing the id parameter
    return new Response(JSON.stringify({ id }), { status: 200, headers: { "Content-Type": "application/json" } });
}

async function isValidKey(key: string): Promise<boolean> {
    try {
        // Query the database collection for the key
        const keyDocument = await KeyModel.findOne({ key: key.replace("Bearer ", "") }).exec();
        
        // If the key document exists, return true, else return false
        return !!keyDocument;
    } catch (error) {
        console.error('Error validating key:', error);
        return false; // Return false in case of any error
    }
}

async function logToDiscordWebhook(webhookURL: string, deletedServerId: string, serverInfo: any) {
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Deleted server ID: ${deletedServerId}\nServer Info: ${JSON.stringify(serverInfo)}`
            }),
        });

        if (!response.ok) {
            console.error(`Failed to log to Discord webhook: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error logging to Discord webhook:', error);
    }
}
