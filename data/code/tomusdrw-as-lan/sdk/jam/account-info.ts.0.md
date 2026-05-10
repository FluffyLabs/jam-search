---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/account-info.ts#L1-L113'
title: sdk/jam/account-info.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8d29e651c1c416354a610c4585d3819b2e2b51553fb5552bb088210cb61be918
language: typescript
---
`sdk/jam/account-info.ts` (lines 1–113)

```typescript
/**
 * Service account info returned by the `info` ecalli (ecalli 5).
 *
 * Fixed 96-byte binary layout (all little-endian):
 *   code_hash (32B), balance (8B), threshold_balance (8B),
 *   accumulate_min_gas (8B), on_transfer_min_gas (8B),
 *   storage_bytes (8B), storage_count (4B), gratis_storage (8B),
 *   created_slot (4B), last_accumulation_slot (4B), parent_service (4B)
 */

import { Bytes32 } from "../core/bytes";
import { DecodeError, Decoder, TryDecode } from "../core/codec/decode";
import { Encoder, TryEncode } from "../core/codec/encode";
import { Result } from "../core/result";

/** Total byte size of the encoded AccountInfo structure. */
export const ACCOUNT_INFO_SIZE: u32 = 96;

export class AccountInfo {
  static create(
    codeHash: Bytes32,
    balance: u64,
    thresholdBalance: u64,
    accumulateMinGas: u64,
    onTransferMinGas: u64,
    storageBytes: u64,
    storageCount: u32,
    gratisStorage: u64,
    createdSlot: u32,
    lastAccumulationSlot: u32,
    parentService: u32,
  ): AccountInfo {
    return new AccountInfo(
      codeHash,
      balance,
      thresholdBalance,
      accumulateMinGas,
      onTransferMinGas,
      storageBytes,
      storageCount,
      gratisStorage,
      createdSlot,
      lastAccumulationSlot,
      parentService,
    );
  }

  private constructor(
    public readonly codeHash: Bytes32,
    public readonly balance: u64,
    public readonly thresholdBalance: u64,
    public readonly accumulateMinGas: u64,
    public readonly onTransferMinGas: u64,
    public readonly storageBytes: u64,
    public readonly storageCount: u32,
    public readonly gratisStorage: u64,
    public readonly createdSlot: u32,
    public readonly lastAccumulationSlot: u32,
    public readonly parentService: u32,
  ) {}
}

export class AccountInfoCodec implements TryDecode<AccountInfo>, TryEncode<AccountInfo> {
  static create(): AccountInfoCodec {
    return new AccountInfoCodec();
  }

  private constructor() {}

  decode(d: Decoder): Result<AccountInfo, DecodeError> {
    const codeHash = d.bytes32();
    const balance = d.u64();
    const thresholdBalance = d.u64();
    const accumulateMinGas = d.u64();
    const onTransferMinGas = d.u64();
    const storageBytes = d.u64();
    const storageCount = d.u32();
    const gratisStorage = d.u64();
    const createdSlot = d.u32();
    const lastAccumulationSlot = d.u32();
    const parentService = d.u32();
    if (d.isError) return Result.err<AccountInfo, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<AccountInfo, DecodeError>(
      AccountInfo.create(
        codeHash,
        balance,
        thresholdBalance,
        accumulateMinGas,
        onTransferMinGas,
        storageBytes,
        storageCount,
        gratisStorage,
        createdSlot,
        lastAccumulationSlot,
        parentService,
      ),
    );
  }

  encode(value: AccountInfo, e: Encoder): void {
    e.bytes32(value.codeHash);
    e.u64(value.balance);
    e.u64(value.thresholdBalance);
    e.u64(value.accumulateMinGas);
    e.u64(value.onTransferMinGas);
    e.u64(value.storageBytes);
    e.u32(value.storageCount);
    e.u64(value.gratisStorage);
    e.u32(value.createdSlot);
    e.u32(value.lastAccumulationSlot);
    e.u32(value.parentService);
  }
}
```
