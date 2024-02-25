import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
config();

// Importing the rows array from serverData.js
const rows = require('../../../../../db/serverData');

const serverDataPath = resolve(__dirname, '../../../../../db/serverData.js');
const archiveDataPath = resolve(__dirname, '../../../../../db/archiveData.js');
const authKeys = require('../../../../devKeys');
const requestLimits = new Map();
const discordWebhookURL = process.env.WEBHOOK;

async function sendDiscordWebhook(ipAddress, authKey) {
    const webhookData = {
        content: `Rate limit exceeded!\nIP Address: ${ipAddress}\nAuth Key: ${authKey}`,
    };

    // Assume you have a function to send a Discord webhook here
    // For simplicity, I'm skipping the implementation
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
        return new Response('Server not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    const removedServer = rows.splice(foundIndex, 1)[0];

    const archiveData = require(archiveDataPath);
    archiveData.push(removedServer);
    writeFileSync(archiveDataPath, JSON.stringify(archiveData, null, 2));

    // Update serverData file
    writeFileSync(serverDataPath, `export const rows = ${JSON.stringify(rows, null, 2)}`);

    const responseBody = JSON.stringify({ message: 'Server deleted successfully' });

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
