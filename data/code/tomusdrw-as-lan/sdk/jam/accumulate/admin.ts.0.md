---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.ts#L1-L122
title: sdk/jam/accumulate/admin.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 2
content_sha: c64e348b4f39b0355b2518e8ca01d216808516a0417a262ef0be8674ab032b20
language: typescript
---
`sdk/jam/accumulate/admin.ts` (lines 1–122)

```typescript
/**
 * High-level wrappers for privileged governance ecallis (14-16).
 *
 * Each privilege role can only update its own field via bless:
 * - The **manager** can change all fields (bless).
 * - The **delegator** can transfer the delegator role (blessDelegator).
 * - The **registrar** can transfer the registrar role (blessRegistrar).
 */

import { Bytes32, BytesBlob } from "../../core/bytes";
import { Encoder } from "../../core/codec/encode";
import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { assign as assign_ } from "../../ecalli/accumulate/assign";
import { bless as bless_ } from "../../ecalli/accumulate/bless";
import { designate as designate_ } from "../../ecalli/accumulate/designate";
import {
  AUTO_ACCUMULATE_ENTRY_SIZE,
  AutoAccumulateEntry,
  CoreIndex,
  CURRENT_SERVICE,
  ServiceId,
  VALIDATOR_KEY_SIZE,
  ValidatorKey,
} from "../types";

export enum BlessError {
  /** Unknown service (WHO sentinel). */
  Who = 0,
  /** Invalid operation (HUH sentinel). */
  Huh = 1,
}

export enum AssignError {
  /** Unknown core (CORE sentinel). */
  Core = 0,
  /** Unknown service (WHO sentinel). */
  Who = 1,
  /** Invalid operation (HUH sentinel). */
  Huh = 2,
}

export enum DesignateError {
  /** Invalid operation (HUH sentinel). */
  Huh = 0,
}

export class Admin {
  static create(): Admin {
    return new Admin();
  }

  private constructor() {}

  /**
   * Full bless — only callable by the manager service.
   *
   * Sets all privileged configuration: manager, per-core assigners,
   * delegator, registrar, and auto-accumulate services.
   *
   * @param manager - new manager service ID
   * @param assigners - assigner service ID for each core (one per core, flat array)
   * @param delegator - new delegator service ID
   * @param registrar - new registrar service ID
   * @param autoAccumulate - auto-accumulate entries (service ID + gas pairs)
   */
  bless(
    manager: ServiceId,
    assigners: ServiceId[],
    delegator: ServiceId,
    registrar: ServiceId,
    autoAccumulate: AutoAccumulateEntry[],
  ): ResultN<bool, BlessError> {
    const assignersBlob = encodeServiceIds(assigners);
    const autoAccumBlob = encodeAutoAccumulate(autoAccumulate);
    const result = bless_(
      manager,
      assignersBlob.ptr(),
      delegator,
      registrar,
      autoAccumBlob.ptr(),
      autoAccumulate.length,
    );
    return mapBlessResult(result);
  }

  /**
   * Partial bless — callable by the current delegator to transfer the role.
   *
   * Only the delegator field is meaningful; the host ignores the rest.
   */
  blessDelegator(newDelegator: ServiceId): ResultN<bool, BlessError> {
    const empty = BytesBlob.empty();
    const result = bless_(0, empty.ptr(), newDelegator, 0, empty.ptr(), 0);
    return mapBlessResult(result);
  }

  /**
   * Partial bless — callable by the current registrar to transfer the role.
   *
   * Only the registrar field is meaningful; the host ignores the rest.
   */
  blessRegistrar(newRegistrar: ServiceId): ResultN<bool, BlessError> {
    const empty = BytesBlob.empty();
    const result = bless_(0, empty.ptr(), 0, newRegistrar, empty.ptr(), 0);
    return mapBlessResult(result);
  }

  /**
   * Assign an auth queue for a specific core (ecalli 15).
   *
   * Only callable by that core's assigner service (set via bless).
   *
   * @param core - core index
   * @param authQueue - auth queue entries (code hashes for that core)
   * @param newAssigner - transfer assigner permission (default: keep current service)
   */
  assign(core: CoreIndex, authQueue: Bytes32[], newAssigner: ServiceId = CURRENT_SERVICE): ResultN<bool, AssignError> {
    const authQueueBlob = encodeBytes32Array(authQueue);
    const result = assign_(core, authQueueBlob.ptr(), newAssigner);
    if (result === EcalliResult.CORE) return ResultN.err<bool, AssignError>(AssignError.Core);
```
