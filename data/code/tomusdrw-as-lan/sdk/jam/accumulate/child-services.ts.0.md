---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/child-services.ts#L1-L83
title: sdk/jam/accumulate/child-services.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 71c6c76d0c22e1d4dd9aff5dc274e6bc3cbd98b252cbe0d5bea35a5a579a49fd
language: typescript
---
`sdk/jam/accumulate/child-services.ts` (lines 1–83)

```typescript
/**
 * High-level wrappers for child service lifecycle ecallis (18, 21).
 *
 * The current service can create new child services and eject existing ones.
 */

import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { eject } from "../../ecalli/accumulate/eject";
import { new_service } from "../../ecalli/accumulate/new_service";
import { CodeHash, ServiceId } from "../types";

export enum NewChildError {
  /** Insufficient funds (CASH sentinel). */
  Cash = 0,
  /** Invalid operation (HUH sentinel). */
  Huh = 1,
  /** Storage full (FULL sentinel). */
  Full = 2,
}

export enum EjectChildError {
  /** Unknown service (WHO sentinel). */
  Who = 0,
  /** Invalid operation (HUH sentinel). */
  Huh = 1,
}

export class ChildServices {
  static create(): ChildServices {
    return new ChildServices();
  }

  private constructor() {}

  /**
   * Create a new child service (ecalli 18).
   *
   * @param codeHash - blake2b hash of the service code
   * @param codeLen - length of the service code
   * @param gas - minimum accumulate gas for the new service
   * @param allowance - initial token allowance
   * @param gratisStorage - free storage bytes (default 0)
   * @param requestedId - specific service ID to request (default: auto-assign)
   * @returns the new service ID on success, or NewChildError
   */
  newChild(
    codeHash: CodeHash,
    codeLen: u32,
    gas: u64,
    allowance: u64,
    gratisStorage: u32 = 0,
    requestedId: ServiceId = u32.MAX_VALUE,
  ): ResultN<ServiceId, NewChildError> {
    const result = new_service(codeHash.ptr(), codeLen, gas, allowance, gratisStorage, requestedId);
    if (result === EcalliResult.CASH) return ResultN.err<ServiceId, NewChildError>(NewChildError.Cash);
    if (result === EcalliResult.HUH) return ResultN.err<ServiceId, NewChildError>(NewChildError.Huh);
    if (result === EcalliResult.FULL) return ResultN.err<ServiceId, NewChildError>(NewChildError.Full);
    if (result >= 0) return ResultN.ok<ServiceId, NewChildError>(u32(result));
    panic("ChildServices.newChild: unexpected sentinel");
    return unreachable();
  }

  /**
   * Eject (remove) a child service (ecalli 21).
   *
   * The child service must have previously called `requestEjection` to
   * signal readiness by upgrading its code hash to the ejection hash.
   *
   * @param serviceId - service to eject
   * @param prevCodeHash - the service's current code hash (for host verification)
   * @returns ok(true) on success, or EjectChildError
   */
  ejectChild(serviceId: ServiceId, prevCodeHash: CodeHash): ResultN<bool, EjectChildError> {
    const result = eject(serviceId, prevCodeHash.ptr());
    if (result === EcalliResult.WHO) return ResultN.err<bool, EjectChildError>(EjectChildError.Who);
    if (result === EcalliResult.HUH) return ResultN.err<bool, EjectChildError>(EjectChildError.Huh);
    if (result >= 0) return ResultN.ok<bool, EjectChildError>(true);
    panic("ChildServices.ejectChild: unexpected sentinel");
    return unreachable();
  }
}
```
