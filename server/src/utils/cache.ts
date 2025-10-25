import Redis from 'ioredis';

const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const redis = new Redis(url, {
    maxRetriesPerRequest: 3,
});

export async function getCache(key: string): Promise<string | null> {
    try {
        return await redis.get(key);
    } catch {
        return null;
    }
}

export async function setCache(
    key: string,
    value: string,
    ttlSeconds?: number
): Promise<void> {
    try {
        if (ttlSeconds && ttlSeconds > 0) {
            await redis.set(key, value, 'EX', ttlSeconds);
        } else {
            await redis.set(key, value);
        }
    } catch {}
}

export async function delCache(key: string): Promise<void> {
    try {
        await redis.del(key);
    } catch {}
}

export async function delPattern(pattern: string): Promise<void> {
    try {
        let cursor = '0';
        do {
            const [next, keys] = await redis.scan(
                cursor,
                'MATCH',
                pattern,
                'COUNT',
                100
            );
            cursor = next;
            if (keys.length) await redis.del(...keys);
        } while (cursor !== '0');
    } catch {}
}

export default redis;
