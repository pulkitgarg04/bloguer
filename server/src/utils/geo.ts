const geoCache = new Map<string, { country: string; ts: number }>();
const GEO_TTL_MS = 24 * 60 * 60 * 1000;

export async function lookupCountry(ip?: string): Promise<string | undefined> {
    if (!ip) return undefined;
    const key = ip;
    const now = Date.now();
    const hit = geoCache.get(key);
    if (hit && now - hit.ts < GEO_TTL_MS) return hit.country;
    try {
        const resp = await fetch(
            `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
            { method: 'GET' }
        );
        if (!resp.ok) return undefined;
        const data = (await resp.json()) as any;
        const country =
            data?.country_name || data?.country || data?.country_code;
        if (country) geoCache.set(key, { country, ts: now });
        return country;
    } catch {
        return undefined;
    }
}
