import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import fetch from 'node-fetch'; // Make sure to install this dependency
config();

const serverDataPath = resolve(__dirname, '../../../../../db/serverData.js');
const archiveDataPath = resolve(__dirname, '../../../../../db/archiveData.js');
const authKeys = require('../../../../devKeys'); // Update the path accordingly
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

export async function DELETE(request: Request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authKeys.apiKeys.includes(authHeader)) {
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
    const p2wIdParam = url.searchParams.get('p2w_id');

    if (!p2wIdParam) {
        // If p2w_id is not provided, return a bad request response
        return new Response('Bad Request - p2w_id parameter is required', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Find the server data with the matching p2w_id
    const foundIndex = rows.findIndex((realm) => realm.p2w_id === p2wIdParam);

    if (foundIndex === -1) {
        // If no matching realm is found, return a not found response
        return new Response('Server not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Remove the server from serverData
    const removedServer = rows.splice(foundIndex, 1)[0];

    // Add the removed server to archiveData
    const archiveData = require(archiveDataPath);
    archiveData.push(removedServer);
    writeFileSync(archiveDataPath, JSON.stringify(archiveData, null, 2));

    // Update serverData file
    writeFileSync(serverDataPath, `export const rows = ${JSON.stringify(rows, null, 2)};`);

    const responseBody = JSON.stringify({ message: 'Server deleted successfully' });

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
