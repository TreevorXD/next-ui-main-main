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

export default async function handler(req, res) {
    try {
        // Run the cors middleware
        await NextCors(req, res, {
            // Options
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            origin: '*',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });

        await connect();
        let servers = await Server.find();

        // Step 1: Check for Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !apiKeys.includes(authHeader)) {
            // Step 2: If Authorization header is missing or invalid key, return unauthorized
            return res.status(401).send('Unauthorized');
        }

        // Step 3: Check rate limiting, unless the auth key is 'q5VLqNQBZu'
        const clientIP = req.headers['cf-connecting-ip'] as string; // Assuming you are using Cloudflare or a similar service

        if (authHeader !== 'q5VLqNQBZu') {
            const requestCount = requestLimits.get(clientIP) || 0;

            if (requestCount >= 5) {
                // Too many requests, send a webhook to Discord
                await sendDiscordWebhook(clientIP, authHeader);

                // Return a rate-limit exceeded response
                return res.status(429).send('Rate Limit Exceeded');
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

        return res.status(200).json(responseBody);
    } catch (error) {
        return res.status(500).send("Error in fetching posts" + error);
    }
}
