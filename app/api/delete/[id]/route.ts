// route.ts
import ServerModel from "../../../../models/Servers";
import { dbConnect, disconnect } from "@/app/lib/db";
import fetch from "node-fetch"; // Import fetch for making HTTP requests

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const con = await dbConnect();
    const { id } = params;

    // Get the server information before deleting it
    const serverToDelete = await ServerModel.findById(id);

    // Assuming you're using a database, you can perform a delete operation here
    await ServerModel.findByIdAndDelete(id);

    // Log the deleted server's ID and server information to a Discord webhook
    const webhookURL = "https://discord.com/api/webhooks/1233959505394536500/saZx6CgA_GdaCI5l37FqOezCz9bTRPSTCIoXzmjQn6gMcHPNIYpal0750lQGy8Y6XA67";
    await logToDiscordWebhook(webhookURL, id, serverToDelete);

    // Respond with a JSON object containing the id parameter
    return Response.json({ id });
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
