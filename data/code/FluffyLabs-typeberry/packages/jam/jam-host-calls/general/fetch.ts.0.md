---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.ts#L1-L130
title: packages/jam/jam-host-calls/general/fetch.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: deb5c2a001ca550f24599cbbc0c057aa49b9563ecc88c6dfa69534f58954ffbe
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.ts` (lines 1–130)

```typescript
import type { EntropyHash, ServiceId } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { minU64, tryAsU64, type U32, type U64 } from "@typeberry/numbers";
import type { HostCallHandler, HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { PvmExecution, traceRegisters, tryAsHostCallIndex } from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { logger } from "../logger.js";
import { clampU64ToU32 } from "../utils.js";
import { HostCallResult } from "./results.js";

/**
 * Fetchable data contexts.
 *
 * The fetch host call (ecalli 1) returns context-dependent data based on
 * ω₁₀ (the kind selector). Each invocation context passes different
 * parameters to Ω_Y, which determines which kinds return data vs NONE.
 *
 * Ω_Y signature: Ω_Y(ρ, φ, μ, p, n, r, i, ī, x̄, 𝐢, ...)
 *
 * Context parameter mapping
 *   IsAuthorized: Ω_Y(ρ, φ, μ, 𝐩, ∅, ∅, ∅, ∅, ∅, ∅, ∅)
 *   https://graypaper.fluffylabs.dev/#/ab2cdbd/2e43012e4301?v=0.7.2
 *   Refine:        Ω_Y(ρ, φ, μ, p, H₀, r, i, ī, x̄, ∅, (m,e))
 *   https://graypaper.fluffylabs.dev/#/ab2cdbd/2fe0012fe001?v=0.7.2
 *   Accumulate:    Ω_Y(ρ, φ, μ, ∅, η'₀, ∅, ∅, ∅, ∅, 𝐢, (x,y))
 *   https://graypaper.fluffylabs.dev/#/ab2cdbd/30c00030c000?v=0.7.2
 *
 * Kind availability per context:
 *   Kind 0  (constants)      - all contexts
 *   Kind 1  (n)              - Refine (H₀), Accumulate (η'₀)
 *   Kind 2  (r)              - Refine only
 *   Kind 3-4 (x̄ extrinsics)  - Refine only
 *   Kind 5-6 (ī imports)     - Refine only
 *   Kind 7-13 (p work pkg)   - IsAuthorized, Refine
 *   Kind 14-15 (𝐢 acc items) - Accumulate only
 */
export enum FetchContext {
  IsAuthorized = "isAuthorized",
  Refine = "refine",
  Accumulate = "accumulate",
}

/**
 * Fetch externalities for the IsAuthorized context.
 *
 * Ω_Y(ρ, φ, μ, 𝐩, ∅, ∅, ∅, ∅, ∅, ∅, ∅)
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/2e43012e4301?v=0.7.2
 *
 * Available kinds: 0 (constants), 7-13 (work package)
 */
export interface IIsAuthorizedFetch {
  readonly context: FetchContext.IsAuthorized;

  /**
   * Kind 0: Encoded constants info (𝐜).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315001315001?v=0.7.2
   */
  constants(): BytesBlob;

  /**
   * Kind 7: Encoded work package - E(𝐩).
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
 * Fetch externalities for the Refine context.
 *
 * Ω_Y(ρ, φ, μ, p, H₀, r, i, ī, x̄, ∅, (m,e))
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/2fe0012fe001?v=0.7.2
 *
 * Available kinds: 0-13 (all except accumulation items)
 */
export interface IRefineFetch {
  readonly context: FetchContext.Refine;

  /**
   * Kind 0: Encoded constants info (𝐜).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/315001315001?v=0.7.2
   */
  constants(): BytesBlob;

  /**
   * Kind 1: Entropy pool - H₀ (zero hash).
```
