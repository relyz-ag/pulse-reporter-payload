# @relyz-pulse/reporter-payload

Payload 3 plugin that reports the project's versions to Relyz Pulse ([contract](docs/report-contract.md)).

Read-only release mirror: developed in the private Relyz Pulse repo and published here by tag. Issues and changes go there.

## Install

```jsonc
// package.json
"dependencies": {
  "@relyz-pulse/reporter-payload": "github:relyz-ag/pulse-reporter-payload#semver:^1.0.0"
}
```

No credentials needed; the repo is public.

## Set up

1. Create the version snapshot before every build and after install, so it also exists in dev:

   ```jsonc
   // package.json
   "scripts": {
     "postinstall": "pulse-reporter snapshot",
     "build": "pulse-reporter snapshot && next build",
     "build:docker": "pulse-reporter snapshot && next build --experimental-build-mode compile"
   }
   ```

   It writes `src/pulse-manifest.json` (add it to `.gitignore`). Use `--out <file>` for another path. In Docker builds that install with `--ignore-scripts`, the build script still creates it.

2. Register the plugin:

   ```ts
   // payload.config.ts
   import { pulseReporter } from '@relyz-pulse/reporter-payload'
   import manifest from './pulse-manifest.json'

   export default buildConfig({
     plugins: [pulseReporter({ manifest })],
   })
   ```

3. Set `PULSE_TOKEN` in the production environment to the token shown in Pulse (project → Reporter → Reveal / Copy).

4. In Pulse, set the project's report endpoint URL to `https://<production-domain>/api/pulse/report` and click **Test reporter**.

Without `PULSE_TOKEN` the endpoint answers `404`, so it is off by default (e.g. on staging).

## Why a snapshot?

Next.js bundles most packages into the build, so a running production app can't reliably read installed versions from `node_modules`. The snapshot records them at build time; the Node version is read live per request.

## Releasing (Pulse repo)

1. Change `src/`, bump `version` in `package.json` and `src/version.ts`, commit and push.
2. `git tag -a reporter-payload-vX.Y.Z -m "reporter-payload X.Y.Z"` and `git push origin reporter-payload-vX.Y.Z`.
3. The "Release reporter" workflow tests, builds and publishes `vX.Y.Z` to `relyz-ag/pulse-reporter-payload`. Published versions are never overwritten.
