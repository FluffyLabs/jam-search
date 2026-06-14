---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/info.test.ts#L97-L176
title: packages/jam/jam-host-calls/general/info.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 3dd92a6b2fee5b72e62e038d5d5fc92168618112de1e99f018140f5153cb0657
language: typescript
---
`packages/jam/jam-host-calls/general/info.test.ts` (lines 97–176)

```typescript
      ...accounts.details.get(serviceId),
      thresholdBalance,
    });
  });

  it("should write ONLY PART of account info data into memory", async () => {
    const serviceId = tryAsServiceId(10_000);
    const currentServiceId = serviceId;
    const accounts = new TestAccounts(currentServiceId);
    const info = Info.new(currentServiceId, accounts);
    const { registers, memory, readRaw } = prepareRegsAndMemory(serviceId);
    registers.set(LEN_REG, tryAsU64(10));
    const storageUtilisationBytes = tryAsU64(10_000);
    const storageUtilisationCount = tryAsU32(1_000);

    accounts.details.set(
      serviceId,
      ServiceAccountInfo.create({
        codeHash: Bytes.fill(32, 5).asOpaque(),
        balance: tryAsU64(150_000),
        accumulateMinGas: tryAsServiceGas(0n),
        onTransferMinGas: tryAsServiceGas(0n),
        storageUtilisationBytes,
        storageUtilisationCount,
        ...serviceComp,
      }),
    );

    // when
    const result = await info.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), 96n);
    assert.deepStrictEqual(readRaw().toString(), "0x05050505050505050505");
  });

  it("should write none if account info is missing", async () => {
    const currentServiceId = tryAsServiceId(15_000);
    const accounts = new TestAccounts(currentServiceId);
    const info = Info.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const { registers, memory } = prepareRegsAndMemory(serviceId);

    // when
    const result = await info.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.NONE);
  });

  it("should panic if not enough memory allocated", async () => {
    const serviceId = tryAsServiceId(10_000);
    const currentServiceId = serviceId;
    const accounts = new TestAccounts(currentServiceId);
    const info = Info.new(serviceId, accounts);
    const { registers, memory } = prepareRegsAndMemory(serviceId, 10);
    const storageUtilisationBytes = tryAsU64(10_000);
    const storageUtilisationCount = tryAsU32(1_000);
    accounts.details.set(
      serviceId,
      ServiceAccountInfo.create({
        codeHash: Bytes.fill(32, 5).asOpaque(),
        balance: tryAsU64(150_000),
        accumulateMinGas: tryAsServiceGas(0n),
        onTransferMinGas: tryAsServiceGas(0n),
        storageUtilisationBytes,
        storageUtilisationCount,
        ...serviceComp,
      }),
    );

    // when
    const result = await info.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
  });
});
```
