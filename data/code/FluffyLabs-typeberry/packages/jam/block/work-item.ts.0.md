---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-item.ts#L1-L124
title: packages/jam/block/work-item.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: c8d90355f3f34733acec38cdce2f899d21f9d4a1a00befba77123275b9b63932
language: typescript
---
`packages/jam/block/work-item.ts` (lines 1–124)

```typescript
import type { Bytes, BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec } from "@typeberry/codec";
import { asKnownSize, type KnownSizeArray } from "@typeberry/collections";
import { HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { sumU32, type U16, type U32 } from "@typeberry/numbers";
import { type Opaque, WithDebug } from "@typeberry/utils";
import { codecKnownSizeArray } from "./codec-utils.js";
import type { ServiceGas, ServiceId } from "./common.js";
import type { CodeHash } from "./hash.js";
import { MAX_NUMBER_OF_IMPORTS_WP, type SegmentIndex } from "./work-item-segment.js";

type WorkItemExtrinsicHash = Opaque<OpaqueHash, "ExtrinsicHash">;

/**
 * An opaque piece of data that the work item brings in.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/1a1b001a1d00?v=0.7.2
 */
export type WorkItemExtrinsic = Opaque<BytesBlob, "Extrinsic">;

/**
 * Extrinsics that are needed by all [`WorkItem`]s and are specified via [`WorkItemExtrinsicSpec`].
 *
 * This is a flat-package of all extrinsics in a work package across all work items.
 * For encoding it also requires the length of items to be known in advance.
 */
export type WorkPackageExtrinsics = KnownSizeArray<
  Bytes<U32>,
  "Count of all extrinsics within work items in a work package"
>;

/**
 * Definition of data segment that was exported by some work package earlier
 * and now is being imported by another work-item.
 */
export class ImportSpec extends WithDebug {
  static Codec = codec.Class(ImportSpec, {
    treeRoot: codec.bytes(HASH_SIZE),
    index: codec.u16.asOpaque<SegmentIndex>(),
  });

  static create({ treeRoot, index }: CodecRecord<ImportSpec>) {
    return new ImportSpec(treeRoot, index);
  }

  private constructor(
    /**
     * ??: TODO [ToDr] GP seems to mention a identity of a work-package:
     * https://graypaper.fluffylabs.dev/#/579bd12/199300199300
     */
    public readonly treeRoot: OpaqueHash,
    /** Index of the prior exported segment. */
    public readonly index: SegmentIndex,
  ) {
    super();
  }
}

/** Introduced blob hashes and their lengths. */
export class WorkItemExtrinsicSpec extends WithDebug {
  static Codec = codec.Class(WorkItemExtrinsicSpec, {
    hash: codec.bytes(HASH_SIZE).asOpaque<WorkItemExtrinsicHash>(),
    len: codec.u32,
  });

  static create({ hash, len }: CodecRecord<WorkItemExtrinsicSpec>) {
    return new WorkItemExtrinsicSpec(hash, len);
  }

  private constructor(
    /** The pre-image to this hash should be passed to the guarantor alongisde the work-package. */
    public readonly hash: WorkItemExtrinsicHash,
    /** Length of the preimage identified by the hash above. */
    public readonly len: U32,
  ) {
    super();
  }
}

/**
 * To encode/decode extrinsics that are specified via [`WorkItemExtrinsicSpec`]
 * we need to know their lenghts. Hence this is created dynamically.
 */
export function workItemExtrinsicsCodec(workItems: WorkItem[]) {
  const extrinsicLengths: U32[] = [];
  for (const item of workItems) {
    for (const extrinsic of item.extrinsic) {
      extrinsicLengths.push(extrinsic.len);
    }
  }
  const sum = sumU32(...extrinsicLengths);
  if (sum.overflow) {
    throw new Error("Unable to create a decoder, because the length of extrinsics overflows!");
  }

  return codec.custom<WorkPackageExtrinsics>(
    {
      name: "WorkItemExtrinsics",
      sizeHint: { bytes: sum.value, isExact: true },
    },
    (e, val) => {
      for (const bytes of val) {
        e.bytes(bytes);
      }
    },
    (d) => {
      const extrinsics: Bytes<U32>[] = [];
      for (const len of extrinsicLengths) {
        const bytes = d.bytes(len);
        extrinsics.push(bytes);
      }
      return asKnownSize(extrinsics);
    },
    (s) => s.decoder.skip(sum.value),
  );
}

/**
 * Work Item which is a part of some work package.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/1a86001a9100?v=0.7.2
 */
export class WorkItem extends WithDebug {
  static Codec = codec.Class(WorkItem, {
```
