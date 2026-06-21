---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/build-inline.ts#L1-L91'
title: bin/build-inline.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: df44253ccdab9df61bbe947c92e5d1059f119fbe74b963c44ff8867018c32a24
language: typescript
---
`bin/build-inline.ts` (lines 1–91)

```typescript
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

interface AsconfigTarget {
  outFile: string;
  [key: string]: unknown;
}

interface Asconfig {
  targets: Record<string, AsconfigTarget>;
  [key: string]: unknown;
}

// Load asconfig.json
const asconfigPath = resolve(projectRoot, "asconfig.json");
const asconfig: Asconfig = JSON.parse(readFileSync(asconfigPath, "utf-8"));

console.log("Building inline JS files with base64-encoded WASM...\n");

// Process each target
for (const [targetName, config] of Object.entries(asconfig.targets)) {
  const wasmPath = resolve(projectRoot, config.outFile);

  try {
    // Read the WASM file
    const wasmBuffer = readFileSync(wasmPath);

    // Base64 encode
    const wasmBase64 = wasmBuffer.toString("base64");

    // Generate the output JS file name
    // e.g., "build/release.wasm" -> "build/release-inline.js"
    const wasmFileName = basename(config.outFile, ".wasm");
    const outputPath = resolve(projectRoot, dirname(config.outFile), `${wasmFileName}-inline.js`);

    // Create the JS content
    const jsContent = `// Auto-generated inline WASM module
// Target: ${targetName}
// Source: ${config.outFile}

import * as raw from './debug-raw.js';

export const wasmBase64 = "${wasmBase64}";
let compiledModulePromise = null;

// Helper function to decode and instantiate the module
export async function instantiate(imports) {
	if (compiledModulePromise === null) {
		compiledModulePromise = WebAssembly.compile(getWasmBytes());
	}
	const module = await compiledModulePromise;
	return raw.instantiate(module, imports);
}

// Helper function to just get the bytes
export function getWasmBytes() {
	return Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
}
`;

    // Write the JS file
    writeFileSync(outputPath, jsContent, "utf-8");

    // Generate and write the .d.ts file
    const dtsPath = outputPath.replace(/\.js$/, ".d.ts");
    const dtsContent = `// Auto-generated type definitions for inline WASM module
// Target: ${targetName}
// Source: ${config.outFile}

import {__AdaptedExports} from "./debug-raw.d.ts";

export const wasmBase64: string;

export function instantiate(imports?: { env?: any }): Promise<typeof __AdaptedExports>;

export function getWasmBytes(): Uint8Array;
`;
    writeFileSync(dtsPath, dtsContent, "utf-8");

    console.log(`✓ ${targetName}: ${outputPath} (${Math.round(wasmBase64.length / 1024)} KB base64)`);
  } catch (error) {
    console.error(`✗ ${targetName}: Failed to process ${wasmPath}`);
    console.error(`  ${error instanceof Error ? error.message : error}`);
  }
}

console.log("\nDone!");
```
