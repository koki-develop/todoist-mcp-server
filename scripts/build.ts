#!/usr/bin/env bun

import { $ } from "bun";

await $`rm -rf dist`;

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  packages: "external",
});

// Make the output file executable
await $`chmod +x dist/index.js`;
