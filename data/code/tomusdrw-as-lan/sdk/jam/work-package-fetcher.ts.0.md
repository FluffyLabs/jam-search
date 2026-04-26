---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package-fetcher.ts#L1-L119
title: sdk/jam/work-package-fetcher.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 236e072e7dd48381492173a616d477406be3e9340bd936ad8d1b75e13cc8537d
language: typescript
---
`sdk/jam/work-package-fetcher.ts` (lines 1–119)

```typescript
/**
 * Typed fetcher for work-package data (kinds 0, 7-13).
 *
 * Shared by both the authorize and refine contexts via composition.
 * Codecs are created lazily — only when first accessed.
 */

import { BytesBlob } from "../core/bytes";
import { Bytes32Codec } from "../core/codec/bytes32";
import { Decoder } from "../core/codec/decode";
import { panic } from "../core/panic";
import { Optional } from "../core/result";
import { FetchKind } from "../ecalli/general/fetch";
import {
  FetchBuffer,
  fetchAndDecode,
  fetchAndDecodeOptional,
  fetchBlob,
  fetchBlobOrPanic,
  fetchRawOrPanic,
} from "./fetcher";
import { EntropyHash } from "./types";
import {
  ExtrinsicRefCodec,
  ImportRefCodec,
  ProtocolConstants,
  ProtocolConstantsCodec,
  RefinementContext,
  RefinementContextCodec,
  WorkItemCodec,
  WorkItemInfo,
  WorkItemInfoCodec,
  WorkPackage,
  WorkPackageCodec,
} from "./work-package";

export class WorkPackageFetcher {
  static create(bufSize: u32 = 1024): WorkPackageFetcher {
    return new WorkPackageFetcher(bufSize);
  }

  private readonly fb: FetchBuffer;

  // Lazy codec fields
  private _protocolConstants: ProtocolConstantsCodec | null = null;
  private _bytes32: Bytes32Codec | null = null;
  private _workItemInfo: WorkItemInfoCodec | null = null;
  private _refinementContext: RefinementContextCodec | null = null;
  private _workPackage: WorkPackageCodec | null = null;

  private constructor(bufSize: u32) {
    this.fb = FetchBuffer.create(bufSize);
  }

  private get protocolConstants(): ProtocolConstantsCodec {
    if (this._protocolConstants === null) this._protocolConstants = ProtocolConstantsCodec.create();
    return this._protocolConstants!;
  }

  private get bytes32(): Bytes32Codec {
    if (this._bytes32 === null) this._bytes32 = Bytes32Codec.create();
    return this._bytes32!;
  }

  private get workItemInfo(): WorkItemInfoCodec {
    if (this._workItemInfo === null) this._workItemInfo = WorkItemInfoCodec.create();
    return this._workItemInfo!;
  }

  private get refinementContext(): RefinementContextCodec {
    if (this._refinementContext === null) this._refinementContext = RefinementContextCodec.create(this.bytes32);
    return this._refinementContext!;
  }

  private get workPackage(): WorkPackageCodec {
    if (this._workPackage === null) {
      const importRef = ImportRefCodec.create();
      const extrinsicRef = ExtrinsicRefCodec.create();
      const workItem = WorkItemCodec.create(importRef, extrinsicRef);
      this._workPackage = WorkPackageCodec.create(this.refinementContext, workItem);
    }
    return this._workPackage!;
  }

  /** Protocol constants (kind 0, always available in all contexts). */
  constants(): ProtocolConstants {
    return fetchAndDecode<ProtocolConstants>(this.fb, this.protocolConstants, FetchKind.Constants);
  }

  /** Entropy pool (kind 1). */
  entropy(): EntropyHash {
    return fetchAndDecode<EntropyHash>(this.fb, this.bytes32, FetchKind.Entropy);
  }

  /** Full work package (kind 7). GP type P ≡ { j, h, u, p, x, w }. */
  fetchWorkPackage(): WorkPackage {
    return fetchAndDecode<WorkPackage>(this.fb, this.workPackage, FetchKind.WorkPackage);
  }

  /** Authorizer configuration blob (kind 8). */
  authConfig(): BytesBlob {
    return fetchBlobOrPanic(this.fb, FetchKind.AuthConfig);
  }

  /** Authorization token blob (kind 9). */
  authToken(): BytesBlob {
    return fetchBlobOrPanic(this.fb, FetchKind.AuthToken);
  }

  /** Refinement context (kind 10). */
  fetchRefineContext(): RefinementContext {
    return fetchAndDecode<RefinementContext>(this.fb, this.refinementContext, FetchKind.RefineContext);
  }

  /** All work-item summaries as a decoded array (kind 11). */
  allWorkItems(): StaticArray<WorkItemInfo> {
    const raw = fetchRawOrPanic(this.fb, FetchKind.AllWorkItems);
    const d = Decoder.fromBlob(raw);
    const r = d.sequenceVarLen<WorkItemInfo>(this.workItemInfo);
```
