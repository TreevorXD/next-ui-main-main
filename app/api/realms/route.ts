import { NextResponse } from "next/server";
import connect from "../../../db";
import Server from "../../../models/Servers";
import { readFileSync } from 'fs';
import { resolve } from 'path';
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

async function sendDiscordWebhook(ipAddress: string): Promise<void> {
    const webhookData: WebhookData = {
        content: `Rate limit exceeded!\nIP Address: ${ipAddress}`,
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

        // Step 3: Check rate limiting
        const clientIP = request.headers.get('CF-Connecting-IP') as string; // Assuming you are using Cloudflare or a similar service

        const requestCount = requestLimits.get(clientIP) || 0;

        if (requestCount >= 5) {
            // Too many requests, send a webhook to Discord
            await sendDiscordWebhook(clientIP);

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

        const responseBody = JSON.stringify(servers);

        // Return response with CORS headers allowing credentials
        return new NextResponse(responseBody, {
            status: 200,
        });

    } catch (error) {
        return new NextResponse("Error in fetching posts" + error, { status: 500 });
    }
};
