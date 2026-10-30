import { createHash, timingSafeEqual } from 'node:crypto';
import { REPORTER_NAME, REPORTER_VERSION } from './version.js';
export function buildReport(manifest, now = new Date()) {
    return {
        contractVersion: 1,
        generatedAt: now.toISOString(),
        reporter: { name: REPORTER_NAME, version: REPORTER_VERSION },
        runtime: { name: 'node', version: process.version.replace(/^v/, '') },
        platform: manifest.platform,
        packages: manifest.packages,
    };
}
// Constant-time comparison; hashing equalises lengths.
export function tokenMatches(expected, provided) {
    const a = createHash('sha256').update(expected).digest();
    const b = createHash('sha256').update(provided).digest();
    return timingSafeEqual(a, b);
}
export function bearerToken(authorization) {
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : null;
}
// 404 without a configured token, 401 on a missing/wrong token, 200 otherwise.
export function handleReportRequest(args) {
    if (!args.token)
        return Response.json({ error: 'Not found' }, { status: 404 });
    const provided = bearerToken(args.authorization);
    if (!provided || !tokenMatches(args.token, provided)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json(buildReport(args.manifest), {
        headers: { 'Cache-Control': 'no-store' },
    });
}
