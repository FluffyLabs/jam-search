---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/types.ts#L1-L80'
title: sdk/jam/types.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0d12f59b11387e934edad2e767815d2dad81067e74a461a587a9a6b05dc3bcf3
language: typescript
---
`sdk/jam/types.ts` (lines 1–80)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";

// keccak256
export type MmrPeakHash = Bytes32;
// blake2b
export type StateRootHash = Bytes32;
// blake2b
export type HeaderHash = Bytes32;
// blake2b
export type CodeHash = Bytes32;
// blake2b
export type PayloadHash = Bytes32;
// blake2b
export type WorkPackageHash = Bytes32;
// blake2b (from VRF)
export type EntropyHash = Bytes32;

export type CoreIndex = u16;
export type Slot = u32;
export type ServiceId = u32;

/** Sentinel service ID meaning "the currently executing service". */
export const CURRENT_SERVICE: ServiceId = u32.MAX_VALUE;
export type WorkPayload = BytesBlob;
export type AuthOutput = BytesBlob;
export type WorkOutput = BytesBlob;

// ─── Validator keys ──────────────────────────────────────────────────

/** Ed25519 key size in bytes. */
export const ED25519_KEY_SIZE: u32 = 32;
/** Bandersnatch key size in bytes. */
export const BANDERSNATCH_KEY_SIZE: u32 = 32;
/** BLS key size in bytes. */
export const BLS_KEY_SIZE: u32 = 144;
/** Validator metadata size in bytes. */
export const VALIDATOR_METADATA_SIZE: u32 = 128;
/** Total size of a single ValidatorKey entry in bytes. */
export const VALIDATOR_KEY_SIZE: u32 =
  ED25519_KEY_SIZE + BANDERSNATCH_KEY_SIZE + BLS_KEY_SIZE + VALIDATOR_METADATA_SIZE;

/**
 * Validator key: Ed25519(32) + Bandersnatch(32) + BLS(144) + metadata(128) = 336 bytes.
 */
export class ValidatorKey {
  static create(ed25519: Bytes32, bandersnatch: Bytes32, bls: BytesBlob, metadata: BytesBlob): ValidatorKey {
    assert(<u32>bls.length === BLS_KEY_SIZE, `bls must be ${BLS_KEY_SIZE} bytes, got ${bls.length}`);
    assert(
      <u32>metadata.length === VALIDATOR_METADATA_SIZE,
      `metadata must be ${VALIDATOR_METADATA_SIZE} bytes, got ${metadata.length}`,
    );
    return new ValidatorKey(ed25519, bandersnatch, bls, metadata);
  }

  private constructor(
    public readonly ed25519: Bytes32,
    public readonly bandersnatch: Bytes32,
    public readonly bls: BytesBlob,
    public readonly metadata: BytesBlob,
  ) {}
}

// ─── Auto-accumulate entry ───────────────────────────────────────────

/** Auto-accumulate entry size: ServiceId(u32) + Gas(u64) = 12 bytes. */
export const AUTO_ACCUMULATE_ENTRY_SIZE: u32 = 12;

/**
 * An auto-accumulate service entry: service ID + minimum gas.
 */
export class AutoAccumulateEntry {
  static create(serviceId: ServiceId, gas: u64): AutoAccumulateEntry {
    return new AutoAccumulateEntry(serviceId, gas);
  }

  private constructor(
    public readonly serviceId: ServiceId,
    public readonly gas: u64,
  ) {}
}
```
