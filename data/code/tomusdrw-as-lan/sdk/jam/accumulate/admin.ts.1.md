---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.ts#L120-L188
title: sdk/jam/accumulate/admin.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7c849b77f7ba25586d12224ba5ba855b84b81173caf096c87f9b03560ebfd31c
language: typescript
---
`sdk/jam/accumulate/admin.ts` (lines 120–188)

```typescript
    const authQueueBlob = encodeBytes32Array(authQueue);
    const result = assign_(core, authQueueBlob.ptr(), newAssigner);
    if (result === EcalliResult.CORE) return ResultN.err<bool, AssignError>(AssignError.Core);
    if (result === EcalliResult.WHO) return ResultN.err<bool, AssignError>(AssignError.Who);
    if (result === EcalliResult.HUH) return ResultN.err<bool, AssignError>(AssignError.Huh);
    if (result >= 0) return ResultN.ok<bool, AssignError>(true);
    panic("Admin.assign: unexpected sentinel");
    return unreachable();
  }

  /**
   * Set the next epoch's validator keys (ecalli 16).
   *
   * @param validators - array of validator keys
   */
  designate(validators: ValidatorKey[]): ResultN<bool, DesignateError> {
    const blob = encodeValidators(validators);
    const result = designate_(blob.ptr());
    if (result === EcalliResult.HUH) return ResultN.err<bool, DesignateError>(DesignateError.Huh);
    if (result >= 0) return ResultN.ok<bool, DesignateError>(true);
    panic("Admin.designate: unexpected sentinel");
    return unreachable();
  }
}

function mapBlessResult(result: i64): ResultN<bool, BlessError> {
  if (result === EcalliResult.WHO) return ResultN.err<bool, BlessError>(BlessError.Who);
  if (result === EcalliResult.HUH) return ResultN.err<bool, BlessError>(BlessError.Huh);
  if (result >= 0) return ResultN.ok<bool, BlessError>(true);
  panic("Admin.bless: unexpected sentinel");
  return unreachable();
}

function encodeServiceIds(ids: ServiceId[]): BytesBlob {
  const enc = Encoder.create(ids.length * 4);
  for (let i = 0; i < ids.length; i++) {
    enc.u32(ids[i]);
  }
  return enc.finish();
}

function encodeAutoAccumulate(entries: AutoAccumulateEntry[]): BytesBlob {
  const enc = Encoder.create(entries.length * AUTO_ACCUMULATE_ENTRY_SIZE);
  for (let i = 0; i < entries.length; i++) {
    enc.u32(entries[i].serviceId);
    enc.u64(entries[i].gas);
  }
  return enc.finish();
}

function encodeBytes32Array(hashes: Bytes32[]): BytesBlob {
  const enc = Encoder.create(hashes.length * 32);
  for (let i = 0; i < hashes.length; i++) {
    enc.bytes32(hashes[i]);
  }
  return enc.finish();
}

function encodeValidators(validators: ValidatorKey[]): BytesBlob {
  const enc = Encoder.create(validators.length * VALIDATOR_KEY_SIZE);
  for (let i = 0; i < validators.length; i++) {
    const v = validators[i];
    enc.bytes32(v.ed25519);
    enc.bytes32(v.bandersnatch);
    enc.bytesFixLen(v.bls);
    enc.bytesFixLen(v.metadata);
  }
  return enc.finish();
}
```
