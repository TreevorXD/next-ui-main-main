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
        const realmIdParam = url.searchParams.get('realm_id');

        if (!realmIdParam) {
            // If realm_id is not provided, return a bad request response
            return new NextResponse('Bad Request - realm_id parameter is required', {
                status: 400,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        // Find the server data with the matching realm_id from MongoDB
        const foundRealm = await Server.findOne({ realm_id: realmIdParam });

        if (!foundRealm) {
            // If no matching realm is found, return a not found response
            return new NextResponse('Realm not found', {
                status: 404,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        const responseBody = JSON.stringify(foundRealm);

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
