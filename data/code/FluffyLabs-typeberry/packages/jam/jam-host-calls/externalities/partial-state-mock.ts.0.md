---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state-mock.ts#L1-L85
title: packages/jam/jam-host-calls/externalities/partial-state-mock.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 7c40718272685d7c8b379135eb86f1ff112c677a2ddf5fdcdabe2439e3a78b16
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state-mock.ts` (lines 1–85)

```typescript
import {
  type CodeHash,
  type CoreIndex,
  type PerValidator,
  type ServiceGas,
  type ServiceId,
  tryAsServiceGas,
  tryAsServiceId,
} from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { Bytes, BytesBlob } from "@typeberry/bytes";
import type { Blake2bHash, OpaqueHash } from "@typeberry/hash";
import type { U64 } from "@typeberry/numbers";
import type { AuthorizationQueue, PerCore, ValidatorData } from "@typeberry/state";
import { Compatibility, GpVersion, OK, Result } from "@typeberry/utils";
import {
  type EjectError,
  type ForgetPreimageError,
  type NewServiceError,
  type PartialState,
  type PreimageStatus,
  ProvidePreimageError,
  type RequestPreimageError,
  type TRANSFER_MEMO_BYTES,
  TransferError,
  type UnprivilegedError,
  type UpdatePrivilegesError,
} from "./partial-state.js";

export class PartialStateMock implements PartialState {
  public readonly authQueue: Parameters<PartialStateMock["updateAuthorizationQueue"]>[] = [];
  public readonly forgetPreimageData: Parameters<PartialStateMock["forgetPreimage"]>[] = [];
  public readonly newServiceCalled: Parameters<PartialStateMock["newService"]>[] = [];
  public readonly privilegedServices: Parameters<PartialStateMock["updatePrivilegedServices"]>[] = [];
  public readonly ejectData: Parameters<PartialStateMock["eject"]>[] = [];
  public readonly requestPreimageData: Parameters<PartialStateMock["requestPreimage"]>[] = [];
  public readonly checkPreimageStatusData: Parameters<PartialStateMock["checkPreimageStatus"]>[] = [];
  public readonly transferData: Parameters<PartialStateMock["transfer"]>[] = [];
  public readonly upgradeData: Parameters<PartialStateMock["upgradeService"]>[] = [];
  public readonly validatorsData: Parameters<PartialStateMock["updateValidatorsData"]>[0][] = [];
  public readonly providePreimageData: Parameters<PartialStateMock["providePreimage"]>[] = [];

  public checkpointCalled = 0;
  public yieldHash: OpaqueHash | null = null;
  public authQueueResponse: Result<OK, UpdatePrivilegesError> = Result.ok(OK);
  public forgetPreimageResponse: Result<OK, ForgetPreimageError> = Result.ok(OK);
  public newServiceResponse: Result<ServiceId, NewServiceError> = Result.ok(tryAsServiceId(0));
  public privilegedServicesResponse: Result<OK, UpdatePrivilegesError> = Result.ok(OK);
  public ejectReturnValue: Result<OK, EjectError> = Result.ok(OK);
  public requestPreimageResponse: Result<OK, RequestPreimageError> = Result.ok(OK);
  public checkPreimageStatusResponse: PreimageStatus | null = null;
  public transferReturnValue: Result<OK, TransferError> = Result.ok(OK);
  public validatorDataResponse: Result<OK, UnprivilegedError> = Result.ok(OK);
  public providePreimageResponse: Result<OK, ProvidePreimageError> = Result.ok(OK);

  eject(from: ServiceId | null, previousCode: PreimageHash): Result<OK, EjectError> {
    this.ejectData.push([from, previousCode]);
    return this.ejectReturnValue;
  }

  checkPreimageStatus(hash: Blake2bHash, length: U64): PreimageStatus | null {
    this.checkPreimageStatusData.push([hash, length]);
    return this.checkPreimageStatusResponse;
  }

  requestPreimage(hash: Blake2bHash, length: U64): Result<OK, RequestPreimageError> {
    this.requestPreimageData.push([hash, length]);
    return this.requestPreimageResponse;
  }

  forgetPreimage(hash: Blake2bHash, length: U64): Result<OK, ForgetPreimageError> {
    this.forgetPreimageData.push([hash, length]);
    return this.forgetPreimageResponse;
  }

  transfer(
    destination: ServiceId | null,
    amount: U64,
    suppliedGas: ServiceGas,
    memo: Bytes<TRANSFER_MEMO_BYTES>,
  ): Result<OK, TransferError> {
    if (destination === null) {
      return Result.error(TransferError.DestinationNotFound, () => "Mock: destination is null for transfer");
    }
    if (!Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) || this.transferReturnValue.isOk) {
```
