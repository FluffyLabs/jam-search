---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/is-authorized-fetch.test.ts#L1-L82
title: packages/jam/in-core/externalities/is-authorized-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 13a2b0c5f912895627dd974cc866e7cfb65869510e7d2cd4fb5ad1c71201078b
language: typescript
---
`packages/jam/in-core/externalities/is-authorized-fetch.test.ts` (lines 1–82)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import type { CodeHash } from "@typeberry/block";
import { tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { RefineContext } from "@typeberry/block/refine-context.js";
import { WorkItem } from "@typeberry/block/work-item.js";
import { tryAsWorkItemsCount, WorkPackage } from "@typeberry/block/work-package.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import { fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU16, tryAsU64 } from "@typeberry/numbers";
import { buildWorkPackageFetchData } from "@typeberry/transition/externalities/fetch-externalities.js";
import { IsAuthorizedFetchExternalities } from "./is-authorized-fetch.js";

function fetchDataFor(pkg: WorkPackage, chainSpec = tinyChainSpec) {
  return buildWorkPackageFetchData(chainSpec, pkg);
}

function buildWorkItem(overrides: { service?: number; payloadLen?: number } = {}) {
  return WorkItem.create({
    service: tryAsServiceId(overrides.service ?? 1),
    codeHash: Bytes.fill(HASH_SIZE, 7).asOpaque<CodeHash>(),
    payload: BytesBlob.blobFrom(new Uint8Array(overrides.payloadLen ?? 3).fill(0xab)),
    refineGasLimit: tryAsServiceGas(1_000_000),
    accumulateGasLimit: tryAsServiceGas(2_000_000),
    importSegments: asKnownSize([]),
    extrinsic: [],
    exportCount: tryAsU16(0),
  });
}

function buildPackage(items: WorkItem[] = [buildWorkItem({})]) {
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

describe("IsAuthorizedFetchExternalities", () => {
  it("returns different constants for different chain specs", () => {
    const tinyExt = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage(), tinyChainSpec));
    const fullExt = new IsAuthorizedFetchExternalities(fullChainSpec, fetchDataFor(buildPackage(), fullChainSpec));
    assert.notStrictEqual(tinyExt.constants().length, 0);
    assert.notDeepStrictEqual(tinyExt.constants(), fullExt.constants());
  });

  it("returns encoded work package", () => {
    const pkg = buildPackage();
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(pkg));
    const expected = Encoder.encodeObject(WorkPackage.Codec, pkg, tinyChainSpec);
    assert.deepStrictEqual(ext.workPackage().raw, expected.raw);
  });

  it("returns auth configuration and auth token from the package", () => {
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage()));
    assert.deepStrictEqual(ext.authConfiguration().raw, new Uint8Array([4, 5, 6, 7]));
    assert.deepStrictEqual(ext.authToken().raw, new Uint8Array([1, 2, 3]));
  });

  it("returns encoded refine context", () => {
    const pkg = buildPackage();
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(pkg));
    const expected = Encoder.encodeObject(RefineContext.Codec, pkg.context);
    assert.deepStrictEqual(ext.refineContext().raw, expected.raw);
  });

  it("returns concatenated work item summaries with 62 bytes per item", () => {
    const items = [buildWorkItem({ service: 1 }), buildWorkItem({ service: 2, payloadLen: 5 })];
```
