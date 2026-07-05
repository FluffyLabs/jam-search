---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/designate.test.ts#L90-L152
title: packages/jam/jam-host-calls/accumulate/designate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a8912958dfecff9acffe77530d6af4a129a7903c5ca4277e23a0ee26439a69f8
language: typescript
---
`packages/jam/jam-host-calls/accumulate/designate.test.ts` (lines 90–152)

```typescript
        bls: Bytes.fill(BLS_KEY_BYTES, 2).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 2),
      }),
    ]);

    // when
    await designate.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(
      accumulate.validatorsData[0][0].toString(),
      `ValidatorData {
  bandersnatch: 0x0101010101010101010101010101010101010101010101010101010101010101
  ed25519: 0x0101010101010101010101010101010101010101010101010101010101010101
  bls: 0x010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
  metadata: 0x0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101
}`,
    );
    assert.deepStrictEqual(
      accumulate.validatorsData[0][1].toString(),
      `ValidatorData {
  bandersnatch: 0x0202020202020202020202020202020202020202020202020202020202020202
  ed25519: 0x0202020202020202020202020202020202020202020202020202020202020202
  bls: 0x020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202
  metadata: 0x0202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202
}`,
    );
    assert.deepStrictEqual(accumulate.validatorsData[0].length, tinyChainSpec.validatorsCount);
    assert.deepStrictEqual(accumulate.validatorsData.length, 1);
  });

  it("should fail when unprivileged service sets new validators", async () => {
    const accumulate = new PartialStateMock();
    accumulate.validatorDataResponse = Result.error(
      UnprivilegedError,
      () => "Test: unprivileged service attempting designate",
    );
    const serviceId = tryAsServiceId(10_000);
    const designate = Designate.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory([
      ValidatorData.create({
        ed25519: Bytes.fill(ED25519_KEY_BYTES, 1).asOpaque(),
        bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 1).asOpaque(),
        bls: Bytes.fill(BLS_KEY_BYTES, 1).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 1),
      }),
      ValidatorData.create({
        ed25519: Bytes.fill(ED25519_KEY_BYTES, 2).asOpaque(),
        bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 2).asOpaque(),
        bls: Bytes.fill(BLS_KEY_BYTES, 2).asOpaque(),
        metadata: Bytes.fill(VALIDATOR_META_BYTES, 2),
      }),
    ]);

    // when
    await designate.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.validatorsData.length, 0);
  });
});
```
