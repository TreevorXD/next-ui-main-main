import { config } from 'dotenv';
import { apiKeys } from '../../../authKeys';
import fetch from 'node-fetch';
const realmsData = require('../../../../database/serverData');
config();

// Define a simple rate-limiting mechanism
const requestLimits = new Map();

// Discord Webhook URL
const discordWebhookURL = process.env.WEBHOOK;

async function sendDiscordWebhook(ipAddress, authKey) {
    const webhookData = {
        content: `Rate limit exceeded!\nIP Address: ${ipAddress}\nAuth Key: ${authKey}`,
    };

    try {
        await fetch(discordWebhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
        });
    } catch (error) {
        console.error('Error sending webhook:', error);
        // Handle the error accordingly (e.g., log it, return an error response, etc.)
    }
}

async function sendDiscordDeleteWebhook(deletedServer) {
    const webhookData = {
        content: `Server Deleted!\n${JSON.stringify(deletedServer, null, 2)}`,
    };

    try {
        await fetch(discordWebhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
        });
    } catch (error) {
        console.error('Error sending webhook:', error);
        // Handle the error accordingly (e.g., log it, return an error response, etc.)
    }
}

export async function DELETE(request) {
    // Step 1: Check for Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !apiKeys.includes(authHeader)) {
        // Step 2: If Authorization header is missing or invalid key, return unauthorized
        return new Response('Unauthorized', {
            status: 403,  // Change to 403 for unauthorized
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Step 3: Check rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP');

    const requestCount = requestLimits.get(clientIP) || 0;

    if (requestCount >= 5) {
        // Too many requests, send a webhook to Discord
        await sendDiscordWebhook(clientIP, authHeader);

        // Return a rate-limit exceeded response
        return new Response('Rate Limit Exceeded', {
            status: 429,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Update the request count for the current IP
    requestLimits.set(clientIP, requestCount + 1);

    // Reset the request count after 10 seconds
    setTimeout(() => {
        requestLimits.delete(clientIP);
    }, 10000);

    // If authorized and within rate limits, proceed with deleting the data
    const { p2w_id } = request.params;

    const parsedP2WId = parseInt(p2w_id, 10);

    if (isNaN(parsedP2WId)) {
        return new Response('Invalid p2w_id', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    const index = realmsData.findIndex((realm) => realm.p2w_id === parsedP2WId);

    if (index !== -1) {
        const deletedServer = realmsData.splice(index, 1)[0];
        await sendDiscordDeleteWebhook(deletedServer);
        return new Response('Server Deleted Successfully', {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } else {
        return new Response('Server Not Found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}
