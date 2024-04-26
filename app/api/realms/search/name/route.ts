import { NextResponse } from "next/server";
import connect from "../../../../../db";
import Server from "../../../../../models/Servers";
import { apiKeys } from '../../../authKeys';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const requestLimits = new Map<string, number>();
const discordWebhookURL = process.env.WEBHOOK as string;

async function sendDiscordWebhook(ipAddress: string, authKey: string): Promise<void> {
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

export const GET = async (request: Request): Promise<Response> => {
    try {
        await connect();

        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !apiKeys.includes(authHeader)) {
            return new NextResponse('Unauthorized', {
                status: 401,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        const clientIP = request.headers.get('CF-Connecting-IP');
        const requestCount = requestLimits.get(clientIP) || 0;

        if (requestCount >= 5) {
            await sendDiscordWebhook(clientIP as string, authHeader);
            return new NextResponse('Rate Limit Exceeded', {
                status: 429,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        requestLimits.set(clientIP as string, requestCount + 1);

        setTimeout(() => {
            requestLimits.delete(clientIP as string);
        }, 10000);

        const url = new URL(request.url);
        const discordNameParam = url.searchParams.get('discord_name');

        // Create a filter object based on query parameters
        const filters: Record<string, any> = {};

        if (discordNameParam) {
            // Filter by discord_name if provided (case-insensitive and not exact match)
            filters.discord_name = { $regex: new RegExp(discordNameParam, 'i') };
        }

        // Add more logic for additional query parameters as needed

        // Fetch realms from MongoDB with applied filters
        const filteredRows = await Server.find(filters);

        const responseBody = JSON.stringify(filteredRows);

        return new NextResponse(responseBody, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse("Error in fetching posts" + error, { status: 500 });
    }
};
