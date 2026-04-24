---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/README.md#L1-L125'
title: bin/lib/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 88df8d3ae54f2b575d3bb89aaf6bbd05a0649f73395c89a00e719b32abe3fa4b
language: markdown
---
`bin/lib/README.md` (lines 1–125)

```markdown
# @typeberry/lib

Convenience package providing unified access to all Typeberry core packages.

## Overview

`@typeberry/lib` is a meta-package that re-exports all Typeberry modules through subpath imports. This simplifies imports when working with multiple Typeberry packages and ensures version compatibility across the entire stack.

All imports use the pattern `@typeberry/lib/<module>` to access individual packages with full ESM and CommonJS support.

## Usage

### Installation

```bash
npm install @typeberry/lib
```

### Importing

Instead of installing and importing individual packages:

```typescript
// Without @typeberry/lib - requires installing each package separately
import { Blake2b } from "@typeberry/hash";
import { Encoder } from "@typeberry/codec";
import { ed25519 } from "@typeberry/crypto";
```

Import directly from `@typeberry/lib` using subpath imports:

```typescript
// With @typeberry/lib - single package installation
import { Blake2b } from "@typeberry/lib/hash";
import { Encoder } from "@typeberry/lib/codec";
import { ed25519 } from "@typeberry/lib/crypto";

const blake2b = await Blake2b.createHasher();
const encoded = Encoder.encodeObject(schema, value);
const keypair = await ed25519.generateKeypair();
```

### Available Modules

The following modules are available as subpath imports (e.g., `@typeberry/lib/block`):

- `block` - Block structures and types
- `block-json` - JSON serialization for blocks
- `bytes` - Byte array utilities
- `codec` - JAM/GP codec implementation
- `collections` - Specialized data structures
- `config` - Configuration types
- `config-node` - Node configuration utilities
- `crypto` - Cryptographic primitives (Ed25519, Sr25519, BLS)
- `database` - Database abstractions
- `erasure-coding` - Erasure coding implementation
- `fuzz-proto` - Fuzzing protocol support
- `hash` - Hashing functions (Blake2b, etc.)
- `importer` - Typeberry importer utilities
- `jam-host-calls` - JAM-specific host calls
- `json-parser` - JSON parsing utilities
- `logger` - Logging framework
- `mmr` - Merkle Mountain Range implementation
- `numbers` - Fixed-size numeric types
- `ordering` - Ordering and comparison utilities
- `pvm-host-calls` - PVM host call implementations
- `pvm-interface` - PVM interface and program utilities
- `pvm-interpreter` - PVM bytecode interpreter
- `shuffling` - Shuffling algorithms
- `state` - State management
- `state-json` - JSON serialization for state
- `state-merkleization` - State Merkleization
- `state-vectors` - State test vectors
- `transition` - State transition functions
- `trie` - Trie data structures
- `utils` - General utilities
- `workers-api` - Workers API utilities

## Examples

All examples below are extracted from actual test files in `examples/` directory, ensuring they compile and work correctly.

### Basic Import

<!-- example-code:basic-import -->
```typescript
import { Decoder } from "@typeberry/lib/codec";
import { InMemoryState } from "@typeberry/lib/state";
import { BytesBlob } from "@typeberry/lib/bytes";
import { Block, tryAsServiceId } from "@typeberry/lib/block";

// Import from @typeberry/lib using subpath imports
const config = await import("@typeberry/lib/config");

// create empty in-memory state representation
const state = InMemoryState.empty(config.tinyChainSpec);
assert.equal(state.entropy.length, 4);
assert.equal(state.getService(tryAsServiceId(0)), null);

// attempt to decode block from an empty blob
assert.throws(() => {
  Decoder.decodeObject(Block.Codec, BytesBlob.empty());
});
```
<!-- /example-code:basic-import -->

### Working with Numbers

<!-- example-code:numbers -->
```typescript
import { isU8, tryAsU32, tryAsU8 } from "@typeberry/lib/numbers";

// Create typed numbers
const smallNumber = tryAsU8(42);
const largeNumber = tryAsU32(1000000);

// Type checking
assert.ok(isU8(42));
assert.strictEqual(smallNumber, 42);
assert.strictEqual(largeNumber, 1000000);
```
<!-- /example-code:numbers -->

### Hashing with Blake2b

```
