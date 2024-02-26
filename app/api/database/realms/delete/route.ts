import { readFileSync } from 'fs';
import { resolve } from 'path';
import { apiKeys } from '../../../authKeys';
import { config } from 'dotenv';

import fetch from 'node-fetch';

config();

const rows = require('../../../../db/serverData');

const requestLimits = new Map();

const discordWebhookURL = process.env.WEBHOOK;

async function sendDiscordWebhook(content: string) {
    const webhookData = {
        content,
    };

    await fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
    });
}

export async function handleRequest(request: Request): Promise<Response> {
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
        await sendDiscordWebhook(`Rate limit exceeded!\nIP Address: ${clientIP}\nAuth Key: ${authHeader}`);
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

    if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const p2w_id = url.searchParams.get('p2w_id');

        if (p2w_id) {
            // Find the index of the server with the specified p2w_id
            const index = rows.findIndex((server) => server.p2w_id === p2w_id);

            if (index !== -1) {
                // Server found, delete it
                const deletedServer = rows.splice(index, 1)[0];

                // Send deleted server information to Discord webhook
                await sendDiscordWebhook(`Server deleted!\n${JSON.stringify(deletedServer, null, 2)}`);

                return new Response('Server deleted', {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });
            } else {
                return new Response('Server not found', {
                    status: 404,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });
            }
        } else {
            return new Response('Missing p2w_id parameter', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }
    }

    const responseBody = JSON.stringify(rows);

    return new Response(responseBody, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
