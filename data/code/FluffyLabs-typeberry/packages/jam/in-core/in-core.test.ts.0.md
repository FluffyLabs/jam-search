---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/in-core.test.ts#L1-L102
title: packages/jam/in-core/in-core.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 080cd8c44bd45b239ae0ae5d03ee6e6983c04045bd46970e2dee4fee1ef499bb
language: typescript
---
`packages/jam/in-core/in-core.test.ts` (lines 1–102)

```typescript
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";
import type { CodeHash, HeaderHash, StateRootHash } from "@typeberry/block";
import { tryAsCoreIndex, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import type { WorkPackageHash } from "@typeberry/block/refine-context.js";
import { RefineContext } from "@typeberry/block/refine-context.js";
import { WorkItem } from "@typeberry/block/work-item.js";
import { tryAsWorkItemsCount, WorkPackage } from "@typeberry/block/work-package.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray, HashDictionary } from "@typeberry/collections";
import { type ChainSpec, PvmBackend, tinyChainSpec } from "@typeberry/config";
import { InMemoryStates } from "@typeberry/database";
import { Blake2b, HASH_SIZE, type OpaqueHash, WithHash } from "@typeberry/hash";
import { tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { InMemoryService, InMemoryState, PreimageItem, ServiceAccountInfo } from "@typeberry/state";
import { InCore, RefineError } from "./in-core.js";

// Load the authorizer PVM fixture (checks authToken === authConfiguration).
const AUTHORIZER_PVM = BytesBlob.blobFrom(readFileSync(resolve(import.meta.dirname, "fixtures/authorizer.pvm")));
const AUTH_SERVICE_ID = tryAsServiceId(1);

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

function getAuthCodeHash() {
  return blake2b.hashBytes(AUTHORIZER_PVM).asOpaque<CodeHash>();
}

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

function createWorkItem(codeHash: CodeHash, serviceId = 1) {
  return WorkItem.create({
    service: tryAsServiceId(serviceId),
    codeHash,
    payload: BytesBlob.empty(),
    refineGasLimit: tryAsServiceGas(1_000_000),
    accumulateGasLimit: tryAsServiceGas(1_000_000),
    importSegments: asKnownSize([]),
    extrinsic: [],
    exportCount: tryAsU16(0),
  });
}

function createWorkPackage(
  anchorHash: HeaderHash,
  stateRoot: StateRootHash,
  authCodeHash: CodeHash,
  lookupAnchorSlot = 0,
) {
  return WorkPackage.create({
    authToken: BytesBlob.empty(),
    authCodeHost: AUTH_SERVICE_ID,
    authCodeHash,
    authConfiguration: BytesBlob.empty(),
    context: RefineContext.create({
      anchor: anchorHash,
      stateRoot,
      beefyRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      lookupAnchor: anchorHash,
      lookupAnchorSlot: tryAsTimeSlot(lookupAnchorSlot),
      prerequisites: [],
    }),
    items: FixedSizeArray.new([createWorkItem(authCodeHash)], tryAsWorkItemsCount(1)),
  });
}

function hashWorkPackage(spec: ChainSpec, workPackage: WorkPackage): WithHash<WorkPackageHash, WorkPackage> {
  const workPackageHash = blake2b
    .hashBytes(Encoder.encodeObject(WorkPackage.Codec, workPackage, spec))
    .asOpaque<WorkPackageHash>();
  return WithHash.new(workPackageHash, workPackage);
}

describe("InCore", () => {
  it("should return StateMissing error when anchor block state is not in DB", async () => {
    const spec = tinyChainSpec;
```
