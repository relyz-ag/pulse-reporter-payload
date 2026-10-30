#!/usr/bin/env node
import path from 'node:path';
import { writeManifest } from './snapshot.js';
const USAGE = 'Usage: pulse-reporter snapshot [--out src/pulse-manifest.json]';
const [command, ...rest] = process.argv.slice(2);
if (command !== 'snapshot') {
    console.error(USAGE);
    process.exit(1);
}
const outIndex = rest.indexOf('--out');
const out = path.resolve(outIndex >= 0 ? rest[outIndex + 1] : 'src/pulse-manifest.json');
try {
    const manifest = writeManifest(process.cwd(), out);
    console.log(`✓ Pulse manifest: payload ${manifest.platform.version}, ${manifest.packages.length} packages → ${path.relative(process.cwd(), out)}`);
}
catch (e) {
    console.error(`✗ pulse-reporter: ${e.message}`);
    process.exit(1);
}
