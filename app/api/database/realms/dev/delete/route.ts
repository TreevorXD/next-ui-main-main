import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
config();

// Define paths to data files
const serverDataPath = resolve(__dirname, '../../../../../db/serverData.js');
const archiveDataPath = resolve(__dirname, '../../../../../db/archiveData.js');

// Import API keys
const devKeys = require('../../../../devKeys');

// Track request limits
const requestLimits = new Map();

// Discord Webhook URL
const discordWebhookURL = process.env.WEBHOOK;

// Function to send Discord webhook
async function sendDiscordWebhook(ipAddress, devKey) {
    const webhookData = {
        content: `Rate limit exceeded!\nIP Address: ${ipAddress}\nAuth Key: ${devKey}`,
    };

    // Assume you have a function to send a Discord webhook here
    // For simplicity, I'm skipping the implementation
}

// DELETE route handler
export async function DELETE(request: Request) {
    // Get Authorization header from request
    const authHeader = request.headers.get('Authorization');

    // Check if Authorization header is missing or invalid
    if (!authHeader || !devKeys.apiKeys.includes(authHeader)) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Get client IP from request headers
    const clientIP = request.headers.get('CF-Connecting-IP');
    
    // Get request count for the client
    const requestCount = requestLimits.get(clientIP) || 0;

    // Check if rate limit exceeded
    if (requestCount >= 5) {
        // Send Discord webhook for rate limit exceeded
        await sendDiscordWebhook(clientIP, authHeader);

        return new Response('Rate Limit Exceeded', {
            status: 429,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Increment request count for the client
    requestLimits.set(clientIP, requestCount + 1);

    // Set a timeout to reset request count after 10 seconds
    setTimeout(() => {
        requestLimits.delete(clientIP);
    }, 10000);

    // Get p2w_id from request URL parameters
    const url = new URL(request.url);
    const p2wIdParam = url.searchParams.get('p2w_id');

    // Check if p2w_id parameter is missing
    if (!p2wIdParam) {
        return new Response('Bad Request - p2w_id parameter is required', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Read server data from file
    const serverData = require(serverDataPath);
    
    // Find the server data with the matching p2w_id
    const foundIndex = serverData.rows.findIndex((realm) => realm.p2w_id === p2wIdParam);

    // Check if server with given p2w_id is not found
    if (foundIndex === -1) {
        return new Response('Server not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Remove the server from the serverData array
    const removedServer = serverData.rows.splice(foundIndex, 1)[0];

    // Read archive data from file
    const archiveData = require(archiveDataPath);

    // Add the removed server to the archiveData array
    archiveData.push(removedServer);

    // Write the updated archiveData to file
    writeFileSync(archiveDataPath, JSON.stringify(archiveData, null, 2));

    // Update the serverData file
    writeFileSync(serverDataPath, `export const rows = ${JSON.stringify(serverData.rows, null, 2)}`);

    // Respond with success message
    const responseBody = JSON.stringify({ message: 'Server deleted successfully' });

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
