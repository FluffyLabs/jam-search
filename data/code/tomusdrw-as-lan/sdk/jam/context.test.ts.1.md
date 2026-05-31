---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/context.test.ts#L114-L182'
title: sdk/jam/context.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0f4ce03dec568199eba9d13aad4c70060803165d6cbac40753211bd8f42d7c8d
language: typescript
---
`sdk/jam/context.test.ts` (lines 114–182)

```typescript
    const vm = ctx.nestedPvmFromSpi(blob, BytesBlob.empty(), 1);
    a.isEqual(vm.getRegister(7), 0xfeff_0000, "r7 = args start");
    return a;
  }),

  // ─── AccumulateContext.checkpoint ───────────────────────────────────

  test("AccumulateContext.checkpoint returns remaining gas", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestGas.set(42_000);
    const gas = ctx.checkpoint();
    a.isEqual(gas, 42_000, "remaining gas");
    return a;
  }),

  test("AccumulateContext.checkpoint returns zero gas", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestGas.set(0);
    const gas = ctx.checkpoint();
    a.isEqual(gas, 0, "zero gas");
    return a;
  }),

  test("AccumulateContext.checkpoint reflects updated gas", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestGas.set(100_000);
    a.isEqual(ctx.checkpoint(), 100_000, "first checkpoint");

    TestGas.set(50_000);
    a.isEqual(ctx.checkpoint(), 50_000, "second checkpoint after gas change");
    return a;
  }),

  // ─── AccumulateContext.yieldResult ──────────────────────────────────

  test("AccumulateContext.yieldResult does not panic", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    const hash = Bytes32.zero();
    ctx.yieldResult(hash);
    // If we reach here, the call succeeded (no panic).
    a.isEqual(true, true, "yieldResult completed");
    return a;
  }),

  test("AccumulateContext.yieldResult accepts non-zero hash", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    const raw = new Uint8Array(32);
    for (let i = 0; i < 32; i++) raw[i] = u8(i + 1);
    const hash = Bytes32.wrapUnchecked(raw);
    ctx.yieldResult(hash);
    a.isEqual(true, true, "yieldResult with non-zero hash completed");
    return a;
  }),
];
```
