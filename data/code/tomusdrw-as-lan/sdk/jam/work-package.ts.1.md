---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L121-L238'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 6
content_sha: 476872812d57698cb7e72fab13df807ba98f9c6f621b54d8483447cfc6158a27
language: typescript
---
`sdk/jam/work-package.ts` (lines 121–238)

```typescript
    public gasAccumulateReport: u64,
    /** G_I: Gas allocated for is_authorized invocation. */
    public gasIsAuthorized: u64,
    /** G_R: Maximum gas for a single refine invocation. */
    public gasMaxRefine: u64,
    /** G_T: Maximum total gas per block. */
    public gasMaxBlock: u64,
    /** H: Recent history length (number of recent blocks tracked). */
    public recentHistoryLength: u16,
    /** I: Maximum number of work items per work package. */
    public maxWorkItems: u16,
    /** J: Maximum number of work-report dependencies. */
    public maxReportDeps: u16,
    /** K: Maximum tickets per extrinsic. */
    public maxTicketsPerExtrinsic: u16,
    /** L: Maximum lookup-anchor age (timeslots). */
    public maxLookupAnchorAge: u32,
    /** N: Tickets per validator. */
    public ticketsPerValidator: u16,
    /** O: Maximum authorizers per core. */
    public maxAuthorizersPerCore: u16,
    /** P: Slot duration (seconds). */
    public slotDuration: u16,
    /** Q: Authorizers queue size. */
    public authorizersQueueSize: u16,
    /** R: Rotation period (timeslots). */
    public rotationPeriod: u16,
    /** T: Maximum extrinsics per work item. */
    public maxExtrinsicsPerWorkItem: u16,
    /** U: Report timeout grace period (timeslots). */
    public reportTimeoutGracePeriod: u16,
    /** V: Number of validators. */
    public validatorsCount: u16,
    /** W_A: Maximum allocated work-package size (bytes). */
    public maxAllocatedWorkPackageSize: u32,
    /** W_B: Maximum encoded work-package size (bytes). */
    public maxEncodedWorkPackageSize: u32,
    /** W_C: Maximum authorizer code size (bytes). */
    public maxAuthorizerCodeSize: u32,
    /** W_E: Erasure-coded piece size (bytes). */
    public erasureCodedPieceSize: u32,
    /** W_M: Maximum total import segments per work package. */
    public maxImportSegments: u32,
    /** W_P: Number of erasure-coded pieces per segment. */
    public ecPiecesPerSegment: u32,
    /** W_R: Maximum work-report size (bytes). */
    public maxWorkReportSize: u32,
    /** W_T: Transfer memo size (bytes). */
    public transferMemoSize: u32,
    /** W_X: Maximum total export segments per work package. */
    public maxExportSegments: u32,
    /** Y: Contest length (timeslots). */
    public contestLength: u32,
  ) {}
}

export class ProtocolConstantsCodec implements TryDecode<ProtocolConstants>, TryEncode<ProtocolConstants> {
  static create(): ProtocolConstantsCodec {
    return new ProtocolConstantsCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<ProtocolConstants, DecodeError> {
    const c = ProtocolConstants.create(
      d.u64(),
      d.u64(),
      d.u64(), // B_I, B_L, B_S
      d.u16(),
      d.u32(),
      d.u32(), // C, D, E
      d.u64(),
      d.u64(),
      d.u64(),
      d.u64(), // G_A, G_I, G_R, G_T
      d.u16(),
      d.u16(),
      d.u16(),
      d.u16(), // H, I, J, K
      d.u32(), // L
      d.u16(),
      d.u16(),
      d.u16(),
      d.u16(),
      d.u16(),
      d.u16(),
      d.u16(), // N, O, P, Q, R, T, U
      d.u16(), // V
      d.u32(),
      d.u32(),
      d.u32(),
      d.u32(),
      d.u32(), // W_A, W_B, W_C, W_E, W_M
      d.u32(),
      d.u32(),
      d.u32(),
      d.u32(),
      d.u32(), // W_P, W_R, W_T, W_X, Y
    );
    if (d.isError) return Result.err<ProtocolConstants, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<ProtocolConstants, DecodeError>(c);
  }

  encode(v: ProtocolConstants, e: Encoder): void {
    e.u64(v.electiveItemBalance);
    e.u64(v.electiveByteBalance);
    e.u64(v.baseServiceBalance);
    e.u16(v.coreCount);
    e.u32(v.preimageExpungePeriod);
    e.u32(v.epochLength);
    e.u64(v.gasAccumulateReport);
    e.u64(v.gasIsAuthorized);
    e.u64(v.gasMaxRefine);
    e.u64(v.gasMaxBlock);
    e.u16(v.recentHistoryLength);
    e.u16(v.maxWorkItems);
    e.u16(v.maxReportDeps);
    e.u16(v.maxTicketsPerExtrinsic);
    e.u32(v.maxLookupAnchorAge);
```
