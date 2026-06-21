---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L232-L357'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 2
chunk_total: 6
content_sha: 1306f07ce0a4e90ca036fa97579b5e925e87124cf6c3998b04274ad22a2d5ab0
language: typescript
---
`sdk/jam/work-package.ts` (lines 232–357)

```typescript
    e.u64(v.gasMaxRefine);
    e.u64(v.gasMaxBlock);
    e.u16(v.recentHistoryLength);
    e.u16(v.maxWorkItems);
    e.u16(v.maxReportDeps);
    e.u16(v.maxTicketsPerExtrinsic);
    e.u32(v.maxLookupAnchorAge);
    e.u16(v.ticketsPerValidator);
    e.u16(v.maxAuthorizersPerCore);
    e.u16(v.slotDuration);
    e.u16(v.authorizersQueueSize);
    e.u16(v.rotationPeriod);
    e.u16(v.maxExtrinsicsPerWorkItem);
    e.u16(v.reportTimeoutGracePeriod);
    e.u16(v.validatorsCount);
    e.u32(v.maxAllocatedWorkPackageSize);
    e.u32(v.maxEncodedWorkPackageSize);
    e.u32(v.maxAuthorizerCodeSize);
    e.u32(v.erasureCodedPieceSize);
    e.u32(v.maxImportSegments);
    e.u32(v.ecPiecesPerSegment);
    e.u32(v.maxWorkReportSize);
    e.u32(v.transferMemoSize);
    e.u32(v.maxExportSegments);
    e.u32(v.contestLength);
  }
}

// ─── RefinementContext ────────────────────────────────────────────────

/**
 * Refinement context (fetch kind 10).
 *
 * Corresponds to GP type X ≡ { a, s, b, l, t, p }.
 *
 * Encoding: anchor(32) + stateRoot(32) + beefyRoot(32)
 *         + lookupAnchor(32) + timeslot(u32 LE)
 *         + prerequisites(varlen sequence of Bytes32)
 */
export class RefinementContext {
  static create(
    anchor: Bytes32,
    stateRoot: Bytes32,
    beefyRoot: Bytes32,
    lookupAnchor: Bytes32,
    timeslot: u32,
    prerequisites: StaticArray<Bytes32>,
  ): RefinementContext {
    return new RefinementContext(anchor, stateRoot, beefyRoot, lookupAnchor, timeslot, prerequisites);
  }

  private constructor(
    /** Anchor block header hash. */
    public anchor: Bytes32,
    /** Posterior state root of the anchor block. */
    public stateRoot: Bytes32,
    /** Posterior Beefy root of the anchor block. */
    public beefyRoot: Bytes32,
    /** Lookup-anchor block header hash. */
    public lookupAnchor: Bytes32,
    /** Lookup-anchor timeslot. */
    public timeslot: u32,
    /** Prerequisite work-package hashes. */
    public prerequisites: StaticArray<Bytes32>,
  ) {}
}

export class RefinementContextCodec implements TryDecode<RefinementContext>, TryEncode<RefinementContext> {
  static create(bytes32: Bytes32Codec): RefinementContextCodec {
    return new RefinementContextCodec(bytes32);
  }
  private constructor(private readonly bytes32: Bytes32Codec) {}

  decode(d: Decoder): Result<RefinementContext, DecodeError> {
    const anchor = d.bytes32();
    const stateRoot = d.bytes32();
    const beefyRoot = d.bytes32();
    const lookupAnchor = d.bytes32();
    const timeslot = d.u32();
    if (d.isError) return Result.err<RefinementContext, DecodeError>(DecodeError.MissingBytes);
    const prereqs = d.sequenceVarLen<Bytes32>(this.bytes32);
    if (prereqs.isError) return Result.err<RefinementContext, DecodeError>(prereqs.error);
    return Result.ok<RefinementContext, DecodeError>(
      RefinementContext.create(anchor, stateRoot, beefyRoot, lookupAnchor, timeslot, prereqs.okay!),
    );
  }

  encode(v: RefinementContext, e: Encoder): void {
    e.bytesFixLen(v.anchor.bytes);
    e.bytesFixLen(v.stateRoot.bytes);
    e.bytesFixLen(v.beefyRoot.bytes);
    e.bytesFixLen(v.lookupAnchor.bytes);
    e.u32(v.timeslot);
    e.sequenceVarLen<Bytes32>(this.bytes32, v.prerequisites);
  }
}

// ─── WorkItemInfo ─────────────────────────────────────────────────────

/**
 * Work-item summary (fetch kinds 11-12).
 *
 * Corresponds to GP function S(w).
 *
 * Encoding: serviceId(u32) + codeHash(32) + gasRefine(u64) + gasAccumulate(u64)
 *         + exportCount(u16) + importCount(u16) + extrinsicCount(u16)
 *         + payloadLength(u32)
 */
export class WorkItemInfo {
  static create(
    serviceId: ServiceId,
    codeHash: CodeHash,
    gasRefine: u64,
    gasAccumulate: u64,
    exportCount: u16,
    importCount: u16,
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
```
