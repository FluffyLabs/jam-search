---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine-fetch.test.ts#L1-L91
title: packages/jam/in-core/externalities/refine-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 2c12ee8ad39fa50b2f3b5266f14a56a0297f4be49a0368c879b40a6c1bacd77e
language: typescript
---
`packages/jam/in-core/externalities/refine-fetch.test.ts` (lines 1–91)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import type { CodeHash } from "@typeberry/block";
import { tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { RefineContext } from "@typeberry/block/refine-context.js";
import { ImportSpec, WorkItem, type WorkItemExtrinsic, WorkItemExtrinsicSpec } from "@typeberry/block/work-item.js";
import { SEGMENT_BYTES, tryAsSegmentIndex } from "@typeberry/block/work-item-segment.js";
import { tryAsWorkItemsCount, WorkPackage } from "@typeberry/block/work-package.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import { type ChainSpec, fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { buildWorkPackageFetchData } from "@typeberry/transition/externalities/fetch-externalities.js";
import { asOpaqueType } from "@typeberry/utils";
import type { ImportedSegment, PerWorkItem } from "./refine-fetch.js";
import { RefineFetchExternalities } from "./refine-fetch.js";

const asExtrinsic = (bytes: BytesBlob): WorkItemExtrinsic => asOpaqueType(bytes);

function buildWorkItem(overrides: {
  service?: number;
  payloadLen?: number;
  exportCount?: number;
  importCount?: number;
  extrinsicCount?: number;
}) {
  const codeHash = Bytes.fill(HASH_SIZE, 7).asOpaque<CodeHash>();
  const imports = Array.from({ length: overrides.importCount ?? 0 }, (_, i) =>
    ImportSpec.create({ treeRoot: Bytes.zero(HASH_SIZE), index: tryAsSegmentIndex(i) }),
  );
  const extrinsicSpecs = Array.from({ length: overrides.extrinsicCount ?? 0 }, () =>
    WorkItemExtrinsicSpec.create({ hash: Bytes.zero(HASH_SIZE).asOpaque(), len: tryAsU32(0) }),
  );
  return WorkItem.create({
    service: tryAsServiceId(overrides.service ?? 1),
    codeHash,
    payload: BytesBlob.blobFrom(new Uint8Array(overrides.payloadLen ?? 3).fill(0xab)),
    refineGasLimit: tryAsServiceGas(1_000_000),
    accumulateGasLimit: tryAsServiceGas(2_000_000),
    importSegments: asKnownSize(imports),
    extrinsic: extrinsicSpecs,
    exportCount: tryAsU16(overrides.exportCount ?? 0),
  });
}

function buildWorkPackage(items: WorkItem[]) {
  return WorkPackage.create({
    authToken: BytesBlob.blobFrom(new Uint8Array([1, 2, 3])),
    authCodeHost: tryAsServiceId(42),
    authCodeHash: Bytes.fill(HASH_SIZE, 9).asOpaque<CodeHash>(),
    authConfiguration: BytesBlob.blobFrom(new Uint8Array([4, 5, 6, 7])),
    context: RefineContext.create({
      anchor: Bytes.fill(HASH_SIZE, 1).asOpaque(),
      stateRoot: Bytes.fill(HASH_SIZE, 2).asOpaque(),
      beefyRoot: Bytes.fill(HASH_SIZE, 3).asOpaque(),
      lookupAnchor: Bytes.fill(HASH_SIZE, 4).asOpaque(),
      lookupAnchorSlot: tryAsTimeSlot(16),
      prerequisites: [],
    }),
    items: FixedSizeArray.new(items, tryAsWorkItemsCount(items.length)),
  });
}

function prepareRefineData(
  opts: {
    chainSpec?: ChainSpec;
    items?: WorkItem[];
    currentWorkItemIndex?: number;
    extrinsics?: PerWorkItem<WorkItemExtrinsic[]>;
    imports?: PerWorkItem<ImportedSegment[]>;
    authorizerTrace?: BytesBlob;
  } = {},
) {
  const chainSpec = opts.chainSpec ?? tinyChainSpec;
  const items = opts.items ?? [buildWorkItem({})];
  const workPackage = buildWorkPackage(items);
  const packageData = buildWorkPackageFetchData(chainSpec, workPackage);
  return new RefineFetchExternalities(chainSpec, {
    packageData,
    currentWorkItemIndex: opts.currentWorkItemIndex ?? 0,
    imports: opts.imports ?? asKnownSize(items.map(() => [])),
    extrinsics: opts.extrinsics ?? asKnownSize(items.map(() => [])),
    authorizerTrace: opts.authorizerTrace ?? BytesBlob.empty(),
  });
}

describe("RefineFetchExternalities", () => {
  it("should return different constants for different chain specs", () => {
```
