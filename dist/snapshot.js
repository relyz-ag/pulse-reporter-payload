import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
// Walks up from projectDir like Node's resolution (covers hoisted monorepos).
export function findInstalledVersion(projectDir, name) {
    let dir = path.resolve(projectDir);
    for (;;) {
        const file = path.join(dir, 'node_modules', name, 'package.json');
        if (existsSync(file))
            return readJson(file).version ?? null;
        const parent = path.dirname(dir);
        if (parent === dir)
            return null;
        dir = parent;
    }
}
export function createManifest(projectDir) {
    const pkg = readJson(path.join(projectDir, 'package.json'));
    const names = Object.keys(pkg.dependencies ?? {}).sort();
    const missing = [];
    const packages = names.flatMap((name) => {
        const version = findInstalledVersion(projectDir, name);
        if (!version) {
            missing.push(name);
            return [];
        }
        return [{ ecosystem: 'npm', name, version }];
    });
    if (missing.length) {
        throw new Error(`Not installed: ${missing.join(', ')}. Run your package manager's install first.`);
    }
    const payload = packages.find((p) => p.name === 'payload');
    if (!payload)
        throw new Error('"payload" is not a dependency of this project.');
    return {
        manifestVersion: 1,
        platform: { name: 'payload', version: payload.version },
        packages,
    };
}
// Checks an imported manifest once at startup.
export function assertManifest(input) {
    const valid = input?.manifestVersion === 1 &&
        input.platform?.name === 'payload' &&
        typeof input.platform.version === 'string' &&
        Array.isArray(input.packages) &&
        input.packages.every((p) => p?.ecosystem === 'npm' && typeof p.name === 'string' && typeof p.version === 'string');
    if (!valid) {
        throw new Error('pulse-reporter: invalid manifest. Re-run `pulse-reporter snapshot`.');
    }
    return input;
}
export function writeManifest(projectDir, outFile) {
    const manifest = createManifest(projectDir);
    mkdirSync(path.dirname(outFile), { recursive: true });
    writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n');
    return manifest;
}
