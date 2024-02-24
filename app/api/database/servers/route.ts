import { readFileSync } from 'fs';
import { resolve } from 'path';
import { apiKeys } from '../../authKeys'; // Update the path accordingly

const rows = require('../../db/serverData'); // Assuming rows is an array of objects

// Define a simple rate-limiting mechanism
const requestLimits = new Map();

// Discord Webhook URL
const discordWebhookURL = 'https://discord.com/api/webhooks/1209601926287589428/zxf69a4AfYA2QnS8ADfwBk9fAfvt0YBFsxwen-aQsW_oAeLO2142XpLLuulVhUC98_sr';

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

export async function GET(request: Request) {
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

    // If authorized and within rate limits, proceed with fetching the data
    const responseBody = JSON.stringify(rows);

    return new Response(responseBody, {
        status: 200, // Specify the desired HTTP status code (e.g., 200 for OK)
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
