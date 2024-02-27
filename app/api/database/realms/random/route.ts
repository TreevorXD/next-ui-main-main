import { readFileSync } from 'fs';
import { resolve } from 'path';
import { apiKeys } from '../../../authKeys';
import { config } from 'dotenv';
import fetch from 'node-fetch';
config();

const rows = require('../../../../database/serverData');

const requestLimits = new Map();
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

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !apiKeys.includes(authHeader)) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    const clientIP = request.headers.get('CF-Connecting-IP');
    const requestCount = requestLimits.get(clientIP) || 0;

    if (requestCount >= 5) {
        await sendDiscordWebhook(clientIP, authHeader);
        return new Response('Rate Limit Exceeded', {
            status: 429,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    requestLimits.set(clientIP, requestCount + 1);

    setTimeout(() => {
        requestLimits.delete(clientIP);
    }, 10000);

    // Get a random realm from the rows
    const randomIndex = Math.floor(Math.random() * rows.length);
    const randomRealm = rows[randomIndex];

    const responseBody = JSON.stringify(randomRealm);

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
