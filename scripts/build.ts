#!/usr/bin/env bun

import { $ } from "bun";

await $`rm -rf dist`;

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  packages: "external",
  banner: "#!/usr/bin/env node",
});

// Make the output file executable
await $`chmod +x dist/index.js`;
