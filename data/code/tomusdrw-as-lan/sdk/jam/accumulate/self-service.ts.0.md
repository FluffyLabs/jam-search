---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/self-service.ts#L1-L57
title: sdk/jam/accumulate/self-service.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 24c3f8a70bbb8a5c77ceee6782087d58ca10d632323aabf24c30c655454adb2f
language: typescript
---
`sdk/jam/accumulate/self-service.ts` (lines 1–57)

```typescript
/**
 * High-level wrappers for service self-management (ecalli 19: upgrade).
 *
 * Provides two distinct operations:
 * - {@link upgradeCode} — upgrade to new service code.
 * - {@link requestEjection} — signal readiness for ejection by a parent service.
 */

import { Bytes32 } from "../../core/bytes";
import { upgrade } from "../../ecalli/accumulate/upgrade";
import { ServiceId } from "../types";

export class SelfService {
  static create(): SelfService {
    return new SelfService();
  }

  private constructor() {}

  /**
   * Upgrade the current service's code (ecalli 19).
   *
   * Always succeeds (the host always returns OK).
   *
   * **Important:** The caller must ensure the preimage for `codeHash` is
   * available in state (e.g. via `AccumulatePreimages.provide` or `solicit`)
   * before the next accumulation. If the preimage is missing, the service
   * will be non-functional.
   *
   * @param codeHash - blake2b hash of the new service code
   * @param gas - new minimum accumulate gas
   * @param allowance - new token allowance
   */
  upgradeCode(codeHash: Bytes32, gas: u64, allowance: u64): void {
    upgrade(codeHash.ptr(), gas, allowance);
  }

  /**
   * Request ejection from a parent service (ecalli 19).
   *
   * Calls upgrade with a special "ejection hash" derived from the parent
   * service ID: the parent ID as 4 LE bytes, zero-padded to 32 bytes.
   * Gas and allowance are both set to 0.
   *
   * **Important:** Before calling this, the service should clear all its
   * storage to avoid losing tokens locked in storage deposits. There is
   * no programmatic way to verify storage is empty — this is the caller's
   * responsibility.
   *
   * @param parentServiceId - the parent service that should eject this service
   */
  requestEjection(parentServiceId: ServiceId): void {
    const hash = Bytes32.zero();
    store<u32>(hash.raw.dataStart, parentServiceId);
    upgrade(hash.ptr(), 0, 0);
  }
}
```
