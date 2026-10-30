import type { Plugin } from 'payload';
import type { ManifestInput } from './types.js';
export type PulseReporterOptions = {
    manifest: ManifestInput;
    path?: string;
    token?: string;
};
export declare const pulseReporter: (options: PulseReporterOptions) => Plugin;
export { buildReport } from './report.js';
export type { Manifest, ManifestInput, Report, ReportPackage } from './types.js';
