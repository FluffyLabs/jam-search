---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L348-L479'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 3
chunk_total: 6
content_sha: d0439292c288c6253528de84229cc09df66f93e64fee16e206f14b6e45cd1130
language: typescript
---
`sdk/jam/work-package.ts` (lines 348–479)

```typescript
    extrinsicCount: u16,
    payloadLength: u32,
  ): WorkItemInfo {
    return new WorkItemInfo(
      serviceId,
      codeHash,
      gasRefine,
      gasAccumulate,
      exportCount,
      importCount,
      extrinsicCount,
      payloadLength,
    );
  }

  private constructor(
    /** Service index this work item relates to. */
    public serviceId: ServiceId,
    /** Code hash of the service at time of reporting. */
    public codeHash: CodeHash,
    /** Gas limit for refinement. */
    public gasRefine: u64,
    /** Gas limit for accumulation. */
    public gasAccumulate: u64,
    /** Number of exported data segments. */
    public exportCount: u16,
    /** Number of imported data segments. */
    public importCount: u16,
    /** Number of extrinsic data items. */
    public extrinsicCount: u16,
    /** Length of the work-item payload in bytes. */
    public payloadLength: u32,
  ) {}
}

export class WorkItemInfoCodec implements TryDecode<WorkItemInfo>, TryEncode<WorkItemInfo> {
  static create(): WorkItemInfoCodec {
    return new WorkItemInfoCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<WorkItemInfo, DecodeError> {
    const v = WorkItemInfo.create(d.u32(), d.bytes32(), d.u64(), d.u64(), d.u16(), d.u16(), d.u16(), d.u32());
    if (d.isError) return Result.err<WorkItemInfo, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<WorkItemInfo, DecodeError>(v);
  }

  encode(v: WorkItemInfo, e: Encoder): void {
    e.u32(v.serviceId);
    e.bytesFixLen(v.codeHash.bytes);
    e.u64(v.gasRefine);
    e.u64(v.gasAccumulate);
    e.u16(v.exportCount);
    e.u16(v.importCount);
    e.u16(v.extrinsicCount);
    e.u32(v.payloadLength);
  }
}

// ─── ImportRef ────────────────────────────────────────────────────────

/**
 * Reference to an imported data segment within a work item.
 *
 * GP §14.3: each import is identified by a hash (segment-root H or
 * work-package hash H⊞) and a segment index.
 *
 * Encoding: tag(u8: 0=segment-root, 1=work-package) + hash(32) + index(varU64)
 */
export class ImportRef {
  static create(hash: Bytes32, isWorkPackageHash: bool, index: u32): ImportRef {
    return new ImportRef(hash, isWorkPackageHash, index);
  }

  private constructor(
    /** Segment-root hash or work-package hash. */
    public hash: Bytes32,
    /** True if hash identifies a work-package (H⊞), false for segment-root (H). */
    public isWorkPackageHash: bool,
    /** Segment index within the identified package/root. */
    public index: u32,
  ) {}
}

export class ImportRefCodec implements TryDecode<ImportRef>, TryEncode<ImportRef> {
  static create(): ImportRefCodec {
    return new ImportRefCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<ImportRef, DecodeError> {
    const tag = d.u8();
    if (tag > 1) return Result.err<ImportRef, DecodeError>(DecodeError.InvalidData);
    const hash = d.bytes32();
    const index = d.varU32();
    if (d.isError) return Result.err<ImportRef, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<ImportRef, DecodeError>(ImportRef.create(hash, tag === 1, index));
  }

  encode(v: ImportRef, e: Encoder): void {
    e.u8(v.isWorkPackageHash ? 1 : 0);
    e.bytesFixLen(v.hash.bytes);
    e.varU64(u64(v.index));
  }
}

// ─── ExtrinsicRef ─────────────────────────────────────────────────────

/**
 * Extrinsic data reference within a work item.
 *
 * GP §14.3: x ∈ ⟦(H, N)⟧ — hash and length of data to be introduced.
 *
 * Encoding: hash(32) + length(varU64)
 */
export class ExtrinsicRef {
  static create(hash: Bytes32, length: u32): ExtrinsicRef {
    return new ExtrinsicRef(hash, length);
  }

  private constructor(
    /** Hash of the extrinsic data. */
    public hash: Bytes32,
    /** Length of the extrinsic data in bytes. */
    public length: u32,
  ) {}
}

export class ExtrinsicRefCodec implements TryDecode<ExtrinsicRef>, TryEncode<ExtrinsicRef> {
  static create(): ExtrinsicRefCodec {
    return new ExtrinsicRefCodec();
  }
```
