---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.ts#L122-L267
title: packages/jam/jam-host-calls/general/fetch.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 4
content_sha: 1e38d420bc3ab81c705ec4ee4a0cccf213183819918f419eb9db479e07229cbc
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.ts` (lines 122–267)

```typescript
  /**
   * Kind 0: Encoded constants info (𝐜).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315001315001?v=0.7.2
   */
  constants(): BytesBlob;

  /**
   * Kind 1: Entropy pool - H₀ (zero hash).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/2fe0012fe201?v=0.7.2
   */
  entropy(): EntropyHash;

  /**
   * Kind 2: Authorizer trace (𝐫).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/314902314902?v=0.7.2
   */
  authorizerTrace(): BytesBlob;

  /**
   * Kind 3 (other) / Kind 4 (my): Work-item extrinsics (x̄).
   *
   * When workItem is null, uses Kind 4 (current work item's extrinsics).
   * When workItem is provided, uses Kind 3 (other work item's extrinsics).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315402315402?v=0.7.2
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/317302317302?v=0.7.2
   */
  workItemExtrinsic(workItem: U64 | null, index: U64): BytesBlob | null;

  /**
   * Kind 5 (other) / Kind 6 (my): Import segments (ī).
   *
   * When workItem is null, uses Kind 6 (current work item's imports).
   * When workItem is provided, uses Kind 5 (other work item's imports).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/318b02318b02?v=0.7.2
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31aa0231aa02?v=0.7.2
   */
  workItemImport(workItem: U64 | null, index: U64): BytesBlob | null;

  /**
   * Kind 7: Encoded work package - E(p).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31c10231c102?v=0.7.2
   */
  workPackage(): BytesBlob;

  /**
   * Kind 8: Authorizer configuration - p_f.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31c80231c802?v=0.7.2
   */
  authConfiguration(): BytesBlob;

  /**
   * Kind 9: Authorization token - p_j.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31cf0231cf02?v=0.7.2
   */
  authToken(): BytesBlob;

  /**
   * Kind 10: Refinement context - E(p_x).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31da0231da02?v=0.7.2
   */
  refineContext(): BytesBlob;

  /**
   * Kind 11: All work-item summaries - E(↕[S(w) | w ← p_w]).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31f40231f402?v=0.7.2
   */
  allWorkItems(): BytesBlob;

  /**
   * Kind 12: Single work-item summary - S(p_w[φ₁₁]).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/31fc0231fc02?v=0.7.2
   */
  oneWorkItem(workItem: U64): BytesBlob | null;

  /**
   * Kind 13: Work-item payload - p_w[φ₁₁]_y.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/313b03313b03?v=0.7.2
   */
  workItemPayload(workItem: U64): BytesBlob | null;
}

/**
 * Fetch externalities for the Accumulate context.
 *
 * Ω_Y(ρ, φ, μ, ∅, η'₀, ∅, ∅, ∅, ∅, 𝐢, (x,y))
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/30c00030c000?v=0.7.2
 *
 * Available kinds: 0 (constants), 1 (entropy), 14-15 (accumulation items)
 */
export interface IAccumulateFetch {
  readonly context: FetchContext.Accumulate;

  /**
   * Kind 0: Encoded constants info (𝐜).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315001315001?v=0.7.2
   */
  constants(): BytesBlob;

  /**
   * Kind 1: Entropy pool - η'₀ (posterior entropy).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/314302314602?v=0.7.2
   */
  entropy(): EntropyHash;

  /**
   * Kind 14: All accumulation operands and transfers - E(↕𝐢).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/314e03314e03?v=0.7.2
   */
  allTransfersAndOperands(): BytesBlob | null;

  /**
   * Kind 15: Single accumulation operand or transfer - E(𝐢[φ₁₁]).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315903315903?v=0.7.2
   */
  oneTransferOrOperand(index: U64): BytesBlob | null;
}

/**
 * Union of all context-specific fetch externality interfaces.
 */
export type IFetchExternalities = IIsAuthorizedFetch | IRefineFetch | IAccumulateFetch;

const IN_OUT_REG = 7;

/**
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/324000324000?v=0.6.7
 */
export class Fetch implements HostCallHandler {
  index = tryAsHostCallIndex(1);
  basicGasCost = tryAsSmallGas(10);
```
