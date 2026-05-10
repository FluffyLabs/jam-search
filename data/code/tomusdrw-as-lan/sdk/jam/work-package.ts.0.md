---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.ts#L1-L125'
title: sdk/jam/work-package.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 6
content_sha: 053623133824b5cfb60b057fef4f1c326220d12a884f99b782585ddcb38f4cbb
language: typescript
---
`sdk/jam/work-package.ts` (lines 1–125)

```typescript
/**
 * Typed structs for fetch results shared across invocation contexts.
 *
 * Includes protocol constants (kind 0) and work-package types (kinds 7-13).
 *
 * GP §14.3:
 *   P ≡ { j ∈ Y, h ∈ N_S, u ∈ H, p ∈ Y, x ∈ X, w ∈ ⟦I⟧ }
 *   I ≡ { s ∈ N_S, h ∈ H, y ∈ Y, g ∈ N_G, a ∈ N_G, e ∈ N,
 *         i ∈ C{H ∪ (H⊞), N}H, x ∈ ⟦(H, N)⟧ }
 */

import { Bytes32, BytesBlob } from "../core/bytes";
import { Bytes32Codec } from "../core/codec/bytes32";
import { DecodeError, Decoder, TryDecode } from "../core/codec/decode";
import { Encoder, TryEncode } from "../core/codec/encode";
import { Result } from "../core/result";
import { CodeHash, ServiceId } from "./types";

// ─── ProtocolConstants ────────────────────────────────────────────────

/**
 * Protocol constants (fetch kind 0).
 *
 * GP Appendix B.5, eq B.17:
 *   𝐜 = E(E₈(B_I), E₈(B_L), E₈(B_S), E₂(C), E₄(D), E₄(E),
 *        E₈(G_A), E₈(G_I), E₈(G_R), E₈(G_T),
 *        E₂(H), E₂(I), E₂(J), E₂(K), E₄(L),
 *        E₂(N), E₂(O), E₂(P), E₂(Q), E₂(R), E₂(T), E₂(U),
 *        E₂(V), E₄(W_A), E₄(W_B), E₄(W_C), E₄(W_E), E₄(W_M),
 *        E₄(W_P), E₄(W_R), E₄(W_T), E₄(W_X), E₄(Y))
 *
 * Total size: 7×8 + 13×4 + 13×2 = 56+52+26 = 134 bytes
 */
export class ProtocolConstants {
  static create(
    electiveItemBalance: u64,
    electiveByteBalance: u64,
    baseServiceBalance: u64,
    coreCount: u16,
    preimageExpungePeriod: u32,
    epochLength: u32,
    gasAccumulateReport: u64,
    gasIsAuthorized: u64,
    gasMaxRefine: u64,
    gasMaxBlock: u64,
    recentHistoryLength: u16,
    maxWorkItems: u16,
    maxReportDeps: u16,
    maxTicketsPerExtrinsic: u16,
    maxLookupAnchorAge: u32,
    ticketsPerValidator: u16,
    maxAuthorizersPerCore: u16,
    slotDuration: u16,
    authorizersQueueSize: u16,
    rotationPeriod: u16,
    maxExtrinsicsPerWorkItem: u16,
    reportTimeoutGracePeriod: u16,
    validatorsCount: u16,
    maxAllocatedWorkPackageSize: u32,
    maxEncodedWorkPackageSize: u32,
    maxAuthorizerCodeSize: u32,
    erasureCodedPieceSize: u32,
    maxImportSegments: u32,
    ecPiecesPerSegment: u32,
    maxWorkReportSize: u32,
    transferMemoSize: u32,
    maxExportSegments: u32,
    contestLength: u32,
  ): ProtocolConstants {
    return new ProtocolConstants(
      electiveItemBalance,
      electiveByteBalance,
      baseServiceBalance,
      coreCount,
      preimageExpungePeriod,
      epochLength,
      gasAccumulateReport,
      gasIsAuthorized,
      gasMaxRefine,
      gasMaxBlock,
      recentHistoryLength,
      maxWorkItems,
      maxReportDeps,
      maxTicketsPerExtrinsic,
      maxLookupAnchorAge,
      ticketsPerValidator,
      maxAuthorizersPerCore,
      slotDuration,
      authorizersQueueSize,
      rotationPeriod,
      maxExtrinsicsPerWorkItem,
      reportTimeoutGracePeriod,
      validatorsCount,
      maxAllocatedWorkPackageSize,
      maxEncodedWorkPackageSize,
      maxAuthorizerCodeSize,
      erasureCodedPieceSize,
      maxImportSegments,
      ecPiecesPerSegment,
      maxWorkReportSize,
      transferMemoSize,
      maxExportSegments,
      contestLength,
    );
  }

  private constructor(
    /** B_I: Elective item balance (deposit per storage item). */
    public electiveItemBalance: u64,
    /** B_L: Elective byte balance (deposit per storage byte). */
    public electiveByteBalance: u64,
    /** B_S: Base service balance (minimum balance for a service account). */
    public baseServiceBalance: u64,
    /** C: Number of cores. */
    public coreCount: u16,
    /** D: Preimage expunge period (timeslots). */
    public preimageExpungePeriod: u32,
    /** E: Epoch length (timeslots per epoch). */
    public epochLength: u32,
    /** G_A: Gas allocated to invoke a work-report for accumulation. */
    public gasAccumulateReport: u64,
    /** G_I: Gas allocated for is_authorized invocation. */
    public gasIsAuthorized: u64,
    /** G_R: Maximum gas for a single refine invocation. */
    public gasMaxRefine: u64,
```
