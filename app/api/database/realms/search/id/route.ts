import { readFileSync } from 'fs';
import { resolve } from 'path';
import { apiKeys } from '../../../../authKeys';
import { config } from 'dotenv';
import fetch from 'node-fetch'; // Make sure to install this dependency
config();

const rows = require('../../../../../db/serverData');

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

    const url = new URL(request.url);
    const realmIdParam = url.searchParams.get('realm_id');

    if (!realmIdParam) {
        // If realm_id is not provided, return a bad request response
        return new Response('Bad Request - realm_id parameter is required', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Find the server data with the matching realm_id
    const foundRealm = rows.find((realm) => realm.realm_id === realmIdParam);

    if (!foundRealm) {
        // If no matching realm is found, return a not found response
        return new Response('Realm not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    const responseBody = JSON.stringify(foundRealm);

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
