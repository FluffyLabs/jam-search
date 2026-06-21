---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/pages.test.ts#L116-L242
title: packages/jam/jam-host-calls/refine/pages.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: d330aafcd7cdfce503f7f6ea51181c3aef1987baee9d2ba9511d54872decd164
language: typescript
---
`packages/jam/jam-host-calls/refine/pages.test.ts` (lines 116–242)

```typescript
      Result.error(PagesError.NoMachine, () => "Test: error occurred"),
      1,
      10_000,
      5,
      0,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });

  it("Should return WHO when provided unknown type request but machine does not exist", async () => {
    // intentionally setting no machine here.
    const { pages, registers } = prepareTest(
      Result.error(PagesError.NoMachine, () => "Test: error occurred"),
      10_000,
      10_000,
      5,
      16,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });

  it("Should return HUH when provided unknown type request and machine exist", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidOperation, () => "Test: error occurred"),
      10_000,
      12,
      5,
      16,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });

  it("Should return HUH when page is too low", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidPage, () => "Test: error occurred"),
      10_000,
      12,
      5,
      0,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });

  it("Should return HUH when page is too large", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidPage, () => "Test: error occurred"),
      10_000,
      2 ** 32 - 1,
      12_000,
      2,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });

  it("Should return HUH when page is too large 2", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidPage, () => "Test: error occurred"),
      10_000,
      2 ** 20 - 5,
      5,
      3,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });

  it("Should return HUH when attempting to preserve memory of uninitialized page", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidPage, () => "Test: error occurred"),
      10_000,
      10_000,
      5,
      3,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });

  it("Should return HUH when attempting to preserve memory of uninitialized page 2", async () => {
    const { pages, registers } = prepareTest(
      Result.error(PagesError.InvalidPage, () => "Test: error occurred"),
      10_000,
      10_000,
      5,
      4,
    );

    // when
    await pages.execute(gas, registers);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
  });
});
```
