// main.ts
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { rateLimit } from '../../ratelimiter';

export async function GET(request: Request) {
    // Step 1: Read the authorization keys from the JSON file
    const authKeysPath = resolve(__dirname, '../../auth-keys.json');
    const authKeysData = JSON.parse(readFileSync(authKeysPath, 'utf-8'));
    const authKeys = authKeysData.keys;

    // Step 2: Check if the Authorization header is present in the request and matches any of the keys
    const authorizationHeader = request.headers.get('Authorization');

    if (!authorizationHeader || !authKeys.includes(authorizationHeader.replace('Bearer ', ''))) {
        // Unauthorized access
        return new Response('Unauthorized Request', { status: 401 });
    }

    // Step 3: Implement rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || request.headers.get('Remote-Addr');

    // Step 4: If authorized and not rate-limited, proceed with fetching the data
    const responseBody ='https://assets.shop.loblaws.ca/products/20177278001/b1/en/open/20177278001_open_a01_@2.png'

    return new Response(responseBody, {
        status: 200, // Specify the desired HTTP status code (e.g., 200 for OK)
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

// Function to log to Discord webhook
async function logToDiscord(message: string) {
    const discordWebhookURL = 'https://discord.com/api/webhooks/1209601922890342412/ArqbTUiamawHv4C3lcGVsqzIwfe5_9saH1vBNQMIgBs7wS8fusq4LSQ1PEDDx2MhCGHs';
    const discordPayload = {
        content: message,
    };

    await fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
    });
}
