---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/bin/generate-blob.mjs#L1-L29
title: examples/nested-pvm-spi/bin/generate-blob.mjs
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7d976144c12847946693c83e5557904902f5240efc5f4ca25224abc2388a3a01
language: javascript
---
`examples/nested-pvm-spi/bin/generate-blob.mjs` (lines 1–29)

```javascript
#!/usr/bin/env node
// Regenerate `assembly/as-add-jam.ts` from `fixtures/as-add.jam`.
// Run after replacing the fixture file.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hex = readFileSync(resolve(root, "fixtures/as-add.jam")).toString("hex");

const chunks = [];
for (let i = 0; i < hex.length; i += 64) chunks.push(hex.slice(i, i + 64));

const out = `// Auto-generated from fixtures/as-add.jam — do not edit by hand.
// Re-run \`node bin/generate-blob.mjs\` after replacing the fixture.

/**
 * \`as-add.jam\`: a JAM Standard Program from @fluffylabs/pvm-debugger.
 * Format: \`[varU32 metaLen][metadata bytes][SPI header + RO + RW + code]\`.
 * Size: ${hex.length / 2} bytes. The inner SPI program is the output of
 * compiling an AssemblyScript \`add\` function to PVM code.
 */
export const AS_ADD_JAM_HEX =
${chunks.map((c) => `  "${c}"`).join(" +\n")};
`;

writeFileSync(resolve(root, "assembly/as-add-jam.ts"), out);
console.log(`wrote ${out.length} bytes to assembly/as-add-jam.ts`);
```
