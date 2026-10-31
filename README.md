# @relyz-pulse/reporter-payload

Payload 3 plugin that reports a project's runtime and dependency versions to Relyz Pulse. Read-only release mirror.

## Install

```jsonc
// package.json
"dependencies": {
  "@relyz-pulse/reporter-payload": "github:relyz-ag/pulse-reporter-payload#semver:^1.0.0"
},
"scripts": {
  "postinstall": "pulse-reporter snapshot",
  "build": "pulse-reporter snapshot && next build",
  "build:docker": "pulse-reporter snapshot && next build --experimental-build-mode compile"
}
```

The snapshot records installed versions at build time in `src/pulse-manifest.json` (gitignore it; `--out <file>` for another path).

```ts
// payload.config.ts
import { pulseReporter } from '@relyz-pulse/reporter-payload'
import manifest from './pulse-manifest.json'

export default buildConfig({
  plugins: [pulseReporter({ manifest })],
})
```

## Set up

1. Set `PULSE_TOKEN` in production to the project's token from Pulse. Without it the endpoint answers `404`.
2. In Pulse, set the report endpoint URL to `https://<production-domain>/api/pulse/report` and click **Test reporter**.
