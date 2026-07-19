---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/README.md#L1-L149'
title: README.md
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 4c43d289860cb5f2c0e0633e1ac9ba90a5a0ad5f45412aee42739ab2d71189cf
language: markdown
---
`README.md` (lines 1–149)

```markdown
# 🍍 anan-as

AssemblyScript implementation of the JAM PVM (64-bit).

![Gray Paper](https://img.shields.io/badge/Gray%20Paper-0.7.2-green)
[![npm](https://img.shields.io/npm/v/@fluffylabs/anan-as)](https://www.npmjs.com/package/@fluffylabs/anan-as)
[![npm dev](https://img.shields.io/npm/v/@fluffylabs/anan-as/next?label=dev)](https://www.npmjs.com/package/@fluffylabs/anan-as)

[Demo](https://todr.me/anan-as)

## Why?

- [Pineapples](https://en.wikipedia.org/wiki/Ananas) are cool.
- [JAM](https://graypaper.com/) is promising.
- [PVM](https://github.com/paritytech/polkavm) is neat.

## Useful where?

- Main PVM backend of [`typeberry`](https://github.com/fluffylabs) JAM client.
- To test out the [PVM debugger](https://pvm.fluffylabs.dev).

## Installation

```bash
npm install @fluffylabs/anan-as
```

## Usage

The package exports multiple builds to suit different use cases:

### ESM Bindings (Recommended)

ESM bindings provide a convenient JavaScript wrapper around the WebAssembly module:

```javascript
// Default import (optimized release build with ESM bindings)
import ananAs from '@fluffylabs/anan-as';

// Debug build (includes source maps and debug info)
import ananAs from '@fluffylabs/anan-as/debug';

// Explicit release build
import ananAs from '@fluffylabs/anan-as/release';

// Release build with minimal runtime (requires manually calling GC)
import ananAs from '@fluffylabs/anan-as/release-mini';
// make sure to call GC after multiple independent runs
ananAs.__collect();

// Release build with stub host functions (for standalone testing)
import ananAs from '@fluffylabs/anan-as/release-stub';

// Compiler module (for PVM bytecode compilation)
import ananAs from '@fluffylabs/anan-as/compiler';
```

### Inline Builds

Inline builds bundle the WASM binary directly into the JavaScript module (base64 encoded),
eliminating the need to fetch a separate `.wasm` file:

```javascript
import ananAs from '@fluffylabs/anan-as/debug-inline';
import ananAs from '@fluffylabs/anan-as/release-inline';
import ananAs from '@fluffylabs/anan-as/release-mini-inline';
import ananAs from '@fluffylabs/anan-as/release-stub-inline';
```

### Raw Bindings

Raw bindings give you direct access to WebAssembly exports
without the JavaScript wrapper layer.
This is useful for instantiating multiple instances or when you need more control:

```javascript
// Raw bindings
import { instantiate } from '@fluffylabs/anan-as/raw';
// Import WASM file URLs
import debugWasm from '@fluffylabs/anan-as/debug.wasm';
import releaseWasm from '@fluffylabs/anan-as/release.wasm';

// Use with your own loader
const module = await WebAssembly.instantiateStreaming(
  fetch(releaseWasm),
  imports
);
const ananAs = await instantiate(module);
```

## Version Tags

When installing the package, you can choose between stable releases
and bleeding-edge builds:

```bash
# Latest stable release
npm install @fluffylabs/anan-as

# Latest build from main branch (includes commit hash)
npm install @fluffylabs/anan-as@next
```

## Building

To download the dependencies:

```cmd
npm ci
```

To build the WASM modules (in `./build/{release,debug}.wasm`):

```cmd
npm run build
```

To run the example in the browser at [http://localhost:3000](http://localhost:3000).

```cmd
npm run web
```

To run tests:

```cmd
# Run AssemblyScript unit tests and trace replay tests
npm test

# Run W3F test vectors
npm run test:w3f

# Run gas cost tests
npm run test:gas-cost
```

## CLI Usage

The package includes a CLI tool for disassembling, running, and replaying PVM bytecode:

```bash
# Disassemble bytecode to assembly
npx @fluffylabs/anan-as disassemble [--spi] [--no-metadata] <file.pvm>

# Run JAM programs
npx @fluffylabs/anan-as run [--spi] [--no-logs] [--no-metadata] [--pc <number>] [--gas <number>] <file.pvm> [spi-args.bin or hex]

# Replay an ecalli trace
# Learn more: https://github.com/tomusdrw/JIPs/blob/td-jip6-ecalliloggin/JIP-6.md
```
