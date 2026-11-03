// ../reporter-node/src/snapshot.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
var readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
function findInstalledVersion(projectDir, name) {
  let dir = path.resolve(projectDir);
  for (; ; ) {
    const file = path.join(dir, "node_modules", name, "package.json");
    if (existsSync(file)) return readJson(file).version ?? null;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
function createManifest(projectDir, platform) {
  const pkg = readJson(path.join(projectDir, "package.json"));
  const names = Object.keys(pkg.dependencies ?? {}).sort();
  const missing = [];
  const packages = names.flatMap((name) => {
    const version = findInstalledVersion(projectDir, name);
    if (!version) {
      missing.push(name);
      return [];
    }
    return [{ ecosystem: "npm", name, version }];
  });
  if (missing.length) {
    throw new Error(
      `Not installed: ${missing.join(", ")}. Run your package manager's install first.`
    );
  }
  const main = packages.find((p) => p.name === platform);
  if (!main) throw new Error(`"${platform}" is not a dependency of this project.`);
  return {
    manifestVersion: 1,
    platform: { name: platform, version: main.version },
    packages
  };
}
function assertManifest(input, platform) {
  const valid = input?.manifestVersion === 1 && input.platform?.name === platform && typeof input.platform.version === "string" && Array.isArray(input.packages) && input.packages.every(
    (p) => p?.ecosystem === "npm" && typeof p.name === "string" && typeof p.version === "string"
  );
  if (!valid) {
    throw new Error("pulse-reporter: invalid manifest. Re-run `pulse-reporter snapshot`.");
  }
  return input;
}
function writeManifest(projectDir, outFile, platform) {
  const manifest = createManifest(projectDir, platform);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

// ../reporter-node/src/cli.ts
import path2 from "path";
function runCli(argv, options, cwd = process.cwd()) {
  const [command, ...rest] = argv;
  const defaultOut = path2.relative(cwd, options.defaultOut(cwd));
  if (command !== "snapshot") {
    console.error(`Usage: pulse-reporter snapshot [--out ${defaultOut}]`);
    return 1;
  }
  const outIndex = rest.indexOf("--out");
  const out = path2.resolve(cwd, outIndex >= 0 ? rest[outIndex + 1] : defaultOut);
  try {
    const manifest = writeManifest(cwd, out, options.platform);
    console.log(
      `\u2713 Pulse manifest: ${options.platform} ${manifest.platform.version}, ${manifest.packages.length} packages \u2192 ${path2.relative(cwd, out)}`
    );
    return 0;
  } catch (e) {
    console.error(`\u2717 pulse-reporter: ${e.message}`);
    return 1;
  }
}

// ../reporter-node/src/report.ts
import { createHash, timingSafeEqual } from "crypto";
function buildReport(manifest, reporter, now = /* @__PURE__ */ new Date()) {
  return {
    contractVersion: 1,
    generatedAt: now.toISOString(),
    reporter: { name: reporter.name, version: reporter.version },
    runtime: { name: "node", version: process.version.replace(/^v/, "") },
    platform: manifest.platform,
    packages: manifest.packages
  };
}
function tokenMatches(expected, provided) {
  const a = createHash("sha256").update(expected).digest();
  const b = createHash("sha256").update(provided).digest();
  return timingSafeEqual(a, b);
}
function bearerToken(authorization) {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
function handleReportRequest(args) {
  if (!args.token) return Response.json({ error: "Not found" }, { status: 404 });
  const provided = bearerToken(args.authorization);
  if (!provided || !tokenMatches(args.token, provided)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(buildReport(args.manifest, args.reporter), {
    headers: { "Cache-Control": "no-store" }
  });
}

export {
  assertManifest,
  runCli,
  buildReport,
  handleReportRequest
};
