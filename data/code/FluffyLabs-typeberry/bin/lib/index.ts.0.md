---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/index.ts#L1-L34'
title: bin/lib/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: f981a5d61536ad1de4882b82e3651f2682fe3edbdeba49bb133ddd28345a7d7e
language: typescript
---
`bin/lib/index.ts` (lines 1–34)

```typescript
export type { __REPRESENTATION_BYTES__, WithBytesRepresentation } from "@typeberry/numbers";
export type { __OPAQUE_TYPE__, TEST_COMPARE_USING, WithOpaque } from "@typeberry/utils";

export * as block from "./exports/block.js";
export * as block_json from "./exports/block-json.js";
export * as bytes from "./exports/bytes.js";
export * as codec from "./exports/codec.js";
export * as collections from "./exports/collections.js";
export * as config from "./exports/config.js";
export * as config_node from "./exports/config-node.js";
export * as crypto from "./exports/crypto.js";
export * as database from "./exports/database.js";
export * as erasure_coding from "./exports/erasure-coding.js";
export * as fuzz_proto from "./exports/fuzz-proto.js";
export * as hash from "./exports/hash.js";
export * as importer from "./exports/importer.js";
export * as jam_host_calls from "./exports/jam-host-calls.js";
export * as json_parser from "./exports/json-parser.js";
export * as logger from "./exports/logger.js";
export * as mmr from "./exports/mmr.js";
export * as numbers from "./exports/numbers.js";
export * as ordering from "./exports/ordering.js";
export * as pvm_host_calls from "./exports/pvm-host-calls.js";
export * as pvm_interface from "./exports/pvm-interface.js";
export * as pvm_interpreter from "./exports/pvm-interpreter.js";
export * as shuffling from "./exports/shuffling.js";
export * as state from "./exports/state.js";
export * as state_json from "./exports/state-json.js";
export * as state_merkleization from "./exports/state-merkleization.js";
export * as state_vectors from "./exports/state-vectors.js";
export * as transition from "./exports/transition.js";
export * as trie from "./exports/trie.js";
export * as utils from "./exports/utils.js";
export * as workers_api from "./exports/workers-api.js";
```
