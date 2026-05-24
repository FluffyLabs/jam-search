---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/new.test.ts#L209-L231
title: packages/jam/jam-host-calls/accumulate/new.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: bd3661ebf192c83a41ba06a6ae368cdbf7872ae04a471518d0c9b769f9926bfc
language: typescript
---
`packages/jam/jam-host-calls/accumulate/new.test.ts` (lines 209–231)

```typescript
      NewServiceError.RegistrarServiceIdAlreadyTaken,
      () => "Test: service ID already taken",
    );
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(4_096n),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      tryAsU64(1_024n),
      tryAsU64(serviceId),
    );

    // when
    await n.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.FULL);
    const gratisStorage = 1_024n;
    assert.deepStrictEqual(accumulate.newServiceCalled, [
      [Bytes.fill(HASH_SIZE, 0x69), 4_096n, 2n ** 40n, 2n ** 50n, gratisStorage, 10n],
    ]);
  });
});
```
