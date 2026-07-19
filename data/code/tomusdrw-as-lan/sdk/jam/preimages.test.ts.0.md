---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.test.ts#L1-L116'
title: sdk/jam/preimages.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 3
content_sha: df0559b326664890171c3624be5d6cb6b45b983a9fef3a67045155705498fe41
language: typescript
---
`sdk/jam/preimages.test.ts` (lines 1–116)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";
import { EcalliResult } from "../ecalli";
import { TestEcalli, TestHistoricalLookup, TestLookup, TestPreimages } from "../test/test-ecalli";
import { Assert, Test, test } from "../test/utils";
import { AccumulatePreimages, ForgetError, ProvideError, SolicitError } from "./accumulate/preimages";
import { PreimageStatusKind, Preimages } from "./preimages";
import { RefinePreimages } from "./refine/preimages";

export const TESTS: Test[] = [
  // ─── Preimages.lookup ─────────────────────────────────────────────────

  test("Preimages.lookup returns BytesBlob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestLookup.setPreimage(data.raw);

    const p = Preimages.create();
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, data, "data");
    return a;
  }),

  test("Preimages.lookup returns none when NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestLookup.setNone();

    const p = Preimages.create();
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  test("Preimages.lookup auto-expands buffer", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const large = BytesBlob.zero(2048);
    for (let i = 0; i < 2048; i++) large.raw[i] = u8(i & 0xff);
    TestLookup.setPreimage(large.raw);

    // Small buffer forces auto-expansion
    const p = Preimages.create(64);
    const result = p.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, large, "data");
    return a;
  }),

  // ─── RefinePreimages.lookup (delegation) ──────────────────────────────

  test("RefinePreimages.lookup delegates to Preimages", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xcafe").okay!;
    TestLookup.setPreimage(data.raw);

    const rp = RefinePreimages.create();
    const result = rp.lookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, data, "data");
    return a;
  }),

  // ─── RefinePreimages.historicalLookup ─────────────────────────────────

  test("RefinePreimages.historicalLookup returns BytesBlob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const data = BytesBlob.parseBlob("0xaabbccdd").okay!;
    TestHistoricalLookup.setPreimage(data.raw);

    const rp = RefinePreimages.create();
    const result = rp.historicalLookup(Bytes32.zero());
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, data, "data");
    return a;
  }),

  test("RefinePreimages.historicalLookup returns none when NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestHistoricalLookup.setNone();

    const rp = RefinePreimages.create();
    const result = rp.historicalLookup(Bytes32.zero());
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  // ─── AccumulatePreimages.query ────────────────────────────────────────

  test("AccumulatePreimages.query returns none for NONE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Default mock returns NONE
    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  test("AccumulatePreimages.query decodes Requested", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Requested: r7 = 0 (kind=0, slot0=0), r8 = 0
    TestPreimages.setQueryResult(0, 0);

    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.kind, PreimageStatusKind.Requested, "kind");
    return a;
  }),

```
