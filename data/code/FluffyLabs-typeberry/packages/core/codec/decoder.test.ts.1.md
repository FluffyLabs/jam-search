---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.test.ts#L138-L257
title: packages/core/codec/decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 5
content_sha: e3bc7735d9c9621403dafab491a117d5bad0417fa55433967367c43277a72847
language: typescript
---
`packages/core/codec/decoder.test.ts` (lines 138–257)

```typescript
    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 3 bytes max value", () => {
    const encodedBytes = new Uint8Array([192 + 31, 0xff, 0xff]);
    const expectedValue = 2 ** 21 - 1;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 4 bytes min value", () => {
    const encodedBytes = new Uint8Array([0xe0, 0, 0, 0x20]);
    const expectedValue = 2 ** 21;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 4 bytes max value", () => {
    const encodedBytes = new Uint8Array([0xe0 + 15, 0xff, 0xff, 0xff]);
    const expectedValue = 2 ** 28 - 1;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 5 bytes min value", () => {
    const encodedBytes = new Uint8Array([256 - 16, 0, 0, 0, 0x10]);
    const expectedValue = 2n ** 28n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 5 bytes max value", () => {
    const encodedBytes = new Uint8Array([256 - 16 + 7, 0xff, 0xff, 0xff, 0xff]);
    const expectedValue = 2n ** 35n - 1n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 6 bytes min value", () => {
    const encodedBytes = new Uint8Array([256 - 8, 0, 0, 0, 0, 0x08]);
    const expectedValue = 2n ** 35n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 6 bytes max value", () => {
    const encodedBytes = new Uint8Array([256 - 8 + 3, 0xff, 0xff, 0xff, 0xff, 0xff]);
    const expectedValue = 2n ** 42n - 1n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 7 bytes min value", () => {
    const encodedBytes = new Uint8Array([256 - 4, 0, 0, 0, 0, 0, 0x04]);
    const expectedValue = 2n ** 42n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 7 bytes max value", () => {
    const encodedBytes = new Uint8Array([256 - 4 + 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
    const expectedValue = 2n ** 49n - 1n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 8 bytes min value", () => {
    const encodedBytes = new Uint8Array([256 - 2, 0, 0, 0, 0, 0, 0, 0x02]);
    const expectedValue = 2n ** 49n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 8 bytes max value", () => {
    const encodedBytes = new Uint8Array([256 - 2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
    const expectedValue = 2n ** 56n - 1n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 9 bytes min value", () => {
    const encodedBytes = new Uint8Array([255, 0, 0, 0, 0, 0, 0, 0, 0x01]);
    const expectedValue = 2n ** 56n;

```
