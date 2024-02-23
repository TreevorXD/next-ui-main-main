// ratelimiter.ts
const requestInfo = new Map<string, { count: number, timestamp: number }>();

export function rateLimit(clientIP: string): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (!requestInfo.has(clientIP) || requestInfo.get(clientIP).timestamp + 10 < currentTimestamp) {
        // Reset the request count if it's a new interval
        requestInfo.set(clientIP, { count: 1, timestamp: currentTimestamp });
        return true;
    } else {
        // Increment the request count for the current IP
        const requestCount = requestInfo.get(clientIP).count;

        if (requestCount >= 5) {
            // Too many requests
            return false;
        }

        requestInfo.set(clientIP, { count: requestCount + 1, timestamp: currentTimestamp });
        return true;
    }
}
