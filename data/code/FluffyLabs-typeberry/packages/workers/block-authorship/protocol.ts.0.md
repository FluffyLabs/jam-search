---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/protocol.ts#L1-L59
title: packages/workers/block-authorship/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bb2eb27f6ac1243741bef958cf3770712488dba62812e8e51c87f72053234f0f
language: typescript
---
`packages/workers/block-authorship/protocol.ts` (lines 1–59)

```typescript
import { Block } from "@typeberry/block";
import { type CodecRecord, codec } from "@typeberry/codec";
import {
  BANDERSNATCH_KEY_BYTES,
  type BandersnatchSecretSeed,
  ED25519_KEY_BYTES,
  type Ed25519SecretSeed,
} from "@typeberry/crypto";
import { type Api, createProtocol, type Internal } from "@typeberry/workers-api";

export type GeneratorInternal = Internal<typeof protocol>;
export type GeneratorApi = Api<typeof protocol>;

export const protocol = createProtocol("block-authorship", {
  toWorker: {
    finish: {
      request: codec.nothing,
      response: codec.nothing,
    },
  },
  fromWorker: {
    block: {
      request: Block.Codec.View,
      response: codec.nothing,
    },
  },
});

export class ValidatorSecrets {
  static Codec = codec.Class(ValidatorSecrets, {
    bandersnatch: codec.bytes(BANDERSNATCH_KEY_BYTES).asOpaque<BandersnatchSecretSeed>(),
    ed25519: codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519SecretSeed>(),
  });

  static create({ bandersnatch, ed25519 }: CodecRecord<ValidatorSecrets>) {
    return new ValidatorSecrets(bandersnatch, ed25519);
  }

  private constructor(
    public readonly bandersnatch: BandersnatchSecretSeed,
    public readonly ed25519: Ed25519SecretSeed,
  ) {}
}

export class BlockAuthorshipConfig {
  static Codec = codec.Class(BlockAuthorshipConfig, {
    keys: codec.sequenceVarLen(ValidatorSecrets.Codec),
    isFastForward: codec.bool,
  });

  static create({ keys, isFastForward }: CodecRecord<BlockAuthorshipConfig>) {
    return new BlockAuthorshipConfig(keys, isFastForward);
  }

  private constructor(
    public readonly keys: ValidatorSecrets[],
    public readonly isFastForward: boolean,
  ) {}
}
```
