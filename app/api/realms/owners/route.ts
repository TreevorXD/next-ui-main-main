import { NextResponse } from "next/server";
import connect from "../../../../db";
import Server from "../../../../models/Servers";
import { apiKeys } from '../../authKeys';
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

        // Fetch all unique discord_owner_ids from MongoDB
        const discordOwnerIds = await Server.distinct("discord_owner_id");

        const responseBody = JSON.stringify(discordOwnerIds);

        return new NextResponse(responseBody, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse("Error in processing request: " + error.message, { status: 500 });
    }
};