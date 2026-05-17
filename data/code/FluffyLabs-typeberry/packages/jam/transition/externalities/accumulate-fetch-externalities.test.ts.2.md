---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts#L193-L271
title: packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: 138b024b2389e90ccc725a6ee087454985f4c4e8b6ba38600e18c186541598dd
language: typescript
---
`packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts` (lines 193–271)

```typescript
    assert.strictEqual(result, null);
  });

  it("should return null when index is far out of bounds", () => {
    const operands = prepareOperands(3);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    const result = fetchExternalities.oneTransferOrOperand(tryAsU64(153));

    assert.strictEqual(result, null);
  });

  it("should have consistent encoding between all and one", () => {
    const operands = prepareOperands(2);
    const transfers = prepareTransfers(2);
    const chainSpec = tinyChainSpec;
    const allItems = toAllTransfersAndOperands(operands, transfers);
    const encodedAll = Encoder.encodeObject(codec.sequenceVarLen(TRANSFER_OR_OPERAND), allItems, chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands, transfers, chainSpec });

    const all = fetchExternalities.allTransfersAndOperands();
    assert.deepStrictEqual(all, encodedAll);

    for (let i = 0; i < operands.length + transfers.length; i++) {
      const one = fetchExternalities.oneTransferOrOperand(tryAsU64(i));
      const encodedOne = encodeOneTransferOrOperand(toOneTransferOrOperandAt(operands, transfers, i), chainSpec);
      assert.deepStrictEqual(one, encodedOne, `Mismatch at index ${i}`);
    }

    const outOfRange = fetchExternalities.oneTransferOrOperand(tryAsU64(operands.length + transfers.length));
    assert.strictEqual(outOfRange, null);
  });

  it("should handle only operands without transfers", () => {
    const operands = prepareOperands(5);
    const chainSpec = tinyChainSpec;
    const allItems = toAllTransfersAndOperands(operands, []);
    const encodedAll = Encoder.encodeObject(codec.sequenceVarLen(TRANSFER_OR_OPERAND), allItems, chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands, transfers: [], chainSpec });

    const result = fetchExternalities.allTransfersAndOperands();
    assert.deepStrictEqual(result, encodedAll);

    for (let i = 0; i < operands.length; i++) {
      const one = fetchExternalities.oneTransferOrOperand(tryAsU64(i));
      const encodedOne = encodeOneTransferOrOperand(toOneTransferOrOperandAt(operands, [], i), chainSpec);
      assert.deepStrictEqual(one, encodedOne, `Mismatch at operand index ${i}`);
    }

    const outOfRange = fetchExternalities.oneTransferOrOperand(tryAsU64(operands.length));
    assert.strictEqual(outOfRange, null);
  });

  it("should handle only transfers without operands", () => {
    const transfers = prepareTransfers(5);
    const chainSpec = tinyChainSpec;
    const allItems = toAllTransfersAndOperands([], transfers);
    const encodedAll = Encoder.encodeObject(codec.sequenceVarLen(TRANSFER_OR_OPERAND), allItems, chainSpec);

    const fetchExternalities = prepareAccumulateData({ operands: [], transfers, chainSpec });

    const result = fetchExternalities.allTransfersAndOperands();
    assert.deepStrictEqual(result, encodedAll);

    for (let i = 0; i < transfers.length; i++) {
      const one = fetchExternalities.oneTransferOrOperand(tryAsU64(i));
      const encodedOne = encodeOneTransferOrOperand(toOneTransferOrOperandAt([], transfers, i), chainSpec);
      assert.deepStrictEqual(one, encodedOne, `Mismatch at transfer index ${i}`);
    }

    const outOfRange = fetchExternalities.oneTransferOrOperand(tryAsU64(transfers.length));
    assert.strictEqual(outOfRange, null);
  });
});
```
