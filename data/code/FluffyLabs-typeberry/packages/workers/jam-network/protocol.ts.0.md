---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/protocol.ts#L1-L59
title: packages/workers/jam-network/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 14e611ba48615011aabc8c7cf59e8653034fb21ca9bd85325a749d0f893ff156
language: typescript
---
`packages/workers/jam-network/protocol.ts` (lines 1–59)

```typescript
import { Block, type HeaderHash, headerViewWithHashCodec } from "@typeberry/block";
import { type CodecRecord, codec } from "@typeberry/codec";
import { ED25519_PRIV_KEY_BYTES, type Ed25519SecretSeed } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import type { U16 } from "@typeberry/numbers";
import { WithDebug } from "@typeberry/utils";
import { type Api, createProtocol, type Internal } from "@typeberry/workers-api";

/** Network-specific worker initialisatation. */
export class NetworkingConfig extends WithDebug {
  static Codec = codec.Class(NetworkingConfig, {
    genesisHeaderHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    key: codec.bytes(ED25519_PRIV_KEY_BYTES).asOpaque<Ed25519SecretSeed>(),
    host: codec.string,
    port: codec.u16,
    bootnodes: codec.sequenceVarLen(codec.string),
  });

  static create({ genesisHeaderHash, key, host, port, bootnodes }: CodecRecord<NetworkingConfig>) {
    return new NetworkingConfig(genesisHeaderHash, key, host, port, bootnodes);
  }

  private constructor(
    /** Genesis header hash. */
    public readonly genesisHeaderHash: HeaderHash,
    /** Ed25519 private key. */
    public readonly key: Ed25519SecretSeed,
    /** Host to bind the networking to. */
    public readonly host: string,
    /** Port to bind the networking to. */
    public readonly port: U16,
    /** List of bootnode addresses. */
    public readonly bootnodes: string[],
  ) {
    super();
  }
}

export const protocol = createProtocol("net", {
  toWorker: {
    newHeader: {
      request: headerViewWithHashCodec,
      response: codec.nothing,
    },
    finish: {
      request: codec.nothing,
      response: codec.nothing,
    },
  },
  fromWorker: {
    blocks: {
      request: codec.sequenceVarLen(Block.Codec.View),
      response: codec.nothing,
    },
  },
});

export type NetworkingInternal = Internal<typeof protocol>;
export type NetworkingApi = Api<typeof protocol>;
```
