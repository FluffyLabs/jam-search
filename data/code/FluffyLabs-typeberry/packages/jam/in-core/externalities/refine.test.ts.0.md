---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.test.ts#L1-L112
title: packages/jam/in-core/externalities/refine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 0cb65843d362e1c751f233208d46fd8755f765233fa6c781d7446bba95011207
language: typescript
---
`packages/jam/in-core/externalities/refine.test.ts` (lines 1–112)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import {
  MAX_NUMBER_OF_EXPORTS_WP,
  type PreimageHash,
  SEGMENT_BYTES,
  type Segment,
  type ServiceId,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { PvmBackend, tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { SegmentExportError, tryAsMachineId, tryAsProgramCounter } from "@typeberry/jam-host-calls";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { HostCallRegisters } from "@typeberry/pvm-host-calls";
import { Status, tryAsBigGas } from "@typeberry/pvm-interface";
import { InMemoryService, InMemoryState, PreimageItem, ServiceAccountInfo, type State } from "@typeberry/state";
import { RefineExternalitiesImpl, type RefineExternalitiesParams } from "./refine.js";

const MINIMAL_PROGRAM = new Uint8Array([0, 1, 1, 0, 0x00]);

function createSegment(byte = 0xab): Segment {
  return Bytes.fill(SEGMENT_BYTES, byte);
}

function createSmallSegment(bytes: number[]): Segment {
  const data = new Uint8Array(SEGMENT_BYTES);
  data.set(bytes);
  return Bytes.fromBlob(data, SEGMENT_BYTES);
}

/**
 * Create a mock State that has specified services with preimages.
 */
function createMockState(
  services: Array<{
    id: number;
    preimages?: Array<{ hash: string; blob: string }>;
  }>,
): State {
  const serviceMap = new Map<ServiceId, InMemoryService>();
  for (const svc of services) {
    const preimages = HashDictionary.new<PreimageHash, PreimageItem>();
    for (const p of svc.preimages ?? []) {
      const hash = Bytes.parseBytes(p.hash, HASH_SIZE).asOpaque<PreimageHash>();
      const item = PreimageItem.create({
        hash,
        blob: BytesBlob.parseBlob(p.blob),
      });
      preimages.set(hash, item);
    }
    const serviceId = tryAsServiceId(svc.id);
    serviceMap.set(
      serviceId,
      InMemoryService.new(serviceId, {
        info: ServiceAccountInfo.create({
          codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
          balance: tryAsU64(1_000_000_000n),
          accumulateMinGas: tryAsServiceGas(100),
          onTransferMinGas: tryAsServiceGas(100),
          storageUtilisationBytes: tryAsU64(0),
          storageUtilisationCount: tryAsU32(0),
          gratisStorage: tryAsU64(0),
          created: tryAsTimeSlot(0),
          lastAccumulation: tryAsTimeSlot(0),
          parentService: tryAsServiceId(0),
        }),
        preimages,
        lookupHistory: HashDictionary.new(),
        storage: new Map(),
      }),
    );
  }

  return InMemoryState.partial(tinyChainSpec, { services: serviceMap });
}

function createExt(overrides: Partial<RefineExternalitiesParams> = {}) {
  const defaultState = createMockState([]);
  return RefineExternalitiesImpl.create({
    currentServiceId: tryAsServiceId(42),
    lookupState: overrides.lookupState ?? defaultState,
    exportOffset: overrides.exportOffset ?? 0,
    pvmBackend: PvmBackend.BuiltIn,
    ...overrides,
  });
}

function emptyRegisters() {
  return HostCallRegisters.empty();
}

describe("RefineExternalitiesImpl", () => {
  describe("historicalLookup", () => {
    const PREIMAGE_HASH = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const PREIMAGE_DATA = "0xdeadbeef";

    it("should return preimage data for existing service and hash", async () => {
      const lookupState = createMockState([{ id: 42, preimages: [{ hash: PREIMAGE_HASH, blob: PREIMAGE_DATA }] }]);
      const ext = createExt({ lookupState });

      const hash = Bytes.parseBytes(PREIMAGE_HASH, HASH_SIZE).asOpaque();
      const result = await ext.historicalLookup(tryAsServiceId(42), hash);

      assert.strictEqual(result?.toString(), BytesBlob.parseBlob(PREIMAGE_DATA).toString());
    });

    it("should use currentServiceId when serviceId is null", async () => {
```
