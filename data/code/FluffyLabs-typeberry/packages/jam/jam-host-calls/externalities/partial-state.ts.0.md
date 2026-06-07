---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state.ts#L1-L134
title: packages/jam/jam-host-calls/externalities/partial-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: b1a242f251490c39624b5dee63302727053c65e57950b1ca0c4273ad6d85b0bb
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state.ts` (lines 1–134)

```typescript
import type { CodeHash, CoreIndex, PerValidator, ServiceGas, ServiceId, TimeSlot } from "@typeberry/block";
import { W_T } from "@typeberry/block/gp-constants.js";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { Bytes, BytesBlob } from "@typeberry/bytes";
import type { OpaqueHash } from "@typeberry/hash";
import type { U64 } from "@typeberry/numbers";
import type { AuthorizationQueue, LookupHistorySlots, PerCore, ValidatorData } from "@typeberry/state";
import type { OK, Result } from "@typeberry/utils";

/** Size of the transfer memo. */
export const TRANSFER_MEMO_BYTES = W_T;
export type TRANSFER_MEMO_BYTES = typeof TRANSFER_MEMO_BYTES;

/**
 * Possible states when checking preimage status.
 *
 * NOTE: the status number also describes how many items there is going to be
 * in the `slots/data` array.
 */
export enum PreimageStatusKind {
  /** The preimage is requested. */
  Requested = 0,
  /** The preimage is available */
  Available = 1,
  /** The preimage is unavailable. */
  Unavailable = 2,
  /** The preimage is reavailable. */
  Reavailable = 3,
}

/**
 *
 * Possible results when checking preimage status.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/117000117700
 */
export type PreimageStatus =
  | {
      status: typeof PreimageStatusKind.Requested;
    }
  | {
      status: typeof PreimageStatusKind.Available;
      data: [TimeSlot];
    }
  | {
      status: typeof PreimageStatusKind.Unavailable;
      data: [TimeSlot, TimeSlot];
    }
  | {
      status: typeof PreimageStatusKind.Reavailable;
      data: [TimeSlot, TimeSlot, TimeSlot];
    };

/** Convert model representation of lookup history into `PreimageStatus`. */
export function slotsToPreimageStatus(slots: LookupHistorySlots): PreimageStatus {
  if (slots.length === PreimageStatusKind.Requested) {
    return {
      status: PreimageStatusKind.Requested,
    };
  }

  if (slots.length === PreimageStatusKind.Available) {
    return {
      status: PreimageStatusKind.Available,
      data: [slots[0]],
    };
  }

  if (slots.length === PreimageStatusKind.Unavailable) {
    return {
      status: PreimageStatusKind.Unavailable,
      data: [slots[0], slots[1]],
    };
  }

  if (slots.length === PreimageStatusKind.Reavailable) {
    return {
      status: PreimageStatusKind.Reavailable,
      data: [slots[0], slots[1], slots[2]],
    };
  }

  throw new Error(`Invalid slots length: ${slots.length}`);
}

/** Possible error when requesting a preimage. */
export enum RequestPreimageError {
  /** The preimage is already requested. */
  AlreadyRequested = 0,
  /** The preimage is already available. */
  AlreadyAvailable = 1,
  /** The account does not have enough balance to store more preimages. */
  InsufficientFunds = 2,
}

/** Possible error when forgetting a preimage. */
export enum ForgetPreimageError {
  /** Preimage was already forgotten or does not exist. */
  NotFound = 0,
  /** The preimage hasn't expired yet. */
  NotExpired = 1,
  /** Error when updating storage utilisation info. */
  StorageUtilisationError = 2,
}

/**
 * Errors that may occur when the transfer is invoked.
 */
export enum TransferError {
  /** The destination service does not exist. */
  DestinationNotFound = 0,
  /** The supplied gas is too low to execute `OnTransfer` entry point. */
  GasTooLow = 1,
  /** After transfering the funds account balance would be below the threshold. */
  BalanceBelowThreshold = 2,
}

/**
 * Errors that may occur when `quit` is invoked.
 *
 * Note there is partial overlap with `TransferError`, except
 * for `BalanceBelowThreshold`, since it doesn't matter,
 * because the account is removed anyway.
 */
export enum EjectError {
  /** The service does not exist or does not expect to be ejected by us. */
  InvalidService = 0,
  /** The service must have only one previous code preimage available. */
  InvalidPreimage = 1,
}

export enum ProvidePreimageError {
  /** The service does not exist. */
  ServiceNotFound = 0,
```
