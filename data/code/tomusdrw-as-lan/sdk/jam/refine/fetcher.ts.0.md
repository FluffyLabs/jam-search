---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/fetcher.ts#L1-L101'
title: sdk/jam/refine/fetcher.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d83302e463b075278ef0eb7fa6978bc067afeb476f1a0cda9ca21f8aab9c30ac
language: typescript
---
`sdk/jam/refine/fetcher.ts` (lines 1–101)

```typescript
/**
 * Typed fetcher for the refine context.
 *
 * Available fetch kinds: 0 (constants), 1 (entropy), 2 (authorizer trace),
 * 3-6 (extrinsics and imports), 7-13 (work package data).
 *
 * Composes WorkPackageFetcher for kinds 0/7-13 and adds refine-only methods.
 */

import { BytesBlob } from "../../core/bytes";
import { Optional } from "../../core/result";
import { FetchKind } from "../../ecalli/general/fetch";
import { EntropyHash } from "../types";
import { ProtocolConstants, RefinementContext, WorkItemInfo, WorkPackage } from "../work-package";
import { WorkPackageFetcher } from "../work-package-fetcher";

export class RefineFetcher {
  static create(bufSize: u32 = 1024): RefineFetcher {
    return new RefineFetcher(bufSize);
  }

  private readonly wp: WorkPackageFetcher;

  private constructor(bufSize: u32) {
    this.wp = WorkPackageFetcher.create(bufSize);
  }

  // ─── Delegated work-package methods ──────────────────────────────────

  /** Protocol constants (kind 0). */
  constants(): ProtocolConstants {
    return this.wp.constants();
  }

  /** Entropy pool (kind 1). In refine context this is H₀ (anchor header hash, 32 bytes). */
  entropy(): EntropyHash {
    return this.wp.entropy();
  }

  /** Full work package (kind 7). */
  workPackage(): WorkPackage {
    return this.wp.fetchWorkPackage();
  }

  /** Authorizer configuration blob (kind 8). */
  authConfig(): BytesBlob {
    return this.wp.authConfig();
  }

  /** Authorization token blob (kind 9). */
  authToken(): BytesBlob {
    return this.wp.authToken();
  }

  /** Refinement context (kind 10). */
  refineContext(): RefinementContext {
    return this.wp.fetchRefineContext();
  }

  /** All work-item summaries (kind 11). */
  allWorkItems(): StaticArray<WorkItemInfo> {
    return this.wp.allWorkItems();
  }

  /** Single work-item summary (kind 12). Returns Optional.none if index is out of bounds. */
  oneWorkItem(workItem: u32): Optional<WorkItemInfo> {
    return this.wp.oneWorkItem(workItem);
  }

  /** Work-item payload blob (kind 13). Returns Optional.none if index is out of bounds. */
  workItemPayload(workItem: u32): Optional<BytesBlob> {
    return this.wp.workItemPayload(workItem);
  }

  // ─── Refine-only methods ─────────────────────────────────────────────

  /** Authorizer trace data (kind 2). */
  authorizerTrace(): BytesBlob {
    return this.wp.blobOrPanic(FetchKind.AuthorizerTrace);
  }

  /** Extrinsic data for the current work item (kind 4). Returns Optional.none if index is out of bounds. */
  myExtrinsic(index: u32): Optional<BytesBlob> {
    return this.wp.blob(FetchKind.MyExtrinsics, index);
  }

  /** Extrinsic data for another work item (kind 3). Returns Optional.none if index is out of bounds. */
  otherExtrinsic(workItem: u32, index: u32): Optional<BytesBlob> {
    return this.wp.blob(FetchKind.OtherWorkItemExtrinsics, workItem, index);
  }

  /** Import segment for the current work item (kind 6). Returns Optional.none if index is out of bounds. */
  myImport(index: u32): Optional<BytesBlob> {
    return this.wp.blob(FetchKind.MyImports, index);
  }

  /** Import segment for another work item (kind 5). Returns Optional.none if index is out of bounds. */
  otherImport(workItem: u32, index: u32): Optional<BytesBlob> {
    return this.wp.blob(FetchKind.OtherWorkItemImports, workItem, index);
  }
}
```
