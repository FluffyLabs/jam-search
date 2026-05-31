---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.test.ts#L103-L206
title: sdk/jam/accumulate/item.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 3
content_sha: a662d7add647b97069fd15b6b2b62c105a195638c96f33db386cbaec0cbe1ab5
language: typescript
---
`sdk/jam/accumulate/item.test.ts` (lines 103–206)

```typescript
  test("Operand roundtrip with Ok result", () => {
    const blob = BytesBlob.parseBlob("0xaabbccdd").okay!;
    const authOut = BytesBlob.parseBlob("0x1234").okay!;
    const original = Operand.create(
      bytes32Fill(0x01),
      bytes32Fill(0x02),
      bytes32Fill(0x03),
      bytes32Fill(0x04),
      1000,
      WorkExecResult.create(WorkExecResultKind.Ok, blob),
      authOut,
    );

    const e = Encoder.create();
    operandCodec.encode(original, e);
    const d = Decoder.fromBlob(e.finishRaw());
    const r = operandCodec.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isOkay, true, "decode succeeded");
    const decoded = r.okay!;
    assert.isEqualBytes(BytesBlob.wrap(decoded.hash.raw), BytesBlob.wrap(bytes32Fill(0x01).raw), "hash");
    assert.isEqualBytes(BytesBlob.wrap(decoded.exportsRoot.raw), BytesBlob.wrap(bytes32Fill(0x02).raw), "exportsRoot");
    assert.isEqualBytes(
      BytesBlob.wrap(decoded.authorizerHash.raw),
      BytesBlob.wrap(bytes32Fill(0x03).raw),
      "authorizerHash",
    );
    assert.isEqualBytes(BytesBlob.wrap(decoded.payloadHash.raw), BytesBlob.wrap(bytes32Fill(0x04).raw), "payloadHash");
    assert.isEqual(decoded.gas, 1000, "gas");
    assert.isEqual(decoded.result.kind, WorkExecResultKind.Ok, "result kind");
    assert.isEqualBytes(decoded.result.okBlob, blob, "result okBlob");
    assert.isEqualBytes(decoded.authorizationOutput, authOut, "authorizationOutput");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("Operand roundtrip with empty authorizationOutput", () => {
    const original = Operand.create(
      bytes32Fill(0xaa),
      bytes32Fill(0xbb),
      bytes32Fill(0xcc),
      bytes32Fill(0xdd),
      42,
      WorkExecResult.create(WorkExecResultKind.Panic, BytesBlob.empty()),
      BytesBlob.empty(),
    );

    const e = Encoder.create();
    operandCodec.encode(original, e);
    const decoded = operandCodec.decode(Decoder.fromBlob(e.finishRaw())).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.gas, 42, "gas");
    assert.isEqual(decoded.result.kind, WorkExecResultKind.Panic, "result kind");
    assert.isEqualBytes(decoded.authorizationOutput, BytesBlob.empty(), "empty authOut");
    return assert;
  }),

  test("Operand encodeTagged roundtrip", () => {
    const original = Operand.create(
      bytes32Fill(0x11),
      bytes32Fill(0x22),
      bytes32Fill(0x33),
      bytes32Fill(0x44),
      500,
      WorkExecResult.create(WorkExecResultKind.Ok, BytesBlob.parseBlob("0xff").okay!),
      BytesBlob.parseBlob("0xab").okay!,
    );

    const e = Encoder.create();
    accumulateItemCodec.encode(AccumulateItem.fromOperand(original), e);
    const d = Decoder.fromBlob(e.finishRaw());

    const assert = Assert.create();
    const tag = d.varU32();
    assert.isEqual(tag, AccumulateItemKind.Operand, "tag");

    const decoded = operandCodec.decode(d).okay!;
    assert.isEqualBytes(BytesBlob.wrap(decoded.hash.raw), BytesBlob.wrap(bytes32Fill(0x11).raw), "hash");
    assert.isEqual(decoded.gas, 500, "gas");
    assert.isEqual(decoded.result.kind, WorkExecResultKind.Ok, "result kind");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  // ─── PendingTransfer ───

  test("PendingTransfer roundtrip with full memo", () => {
    const memo = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    for (let i: u32 = 0; i < TRANSFER_MEMO_SIZE; i++) {
      memo.raw[i] = u8(i & 0xff);
    }
    const original = PendingTransfer.create(100, 200, 999999, memo, 50000);

    const e = Encoder.create();
    pendingTransferCodec.encode(original, e);
    const d = Decoder.fromBlob(e.finishRaw());
    const decoded = pendingTransferCodec.decode(d).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.source, 100, "source");
    assert.isEqual(decoded.destination, 200, "destination");
```
