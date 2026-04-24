---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L588-L660'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 5
chunk_total: 6
content_sha: 6da0ba20124a7310635568bfc95d72467cb7e95eec4a7c4ec6f16b22402dfc02
language: typescript
---
`sdk/jam/work-package.ts` (lines 588–660)

```typescript
// ─── WorkPackage ──────────────────────────────────────────────────────

/**
 * Full work package (GP type P, fetch kind 7).
 *
 * GP §14.3:
 *   P ≡ { j ∈ Y, h ∈ N_S, u ∈ H, p ∈ Y, x ∈ X, w ∈ ⟦I⟧ }
 *
 * Encoding: authToken(varlen) + authServiceId(u32) + authCodeHash(32)
 *         + authConfig(varlen) + context(RefinementContext)
 *         + workItems(varlen seq of WorkItem)
 */
export class WorkPackage {
  static create(
    authToken: BytesBlob,
    authServiceId: ServiceId,
    authCodeHash: CodeHash,
    authConfig: BytesBlob,
    context: RefinementContext,
    workItems: StaticArray<WorkItem>,
  ): WorkPackage {
    return new WorkPackage(authToken, authServiceId, authCodeHash, authConfig, context, workItems);
  }

  private constructor(
    /** Authorization token (j). */
    public authToken: BytesBlob,
    /** Service index hosting the authorization code (h). */
    public authServiceId: ServiceId,
    /** Authorization code hash (u). */
    public authCodeHash: CodeHash,
    /** Authorizer configuration blob (p). */
    public authConfig: BytesBlob,
    /** Refinement context (x). */
    public context: RefinementContext,
    /** Work items (w). */
    public workItems: StaticArray<WorkItem>,
  ) {}
}

export class WorkPackageCodec implements TryDecode<WorkPackage>, TryEncode<WorkPackage> {
  static create(refinementContext: RefinementContextCodec, workItem: WorkItemCodec): WorkPackageCodec {
    return new WorkPackageCodec(refinementContext, workItem);
  }
  private constructor(
    private readonly refinementContext: RefinementContextCodec,
    private readonly workItem: WorkItemCodec,
  ) {}

  decode(d: Decoder): Result<WorkPackage, DecodeError> {
    const authToken = d.bytesVarLen();
    const authServiceId = d.u32();
    const authCodeHash = d.bytes32();
    const authConfig = d.bytesVarLen();
    if (d.isError) return Result.err<WorkPackage, DecodeError>(DecodeError.MissingBytes);
    const ctx = d.object<RefinementContext>(this.refinementContext);
    if (ctx.isError) return Result.err<WorkPackage, DecodeError>(ctx.error);
    const items = d.sequenceVarLen<WorkItem>(this.workItem);
    if (items.isError) return Result.err<WorkPackage, DecodeError>(items.error);
    return Result.ok<WorkPackage, DecodeError>(
      WorkPackage.create(authToken, authServiceId, authCodeHash, authConfig, ctx.okay!, items.okay!),
    );
  }

  encode(v: WorkPackage, e: Encoder): void {
    e.bytesVarLen(v.authToken);
    e.u32(v.authServiceId);
    e.bytesFixLen(v.authCodeHash.bytes);
    e.bytesVarLen(v.authConfig);
    e.object<RefinementContext>(this.refinementContext, v.context);
    e.sequenceVarLen<WorkItem>(this.workItem, v.workItems);
  }
}
```
