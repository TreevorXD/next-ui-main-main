import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import fetch from 'node-fetch';
config();

const serverDataPath = resolve(__dirname, '../../../../../db/serverData');
const archivedDataPath = resolve(__dirname, '../../../../../db/archiveData');
const authKeys = require('../../../authKeys'); // Update the path accordingly
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
        return new Response('Bad Request - p2w_id parameter is required', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Find the server in the current data
    const serverIndex = rows.findIndex((realm) => realm.p2w_id === p2wIdParam);

    if (serverIndex === -1) {
        return new Response('Server not found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    // Move the server to archivedData
    const archivedServer = rows.splice(serverIndex, 1)[0];
    const archivedData = require('../../../db/archivedData.js');

    archivedData.push(archivedServer);
    writeFileSync(archivedDataPath, `module.exports = ${JSON.stringify(archivedData, null, 2)};`);

    // Update the serverData file without the deleted server
    writeFileSync(serverDataPath, `module.exports = ${JSON.stringify(rows, null, 2)};`);

    return new Response('Server deleted and archived successfully', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
