---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state.ts#L127-L253
title: packages/jam/jam-host-calls/externalities/partial-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: a9c25d5f8880fe34bd80d90ef2bf4512e742d2374214294bfb051903ba5c6d12
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state.ts` (lines 127–253)

```typescript
  InvalidService = 0,
  /** The service must have only one previous code preimage available. */
  InvalidPreimage = 1,
}

export enum ProvidePreimageError {
  /** The service does not exist. */
  ServiceNotFound = 0,
  /** The preimage wasn't requested. */
  WasNotRequested = 1,
  /** The preimage is already provided. */
  AlreadyProvided = 2,
}

export enum NewServiceError {
  /** Not enough balance to create the service account. */
  InsufficientFunds = 0,
  /** Service is not privileged to set gratis storage. */
  UnprivilegedService = 1,
  /** Registrar attempting to create a service with already existing id. */
  RegistrarServiceIdAlreadyTaken = 2,
}

export enum UpdatePrivilegesError {
  /** Service is not privileged to update privileges. */
  UnprivilegedService = 0,
  /** Provided service id is incorrect. */
  InvalidServiceId = 1,
}

/** Service is not privileged to perform an action. */
export const UnprivilegedError = Symbol("Insufficient privileges.");
export type UnprivilegedError = typeof UnprivilegedError;

/**
 * `U`: state components mutated by the accumulation.
 * - `d`: service accounts state
 * - `i`: upcoming validator keys
 * - `q`: queue of work reports
 * - `x`: priviliges state
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/163602163602
 */
export interface PartialState {
  /**
   * Request (query) preimage status.
   *
   * States:
   * https://graypaper.fluffylabs.dev/#/579bd12/116f00116f00
   */
  checkPreimageStatus(hash: PreimageHash, length: U64): PreimageStatus | null;

  /**
   * Request (solicit) a preimage to be (re-)available.
   *
   * States:
   * https://graypaper.fluffylabs.dev/#/579bd12/116f00116f00
   */
  requestPreimage(hash: PreimageHash, length: U64): Result<OK, RequestPreimageError>;

  /**
   * Mark a preimage hash as unavailable (forget it).
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/335602335602
   */
  forgetPreimage(hash: PreimageHash, length: U64): Result<OK, ForgetPreimageError>;

  /**
   * Remove the provided source account and transfer the remaining account balance to current service.
   *
   * https://graypaper.fluffylabs.dev/#/9a08063/37b60137b601?v=0.6.6
   */
  eject(from: ServiceId | null, previousCode: PreimageHash): Result<OK, EjectError>;

  /**
   * Transfer given `amount` of funds to the `destination`,
   * passing `gas` fee for transfer and given `memo`.
   */
  transfer(
    destination: ServiceId | null,
    amount: U64,
    gas: ServiceGas,
    memo: Bytes<TRANSFER_MEMO_BYTES>,
  ): Result<OK, TransferError>;

  /**
   * Create a new service with given codeHash, length, gas, allowance, gratisStorage and wantedServiceId.
   *
   * Returns a newly assigned id
   * or `wantedServiceId` if it's lower than `S`
   * and parent of that service is `Registrar`.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/2fa9042fc304?v=0.7.2
   *
   * An error can be returned in case the account does not
   * have the required balance
   * or tries to set gratis storage without being `Manager`
   * or `Registrar` tries to set service id thats already taken.
   */
  newService(
    codeHash: CodeHash,
    codeLength: U64,
    gas: ServiceGas,
    allowance: ServiceGas,
    gratisStorage: U64,
    wantedServiceId: U64,
  ): Result<ServiceId, NewServiceError>;

  /** Upgrade code of currently running service. */
  upgradeService(codeHash: CodeHash, gas: U64, allowance: U64): void;

  /** Designate new validators given their key and meta data. */
  updateValidatorsData(validatorsData: PerValidator<ValidatorData>): Result<OK, UnprivilegedError>;

  /**
   * Checkpoint this partial state.
   *
   * I.e. assign the "regular dimension" of the context to
   * the "exceptional dimension".
   * https://graypaper.fluffylabs.dev/#/579bd12/2df4012df401
   */
  checkpoint(): void;

  /** Update authorization queue for given core and authorize a service for this core. */
  updateAuthorizationQueue(
    coreIndex: CoreIndex,
    authQueue: AuthorizationQueue,
```
