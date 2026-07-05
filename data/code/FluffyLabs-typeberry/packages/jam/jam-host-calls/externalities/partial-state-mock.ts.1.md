---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state-mock.ts#L83-L155
title: packages/jam/jam-host-calls/externalities/partial-state-mock.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0592e268b083278c34357132284b351a4dab7c30c71753558c8a20f03c1ce57d
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state-mock.ts` (lines 83–155)

```typescript
      return Result.error(TransferError.DestinationNotFound, () => "Mock: destination is null for transfer");
    }
    if (!Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) || this.transferReturnValue.isOk) {
      this.transferData.push([destination, amount, suppliedGas, memo]);
    } else {
      this.transferData.push([destination, amount, tryAsServiceGas(0), memo]);
    }
    return this.transferReturnValue;
  }

  newService(
    codeHash: CodeHash,
    codeLength: U64,
    gas: ServiceGas,
    balance: ServiceGas,
    gratisStorage: U64,
    serviceId: U64,
  ): Result<ServiceId, NewServiceError> {
    this.newServiceCalled.push([codeHash, codeLength, gas, balance, gratisStorage, serviceId]);
    return this.newServiceResponse;
  }

  upgradeService(codeHash: CodeHash, gas: U64, allowance: U64): void {
    this.upgradeData.push([codeHash, gas, allowance]);
  }

  checkpoint(): void {
    this.checkpointCalled += 1;
  }

  updateValidatorsData(validatorsData: PerValidator<ValidatorData>): Result<OK, UnprivilegedError> {
    if (this.validatorDataResponse.isOk) {
      this.validatorsData.push(validatorsData);
    }
    return this.validatorDataResponse;
  }

  updatePrivilegedServices(
    m: ServiceId | null,
    a: PerCore<ServiceId>,
    v: ServiceId | null,
    r: ServiceId | null,
    g: Map<ServiceId, ServiceGas>,
  ): Result<OK, UpdatePrivilegesError> {
    if (this.privilegedServicesResponse.isOk) {
      this.privilegedServices.push([m, a, v, r, g]);
    }
    return this.privilegedServicesResponse;
  }

  updateAuthorizationQueue(
    coreIndex: CoreIndex,
    authQueue: AuthorizationQueue,
    assigner: ServiceId | null,
  ): Result<OK, UpdatePrivilegesError> {
    if (this.authQueueResponse.isOk) {
      this.authQueue.push([coreIndex, authQueue, assigner]);
    }
    return this.authQueueResponse;
  }

  yield(hash: OpaqueHash): void {
    this.yieldHash = hash;
  }

  providePreimage(service: ServiceId | null, preimage: BytesBlob): Result<OK, ProvidePreimageError> {
    if (service === null) {
      return Result.error(ProvidePreimageError.ServiceNotFound, () => "Mock: service is null for providePreimage");
    }
    this.providePreimageData.push([service, preimage]);
    return this.providePreimageResponse;
  }
}
```
