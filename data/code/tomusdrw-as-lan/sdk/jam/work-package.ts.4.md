---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L472-L595'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 4
chunk_total: 6
content_sha: 1624f7619aed536c7bc00e4cbf9ba6b7d16910f4eac05c9449448ccef6ca2efd
language: typescript
---
`sdk/jam/work-package.ts` (lines 472–595)

```typescript
    public length: u32,
  ) {}
}

export class ExtrinsicRefCodec implements TryDecode<ExtrinsicRef>, TryEncode<ExtrinsicRef> {
  static create(): ExtrinsicRefCodec {
    return new ExtrinsicRefCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<ExtrinsicRef, DecodeError> {
    const v = ExtrinsicRef.create(d.bytes32(), d.varU32());
    if (d.isError) return Result.err<ExtrinsicRef, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<ExtrinsicRef, DecodeError>(v);
  }

  encode(v: ExtrinsicRef, e: Encoder): void {
    e.bytesFixLen(v.hash.bytes);
    e.varU64(u64(v.length));
  }
}

// ─── WorkItem ─────────────────────────────────────────────────────────

/**
 * Full work item (GP type I).
 *
 * GP §14.3:
 *   I ≡ { s ∈ N_S, h ∈ H, y ∈ Y, g ∈ N_G, a ∈ N_G, e ∈ N,
 *         i ∈ C{H ∪ (H⊞), N}H, x ∈ ⟦(H, N)⟧ }
 *
 * Encoding: serviceId(u32) + codeHash(32) + payload(varlen)
 *         + gasRefine(u64) + gasAccumulate(u64) + exportCount(varU64)
 *         + imports(varlen seq of ImportRef) + extrinsics(varlen seq of ExtrinsicRef)
 */
export class WorkItem {
  static create(
    serviceId: ServiceId,
    codeHash: CodeHash,
    payload: BytesBlob,
    gasRefine: u64,
    gasAccumulate: u64,
    exportCount: u32,
    imports: StaticArray<ImportRef>,
    extrinsics: StaticArray<ExtrinsicRef>,
  ): WorkItem {
    return new WorkItem(serviceId, codeHash, payload, gasRefine, gasAccumulate, exportCount, imports, extrinsics);
  }

  private constructor(
    /** Service index this work item relates to. */
    public serviceId: ServiceId,
    /** Code hash of the service at time of reporting. */
    public codeHash: CodeHash,
    /** Work-item payload. */
    public payload: BytesBlob,
    /** Gas limit for refinement. */
    public gasRefine: u64,
    /** Gas limit for accumulation. */
    public gasAccumulate: u64,
    /** Number of data segments to export. */
    public exportCount: u32,
    /** Imported data segment references. */
    public imports: StaticArray<ImportRef>,
    /** Extrinsic data references (hash + length). */
    public extrinsics: StaticArray<ExtrinsicRef>,
  ) {}
}

export class WorkItemCodec implements TryDecode<WorkItem>, TryEncode<WorkItem> {
  static create(importRef: ImportRefCodec, extrinsicRef: ExtrinsicRefCodec): WorkItemCodec {
    return new WorkItemCodec(importRef, extrinsicRef);
  }
  private constructor(
    private readonly importRef: ImportRefCodec,
    private readonly extrinsicRef: ExtrinsicRefCodec,
  ) {}

  decode(d: Decoder): Result<WorkItem, DecodeError> {
    const serviceId = d.u32();
    const codeHash = d.bytes32();
    const payload = d.bytesVarLen();
    const gasRefine = d.u64();
    const gasAccumulate = d.u64();
    const exportCount = d.varU32();
    if (d.isError) return Result.err<WorkItem, DecodeError>(DecodeError.MissingBytes);
    const imports = d.sequenceVarLen<ImportRef>(this.importRef);
    if (imports.isError) return Result.err<WorkItem, DecodeError>(imports.error);
    const extrinsics = d.sequenceVarLen<ExtrinsicRef>(this.extrinsicRef);
    if (extrinsics.isError) return Result.err<WorkItem, DecodeError>(extrinsics.error);
    return Result.ok<WorkItem, DecodeError>(
      WorkItem.create(
        serviceId,
        codeHash,
        payload,
        gasRefine,
        gasAccumulate,
        exportCount,
        imports.okay!,
        extrinsics.okay!,
      ),
    );
  }

  encode(v: WorkItem, e: Encoder): void {
    e.u32(v.serviceId);
    e.bytesFixLen(v.codeHash.bytes);
    e.bytesVarLen(v.payload);
    e.u64(v.gasRefine);
    e.u64(v.gasAccumulate);
    e.varU64(u64(v.exportCount));
    e.sequenceVarLen<ImportRef>(this.importRef, v.imports);
    e.sequenceVarLen<ExtrinsicRef>(this.extrinsicRef, v.extrinsics);
  }
}

// ─── WorkPackage ──────────────────────────────────────────────────────

/**
 * Full work package (GP type P, fetch kind 7).
 *
 * GP §14.3:
 *   P ≡ { j ∈ Y, h ∈ N_S, u ∈ H, p ∈ Y, x ∈ X, w ∈ ⟦I⟧ }
 *
```
