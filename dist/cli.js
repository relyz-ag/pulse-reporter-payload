#!/usr/bin/env node
import {
  runCli
} from "./chunk-7ITONS3K.js";

// src/cli.ts
import path from "path";
process.exit(
  runCli(process.argv.slice(2), {
    platform: "payload",
    defaultOut: (cwd) => path.join(cwd, "src/pulse-manifest.json")
  })
);
