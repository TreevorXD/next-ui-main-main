import { readFileSync } from 'fs';
import { resolve } from 'path';

const rows = require('../../db/serverData'); // Assuming rows is an array of objects

export async function GET(request: Request) {
    // Step 1: Read the authorization keys from the JSON file
    const authKeysPath = resolve(__dirname, 'auth-keys.json');
    const authKeysData = JSON.parse(readFileSync(authKeysPath, 'utf-8'));
    const authKeys = authKeysData.keys;

    // Step 2: Check if the Authorization header is present in the request and matches any of the keys
    const authorizationHeader = request.headers.get('Authorization');

    if (!authorizationHeader || !authKeys.includes(authorizationHeader.replace('Bearer ', ''))) {
        // Unauthorized access
        return new Response('Unauthorized', { status: 401 });
    }

    // Step 3: If authorized, proceed with fetching the data
    const responseBody = JSON.stringify(rows);

    return new Response(responseBody, {
        status: 200, // Specify the desired HTTP status code (e.g., 200 for OK)
        headers: {
            'Content-Type': 'application/json',
        },
    });
}