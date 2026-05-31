---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L1-L114
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 4
content_sha: fd61e21e2f6f2b016d11e86744f5ffd0b39c34865b0f87ed5d802a4492b4950b
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 1–114)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";
import { Bytes32Codec } from "../core/codec/bytes32";
import { Decoder, TryDecode } from "../core/codec/decode";
import { Encoder, TryEncode } from "../core/codec/encode";
import { Assert, Test, test } from "../test/utils";
import {
  ExtrinsicRef,
  ExtrinsicRefCodec,
  ImportRef,
  ImportRefCodec,
  ProtocolConstants,
  ProtocolConstantsCodec,
  RefinementContext,
  RefinementContextCodec,
  WorkItem,
  WorkItemCodec,
  WorkItemInfo,
  WorkItemInfoCodec,
  WorkPackage,
  WorkPackageCodec,
} from "./work-package";

// Create shared codec instances for tests.
const _bytes32: Bytes32Codec = Bytes32Codec.create();
const _importRef: ImportRefCodec = ImportRefCodec.create();
const _extrinsicRef: ExtrinsicRefCodec = ExtrinsicRefCodec.create();
const _refinementCtx: RefinementContextCodec = RefinementContextCodec.create(_bytes32);
const _workItem: WorkItemCodec = WorkItemCodec.create(_importRef, _extrinsicRef);
const _protocolConstants: ProtocolConstantsCodec = ProtocolConstantsCodec.create();
const _workItemInfo: WorkItemInfoCodec = WorkItemInfoCodec.create();
const _workPackage: WorkPackageCodec = WorkPackageCodec.create(_refinementCtx, _workItem);

function bytes32Fill(v: u8): Bytes32 {
  const buf = BytesBlob.zero(32);
  buf.raw.fill(v);
  return Bytes32.wrapUnchecked(buf.raw);
}

function roundtrip<T>(original: T, enc: TryEncode<T>, dec: TryDecode<T>): T {
  const e = Encoder.create();
  enc.encode(original, e);
  const d = Decoder.fromBlob(e.finishRaw());
  const r = dec.decode(d);
  assert(r.isOkay, "roundtrip decode failed");
  return r.okay!;
}

export const TESTS: Test[] = [
  // ─── ProtocolConstants ───

  test("ProtocolConstants roundtrip", () => {
    const original = ProtocolConstants.create(
      10_000_000,
      100,
      1_000_000_000, // B_I, B_L, B_S
      341,
      19200,
      600, // C, D, E
      500_000,
      50_000_000,
      5_000_000_000,
      10_000_000_000, // G_A, G_I, G_R, G_T
      24,
      16,
      8,
      16, // H, I, J, K
      14400, // L
      2,
      10,
      6,
      80,
      4,
      128,
      5, // N, O, P, Q, R, T, U
      1023, // V
      12582912,
      4194304,
      65536,
      684, // W_A, W_B, W_C, W_E
      3072,
      6,
      48000,
      128,
      3072,
      15, // W_M, W_P, W_R, W_T, W_X, Y
    );
    const decoded = roundtrip<ProtocolConstants>(original, _protocolConstants, _protocolConstants);

    const assert = Assert.create();
    assert.isEqual(decoded.electiveItemBalance, 10_000_000, "B_I");
    assert.isEqual(decoded.electiveByteBalance, 100, "B_L");
    assert.isEqual(decoded.baseServiceBalance, 1_000_000_000, "B_S");
    assert.isEqual(decoded.coreCount, 341, "C");
    assert.isEqual(decoded.preimageExpungePeriod, 19200, "D");
    assert.isEqual(decoded.epochLength, 600, "E");
    assert.isEqual(decoded.gasAccumulateReport, 500_000, "G_A");
    assert.isEqual(decoded.gasIsAuthorized, 50_000_000, "G_I");
    assert.isEqual(decoded.gasMaxRefine, 5_000_000_000, "G_R");
    assert.isEqual(decoded.gasMaxBlock, 10_000_000_000, "G_T");
    assert.isEqual(decoded.recentHistoryLength, 24, "H");
    assert.isEqual(decoded.maxWorkItems, 16, "I");
    assert.isEqual(decoded.maxReportDeps, 8, "J");
    assert.isEqual(decoded.maxTicketsPerExtrinsic, 16, "K");
    assert.isEqual(decoded.maxLookupAnchorAge, 14400, "L");
    assert.isEqual(decoded.ticketsPerValidator, 2, "N");
    assert.isEqual(decoded.maxAuthorizersPerCore, 10, "O");
    assert.isEqual(decoded.slotDuration, 6, "P");
    assert.isEqual(decoded.authorizersQueueSize, 80, "Q");
    assert.isEqual(decoded.rotationPeriod, 4, "R");
    assert.isEqual(decoded.maxExtrinsicsPerWorkItem, 128, "T");
    assert.isEqual(decoded.reportTimeoutGracePeriod, 5, "U");
    assert.isEqual(decoded.validatorsCount, 1023, "V");
    assert.isEqual(decoded.maxAllocatedWorkPackageSize, 12582912, "W_A");
    assert.isEqual(decoded.maxEncodedWorkPackageSize, 4194304, "W_B");
```
