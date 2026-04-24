---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts#L102-L200
title: packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: b0338d771f50a6886d4f12621e2d32f31d519d8986fdc6c9aea6d65d9445ceb1
language: typescript
---
`packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts` (lines 102–200)

```typescript
      entropy ?? defaultEntropy,
      transfers ?? defaultTransfers,
      operands ?? defaultOperands,
      chainSpec ?? defaultChainSpec,
    );
  };

  it("should return different constants for different chain specs", () => {
    const tinyFetchExternalities = prepareAccumulateData({ chainSpec: tinyChainSpec });
    const fullFetchExternalities = prepareAccumulateData({ chainSpec: fullChainSpec });

    const tinyConstants = tinyFetchExternalities.constants();
    const fullConstants = fullFetchExternalities.constants();

    assert.notStrictEqual(tinyConstants.length, 0);
    assert.notStrictEqual(fullConstants.length, 0);
    assert.notDeepStrictEqual(tinyConstants, fullConstants);
  });

  it("should return entropy hash", () => {
    const expectedEntropy: EntropyHash = Bytes.fill(HASH_SIZE, 5).asOpaque();
    const fetchExternalities = prepareAccumulateData({ entropy: expectedEntropy });

    const entropy = fetchExternalities.entropy();

    assert.deepStrictEqual(entropy, expectedEntropy);
  });

  it("should return all transfers and operands", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;
    const expected = toAllTransfersAndOperands(operands, transfers);
    const encodedExpected = Encoder.encodeObject(codec.sequenceVarLen(TRANSFER_OR_OPERAND), expected, chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    const result = fetchExternalities.allTransfersAndOperands();

    assert.deepStrictEqual(result, encodedExpected);
  });

  it("should return empty encoded sequence when no transfers and no operands", () => {
    const chainSpec = tinyChainSpec;
    const encodedExpected = Encoder.encodeObject(codec.sequenceVarLen(TRANSFER_OR_OPERAND), [], chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands: [], transfers: [], chainSpec });

    const result = fetchExternalities.allTransfersAndOperands();

    assert.deepStrictEqual(result, encodedExpected);
  });

  it("should return one transfer by index (first range)", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;
    const encodedExpected = encodeOneTransferOrOperand(toOneTransferOrOperandAt(operands, transfers, 0), chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    // Transfers come first (indices 0..1), then operands (indices 2..4)
    const result = fetchExternalities.oneTransferOrOperand(tryAsU64(0));

    assert.deepStrictEqual(result, encodedExpected);
  });

  it("should return one operand by index (second range)", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;
    const encodedExpected = encodeOneTransferOrOperand(toOneTransferOrOperandAt(operands, transfers, 2), chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    // Operands start after transfers, so index 2 is the first operand
    const result = fetchExternalities.oneTransferOrOperand(tryAsU64(2));

    assert.deepStrictEqual(result, encodedExpected);
  });

  it("should return null when index is out of bounds", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    // Total items: 3 operands + 2 transfers = 5, so index 5 is out of bounds
    const result = fetchExternalities.oneTransferOrOperand(tryAsU64(5));

    assert.strictEqual(result, null);
  });

  it("should return null when index is far out of bounds", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;

```
