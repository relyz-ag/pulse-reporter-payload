import type { Manifest, ManifestInput } from './types.js';
export declare function findInstalledVersion(projectDir: string, name: string): string | null;
export declare function createManifest(projectDir: string): Manifest;
export declare function assertManifest(input: ManifestInput): Manifest;
export declare function writeManifest(projectDir: string, outFile: string): Manifest;
