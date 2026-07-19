---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/service-data.ts#L1-L100'
title: sdk/jam/service-data.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3a3f80305b5486847abaac8dcde95383390cc43d6c28e9fd24d202ba4fcf0ea6
language: typescript
---
`sdk/jam/service-data.ts` (lines 1–100)

```typescript
/**
 * High-level wrappers for service storage and info ecallis.
 *
 * - {@link ServiceData} — read-only access to any service (info, read).
 * - {@link CurrentServiceData} — adds write access for the current service.
 */

import { BytesBlob } from "../core/bytes";
import { Decoder } from "../core/codec/decode";
import { panic } from "../core/panic";
import { Optional, OptionalN, Result } from "../core/result";
import { EcalliResult } from "../ecalli";
import { info } from "../ecalli/general/info";
import { read } from "../ecalli/general/read";
import { write } from "../ecalli/general/write";
import { ACCOUNT_INFO_SIZE, AccountInfo, AccountInfoCodec } from "./account-info";
import { CURRENT_SERVICE } from "./types";

export enum WriteError {
  /** Storage quota exceeded (FULL sentinel). */
  Full = 0,
}

export class ServiceData {
  static create(serviceId: u32, bufSize: u32 = 1024): ServiceData {
    return new ServiceData(serviceId, bufSize);
  }

  protected buf: Uint8Array;

  private _accountInfoCodec: AccountInfoCodec | null = null;

  protected constructor(
    protected readonly serviceId: u32,
    bufSize: u32,
  ) {
    this.buf = new Uint8Array(bufSize);
  }

  private get accountInfoCodec(): AccountInfoCodec {
    if (this._accountInfoCodec === null) this._accountInfoCodec = AccountInfoCodec.create();
    return this._accountInfoCodec!;
  }

  /** Get account info for this service. Returns None if the service does not exist. */
  info(): Optional<AccountInfo> {
    // Ensure buffer is large enough for the 96-byte info structure.
    if (u32(this.buf.length) < ACCOUNT_INFO_SIZE) {
      this.buf = new Uint8Array(ACCOUNT_INFO_SIZE);
    }
    const result = info(this.serviceId, u32(this.buf.dataStart), 0, ACCOUNT_INFO_SIZE);
    if (result === EcalliResult.NONE) return Optional.none<AccountInfo>();
    if (result !== i64(ACCOUNT_INFO_SIZE)) panic("ServiceData.info: host returned invalid info length");

    const d = Decoder.fromBlob(this.buf.subarray(0, u32(result)));
    const r = this.accountInfoCodec.decode(d);
    if (r.isError || !d.isFinished()) panic("ServiceData.info: host returned malformed data");
    return Optional.some<AccountInfo>(r.okay!);
  }

  /** Read a value from storage by key. Returns None if the key does not exist. */
  read(key: BytesBlob): Optional<BytesBlob> {
    let result = read(this.serviceId, key.ptr(), key.length, u32(this.buf.dataStart), 0, this.buf.length);
    if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();

    // Auto-expand: the host told us the total length exceeds our buffer.
    if (result > i64(this.buf.length)) {
      this.buf = new Uint8Array(u32(result));
      result = read(this.serviceId, key.ptr(), key.length, u32(this.buf.dataStart), 0, this.buf.length);
      if (result === EcalliResult.NONE) return Optional.none<BytesBlob>();
    }

    const len = u32(min(i64(this.buf.length), result));
    return Optional.some<BytesBlob>(BytesBlob.wrap(this.buf.slice(0, len)));
  }
}

export class CurrentServiceData extends ServiceData {
  static create(bufSize: u32 = 1024): CurrentServiceData {
    return new CurrentServiceData(bufSize);
  }

  private constructor(bufSize: u32) {
    super(CURRENT_SERVICE, bufSize);
  }

  /**
   * Write a value to storage.
   *
   * Returns the previous value's length wrapped in Optional (None if no prior value existed).
   * Fails with WriteError.Full if the storage quota is exceeded.
   * Pass `BytesBlob.empty()` to delete the entry.
   */
  write(key: BytesBlob, value: BytesBlob): Result<OptionalN<u64>, WriteError> {
    const result = write(key.ptr(), key.length, value.ptr(), value.length);
    if (result === EcalliResult.FULL) return Result.err<OptionalN<u64>, WriteError>(WriteError.Full);
    if (result === EcalliResult.NONE) return Result.ok<OptionalN<u64>, WriteError>(OptionalN.none<u64>());
    return Result.ok<OptionalN<u64>, WriteError>(OptionalN.some<u64>(u64(result)));
  }
}
```
