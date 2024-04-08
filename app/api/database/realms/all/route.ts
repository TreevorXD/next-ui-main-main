import { NextResponse } from "next/server";
import connect from "../../../../../db";
import Server from "../../../../../models/Servers";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { apiKeys } from '../../../authKeys'; // Update the path accordingly
import { config } from 'dotenv';
import fetch from 'node-fetch';
import NextCors from 'nextjs-cors';

interface WebhookData {
    content: string;
}

// Define a simple rate-limiting mechanism
const requestLimits = new Map<string, number>();

// Discord Webhook URL
const discordWebhookURL = process.env.WEBHOOK as string;

async function sendDiscordWebhook(ipAddress: string, authKey: string): Promise<void> {
    const webhookData: WebhookData = {
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

export const GET = async (request: Request): Promise<Response> => {
    try {
        await connect();
        let servers = await Server.find();

        // Step 1: Check for Authorization header
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !apiKeys.includes(authHeader)) {
            // Step 2: If Authorization header is missing or invalid key, return unauthorized
            return new NextResponse('Unauthorized', {
                status: 401,
                
            });
        }

        // Step 3: Check rate limiting, unless the auth key is 'q5VLqNQBZu'
        const clientIP = request.headers.get('CF-Connecting-IP') as string; // Assuming you are using Cloudflare or a similar service

        if (authHeader !== 'q5VLqNQBZu') {
            const requestCount = requestLimits.get(clientIP) || 0;

            if (requestCount >= 5) {
                // Too many requests, send a webhook to Discord
                await sendDiscordWebhook(clientIP, authHeader);

                // Return a rate-limit exceeded response
                return new NextResponse('Rate Limit Exceeded', {
                    status: 429,
                });
            }

            // Update the request count for the current IP
            requestLimits.set(clientIP, requestCount + 1);

            // Reset the request count after 10 seconds
            setTimeout(() => {
                requestLimits.delete(clientIP);
            }, 10000); // 10 seconds in milliseconds
        }

        // If authorized and within rate limits, proceed with fetching the data
        servers = servers.map(server => {
            // Remove the _id field from each server
            const { _id, ...serverWithoutId } = server.toObject();
            return serverWithoutId;
        });

        const responseBody = JSON.stringify(servers);

        // Return response with CORS headers allowing credentials
return new NextResponse(responseBody, {
    status: 200,
});

    } catch (error) {
        return new NextResponse("Error in fetching posts" + error, { status: 500 });
    }
};
