---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/protocol.ts#L1-L110
title: packages/workers/importer/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3b535d52d00766af3a4a0d2d5db9e5dcbd794ac0b517c9a7b4b1c2dd8d8aec71
language: typescript
---
`packages/workers/importer/protocol.ts` (lines 1–110)

```typescript
import { Block, type HeaderHash, headerViewWithHashCodec, type StateRootHash } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec } from "@typeberry/codec";
import { PvmBackend } from "@typeberry/config";
import { HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { tryAsU8, tryAsU16, tryAsU32, type U16 } from "@typeberry/numbers";
import { StateEntries } from "@typeberry/state-merkleization";
import { Result } from "@typeberry/utils";
import { type Api, createProtocol, type Internal } from "@typeberry/workers-api";

const importBlockResultCodec = <T extends OpaqueHash>(hashName: string) =>
  codec.custom<Result<T, string>>(
    {
      name: `Result<${hashName}, string>`,
      sizeHint: { bytes: 1, isExact: false },
    },
    (e, x) => {
      e.varU32(tryAsU32(x.isOk ? 0 : 1));
      if (x.isOk) {
        e.bytes(x.ok);
      } else {
        e.bytesBlob(BytesBlob.blobFromString(`${x.error}`));
      }
    },
    (d) => {
      const kind = d.varU32();
      if (kind === 0) {
        const hash = d.bytes(HASH_SIZE);
        return Result.ok<T>(hash.asOpaque());
      }
      if (kind === 1) {
        const error = d.bytesBlob();
        const errorMsg = error.asText();
        return Result.error(errorMsg, () => errorMsg);
      }

      throw new Error(`Invalid Result: ${kind}`);
    },
    (s) => {
      const kind = s.decoder.varU32();
      if (kind === 0) {
        s.bytes(HASH_SIZE);
      } else if (kind === 1) {
        s.bytesBlob();
      } else {
        throw new Error(`Invalid Result: ${kind}`);
      }
    },
  );

export const protocol = createProtocol("importer", {
  toWorker: {
    getStateEntries: {
      request: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
      response: codec.optional(StateEntries.Codec),
    },
    getBestStateRootHash: {
      request: codec.nothing,
      response: codec.bytes(HASH_SIZE).asOpaque<StateRootHash>(),
    },
    importBlock: {
      request: Block.Codec.View,
      response: importBlockResultCodec<HeaderHash>("HeaderHash"),
    },
    finish: {
      request: codec.nothing,
      response: codec.nothing,
    },
  },
  fromWorker: {
    bestHeaderAnnouncement: {
      request: headerViewWithHashCodec,
      response: codec.nothing,
    },
  },
});

export type ImporterInternal = Internal<typeof protocol>;
export type ImporterApi = Api<typeof protocol>;

export class ImporterConfig {
  static Codec = codec.Class(ImporterConfig, {
    pvm: codec.u8.convert(
      (i) => tryAsU8(i),
      (o) => {
        if (o === PvmBackend.BuiltIn) {
          return PvmBackend.BuiltIn;
        }
        if (o === PvmBackend.Ananas) {
          return PvmBackend.Ananas;
        }
        throw new Error(`Invalid PvmBackend: ${o}`);
      },
    ),
    dummyFinalityDepth: codec.u16,
    pruneBlocks: codec.bool,
  });

  static create({ pvm, dummyFinalityDepth, pruneBlocks }: CodecRecord<ImporterConfig>) {
    return new ImporterConfig(pvm, dummyFinalityDepth, pruneBlocks);
  }

  private constructor(
    public readonly pvm: PvmBackend,
    /** Dummy finality depth. 0 means disabled, any positive value enables dummy finality with that depth. */
    public readonly dummyFinalityDepth: U16 = tryAsU16(0),
    /** Whether to prune block data (headers, extrinsics) alongside states on finality. */
    public readonly pruneBlocks: boolean = false,
  ) {}
}
```
