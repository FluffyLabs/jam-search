---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/query.test.ts#L194-L202
title: packages/jam/jam-host-calls/accumulate/query.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: dc04322178c197a9805fcaf7e21e84120dae409c4086f1def0eb075876afca33
language: typescript
---
`packages/jam/jam-host-calls/accumulate/query.test.ts` (lines 194–202)

```typescript
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), (BigInt(timeslot1) << UPPER_BITS_SHIFT) + 3n);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), (BigInt(timeslot3) << UPPER_BITS_SHIFT) + BigInt(timeslot2));
    assert.deepStrictEqual(accumulate.checkPreimageStatusData, [[Bytes.fill(HASH_SIZE, 0xaa), w8]]);
  });
});
```
