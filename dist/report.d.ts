import type { Manifest, Report } from './types.js';
export declare function buildReport(manifest: Manifest, now?: Date): Report;
export declare function tokenMatches(expected: string, provided: string): boolean;
export declare function bearerToken(authorization: string | null | undefined): string | null;
export declare function handleReportRequest(args: {
    authorization: string | null | undefined;
    token: string | undefined;
    manifest: Manifest;
}): Response;
