
import { config } from 'dotenv';
import { apiKeys } from '../../../authKeys';
import fetch from 'node-fetch';
const realmsData = require('../../../../database/serverData'); // Assuming rows is an array of objects
config();

// Define a simple rate-limiting mechanism
const requestLimits = new Map();

// Discord Webhook URL
const discordWebhookURL = process.env.WEBHOOK;

async function sendDiscordWebhook(ipAddress, authKey) {
    const webhookData = {
        content: `Rate limit exceeded!\nIP Address: ${ipAddress}\nAuth Key: ${authKey}`,
    };

    await fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
    });
}

async function sendDiscordDeleteWebhook(deletedServer) {
    const webhookData = {
        content: `Server Deleted!\n${JSON.stringify(deletedServer, null, 2)}`,
    };

    await fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
    });
}

export async function DELETE(request) {
    // Step 1: Check for Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !apiKeys.includes(authHeader)) {
        // Step 2: If Authorization header is missing or invalid key, return unauthorized
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Step 3: Check rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP'); // Assuming you are using Cloudflare or a similar service

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
    }, 10000); // 10 seconds in milliseconds

    // If authorized and within rate limits, proceed with deleting the data
    const { p2w_id } = request.params; // Assuming you have an identifier in your route

    const index = realmsData.findIndex((realm) => realm.p2w_id === parseInt(p2w_id, 10));

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
