---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/is-authorized.test.ts#L1-L97
title: packages/jam/in-core/is-authorized.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 2617653779f392d95b0a5394ad169e50c97f1030c62c4911e66a67b029ece350
language: typescript
---
`packages/jam/in-core/is-authorized.test.ts` (lines 1–97)

```typescript
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";
import type { CodeHash } from "@typeberry/block";
import { tryAsCoreIndex, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { RefineContext } from "@typeberry/block/refine-context.js";
import { WorkItem } from "@typeberry/block/work-item.js";
import { tryAsWorkItemsCount, WorkPackage } from "@typeberry/block/work-package.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray, HashDictionary } from "@typeberry/collections";
import { PvmBackend, tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { InMemoryService, InMemoryState, PreimageItem, ServiceAccountInfo } from "@typeberry/state";
import { buildWorkPackageFetchData } from "@typeberry/transition/externalities/fetch-externalities.js";
import { AuthorizationError, IsAuthorized } from "./is-authorized.js";

function buildPackageAndFetchData(authCodeHash: CodeHash, authToken: BytesBlob, authConfiguration: BytesBlob) {
  const pkg = buildPackage(authCodeHash, authToken, authConfiguration);
  return { pkg, fetchData: buildWorkPackageFetchData(tinyChainSpec, pkg) };
}

function buildPackage(authCodeHash: CodeHash, authToken: BytesBlob, authConfiguration: BytesBlob): WorkPackage {
  const items = [
    WorkItem.create({
      service: tryAsServiceId(1),
      codeHash: Bytes.zero(HASH_SIZE).asOpaque<CodeHash>(),
      refineGasLimit: tryAsServiceGas(1_000_000),
      accumulateGasLimit: tryAsServiceGas(1_000_000),
      exportCount: tryAsU16(0),
      payload: BytesBlob.empty(),
      importSegments: asKnownSize([]),
      extrinsic: [],
    }),
  ];
  return WorkPackage.create({
    authToken,
    authCodeHost: AUTH_SERVICE_ID,
    authCodeHash,
    authConfiguration,
    context: RefineContext.create({
      anchor: Bytes.zero(HASH_SIZE).asOpaque(),
      stateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      beefyRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      lookupAnchor: Bytes.zero(HASH_SIZE).asOpaque(),
      lookupAnchorSlot: tryAsTimeSlot(16),
      prerequisites: [],
    }),
    items: FixedSizeArray.new(items, tryAsWorkItemsCount(1)),
  });
}

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

// Load the authorizer PVM fixture.
// This authorizer checks that authToken === authConfiguration and returns "Auth=<token>".
// https://github.com/tomusdrw/as-lan/blob/main/examples/authorizer/assembly/authorize.ts
const AUTHORIZER_PVM = BytesBlob.blobFrom(readFileSync(resolve(import.meta.dirname, "fixtures/authorizer.pvm")));

const AUTH_SERVICE_ID = tryAsServiceId(42);

function createService(serviceId: typeof AUTH_SERVICE_ID, codeHash: OpaqueHash, code: BytesBlob): InMemoryService {
  return InMemoryService.new(serviceId, {
    info: ServiceAccountInfo.create({
      codeHash: codeHash.asOpaque<CodeHash>(),
      balance: tryAsU64(10_000_000_000),
      accumulateMinGas: tryAsServiceGas(0n),
      onTransferMinGas: tryAsServiceGas(0n),
      storageUtilisationBytes: tryAsU64(0),
      storageUtilisationCount: tryAsU32(0),
      gratisStorage: tryAsU64(0),
      created: tryAsTimeSlot(0),
      lastAccumulation: tryAsTimeSlot(0),
      parentService: tryAsServiceId(0),
    }),
    preimages: HashDictionary.fromEntries(
      [PreimageItem.create({ hash: codeHash.asOpaque(), blob: code })].map((x) => [x.hash, x]),
    ),
    lookupHistory: HashDictionary.fromEntries([]),
    storage: new Map(),
  });
}

describe("IsAuthorized", () => {
  const spec = tinyChainSpec;

  function getAuthCodeHash() {
    return blake2b.hashBytes(AUTHORIZER_PVM).asOpaque<CodeHash>();
  }

  function createStateWithService(codeHash: OpaqueHash, code: BytesBlob) {
    return InMemoryState.partial(spec, {
```
