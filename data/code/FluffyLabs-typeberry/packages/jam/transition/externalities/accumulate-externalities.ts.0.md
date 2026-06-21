---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L1-L117
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 9
content_sha: 8764e637db0352867f51bc28dd8a5fa7de78493ed1859f26d5da439a675ff4be
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 1–117)

```typescript
import {
  type CodeHash,
  type CoreIndex,
  type PerValidator,
  type ServiceGas,
  type ServiceId,
  type TimeSlot,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import { MIN_PUBLIC_SERVICE_INDEX } from "@typeberry/block/gp-constants.js";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { asKnownSize, type FixedSizeArray } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { type Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import {
  AccumulationStateUpdate,
  clampU64ToU32,
  EjectError,
  ForgetPreimageError,
  type general,
  NewServiceError,
  type PartiallyUpdatedState,
  type PartialState,
  PendingTransfer,
  type PreimageStatus,
  PreimageStatusKind,
  ProvidePreimageError,
  RequestPreimageError,
  slotsToPreimageStatus,
  type TRANSFER_MEMO_BYTES,
  TransferError,
  UnprivilegedError,
  UpdatePrivilegesError,
  writeServiceIdAsLeBytes,
} from "@typeberry/jam-host-calls";
import { Logger } from "@typeberry/logger";
import { maxU64, sumU64, tryAsU32, tryAsU64, type U64 } from "@typeberry/numbers";
import {
  type AUTHORIZATION_QUEUE_SIZE,
  LookupHistoryItem,
  type PerCore,
  PreimageItem,
  PrivilegedServices,
  ServiceAccountInfo,
  type StorageKey,
  tryAsLookupHistorySlots,
  UpdatePreimage,
  type ValidatorData,
} from "@typeberry/state";
import { assertNever, check, OK, Result } from "@typeberry/utils";

/**
 * Number of storage items required for ejection of the service.
 *
 * Value 2 seems to indicate that there is only one preimage lookup,
 * and it has to be the previous code of the service, additionally used
 * to authorize the `eject`.
 *
 * https://graypaper.fluffylabs.dev/#/9a08063/370202370502?v=0.6.6 */
const REQUIRED_NUMBER_OF_STORAGE_ITEMS_FOR_EJECT = 2;

/** https://graypaper.fluffylabs.dev/#/7e6ff6a/117101117101?v=0.6.7 */
const LOOKUP_HISTORY_ENTRY_BYTES = tryAsU64(81);
/** https://graypaper.fluffylabs.dev/#/7e6ff6a/117a01117a01?v=0.6.7 */
const BASE_STORAGE_BYTES = tryAsU64(34);

const logger = Logger.new(import.meta.filename, "externalities");

/** Construction arguments for {@link AccumulateExternalities}. */
export type AccumulateExternalitiesArgs = {
  chainSpec: ChainSpec;
  blake2b: Blake2b;
  updatedState: PartiallyUpdatedState;
  /** `x_s` */
  currentServiceId: ServiceId;
  nextNewServiceIdCandidate: ServiceId;
  currentTimeslot: TimeSlot;
};

export class AccumulateExternalities
  implements PartialState, general.AccountsWrite, general.AccountsRead, general.AccountsInfo, general.AccountsLookup
{
  private checkpointedState: AccumulationStateUpdate;
  /** `x_i`: next service id we are going to create. */
  private nextNewServiceId: ServiceId;

  /**
   * Construct externalities for accumulating a specific service.
   *
   * Validates that the current service exists in `updatedState`.
   */
  static forService(args: AccumulateExternalitiesArgs) {
    const service = args.updatedState.getServiceInfo(args.currentServiceId);
    if (service === null) {
      throw new Error(`Invalid state initialization. Service info missing for ${args.currentServiceId}.`);
    }
    return new AccumulateExternalities(args);
  }

  private constructor(args: AccumulateExternalitiesArgs) {
    this.chainSpec = args.chainSpec;
    this.blake2b = args.blake2b;
    this.updatedState = args.updatedState;
    this.currentServiceId = args.currentServiceId;
    this.currentTimeslot = args.currentTimeslot;
    this.checkpointedState = AccumulationStateUpdate.copyFrom(args.updatedState.stateUpdate);
    this.nextNewServiceId = this.getNextAvailableServiceId(args.nextNewServiceIdCandidate);
  }

  private readonly chainSpec: ChainSpec;
  private readonly blake2b: Blake2b;
  private readonly updatedState: PartiallyUpdatedState;
  /** `x_s` */
```
