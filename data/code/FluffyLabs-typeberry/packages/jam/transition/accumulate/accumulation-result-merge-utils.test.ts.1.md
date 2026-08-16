---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L121-L230
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 10
content_sha: 9bd5fe8d133db76edcd5bd392d98a3b5730bc3a71dabb988ee5099b6b13217ae
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 121–230)

```typescript
  private results = new Map<ServiceId, { consumedGas: ServiceGas; stateUpdate: AccumulationStateUpdate }>();

  private constructor() {}

  static new() {
    return new AccumulationResultsBuilder();
  }

  add(maybeServiceId: number, stateUpdate: AccumulationStateUpdate, consumedGas = 100n) {
    const serviceId = tryAsServiceId(maybeServiceId);

    if (this.results.has(serviceId)) {
      throw new Error(`Service(${serviceId}) already exists in the results`);
    }

    this.results.set(serviceId, { consumedGas: tryAsServiceGas(consumedGas), stateUpdate });

    return this;
  }

  get() {
    return this.results;
  }
}

function createTransfer(opts: { source: number; destination: number; amount: U64; gas: bigint }): PendingTransfer {
  return PendingTransfer.create({
    source: tryAsServiceId(opts.source),
    destination: tryAsServiceId(opts.destination),
    amount: opts.amount,
    memo: Bytes.fill(TRANSFER_MEMO_BYTES, 0),
    gas: tryAsServiceGas(opts.gas),
  });
}

function createValidatorData(i: number): ValidatorData {
  return ValidatorData.create({
    bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, i).asOpaque(),
    bls: Bytes.fill(BLS_KEY_BYTES, i).asOpaque(),
    ed25519: Bytes.fill(ED25519_KEY_BYTES, i).asOpaque(),
    metadata: Bytes.fill(VALIDATOR_META_BYTES, i).asOpaque(),
  });
}

function createValidatorsData(i: number): PerValidator<ValidatorData> {
  return tryAsPerValidator(new Array(tinyChainSpec.validatorsCount).fill(createValidatorData(i)), tinyChainSpec);
}

function createStorageItem(keyByte: number, valueByte: number): StorageItem {
  const key = Bytes.fill(4, keyByte).asOpaque();
  const value = Bytes.fill(3, valueByte);
  return StorageItem.create({ key, value });
}

function createStorageSetUpdate(keyByte: number, valueByte: number): UpdateStorage {
  return UpdateStorage.set({ storage: createStorageItem(keyByte, valueByte) });
}

function createStorageRemoveUpdate(keyByte: number): UpdateStorage {
  const key = Bytes.fill(4, keyByte).asOpaque();
  return UpdateStorage.remove({ key });
}

function createPrivilegedServices(data: Partial<PrivilegedServices> = {}) {
  const DEFAULT_PRIVILEGED_SERVICES = PrivilegedServices.create({
    manager: tryAsServiceId(0),
    assigners: tryAsPerCore(new Array(tinyChainSpec.coresCount).fill(tryAsServiceId(0)), tinyChainSpec),
    delegator: tryAsServiceId(0),
    registrar: tryAsServiceId(0),
    autoAccumulateServices: new Map(),
  });

  return PrivilegedServices.create({
    ...DEFAULT_PRIVILEGED_SERVICES,
    ...data,
  });
}

describe("mergePerallelAccumulationResults", () => {
  describe("mergePrivilegedServices", () => {
    it("should update manager, assigners, delegator, registrar, and autoAccumulateServices from privileged service results", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();
      const currentManagerServiceId = state.privilegedServices.manager;
      const newManager = tryAsServiceId(42);
      const newAssigners = tryAsPerCore(Array(tinyChainSpec.coresCount).fill(tryAsServiceId(7)), tinyChainSpec);
      const newDelegator = tryAsServiceId(99);
      const newRegistrar = tryAsServiceId(123);
      const newAutoAccumulateServices = new Map([
        [tryAsServiceId(1), tryAsServiceGas(100n)],
        [tryAsServiceId(2), tryAsServiceGas(0n)],
      ]);

      const newPrivilegedServices = PrivilegedServices.create({
        manager: newManager,
        assigners: newAssigners,
        delegator: newDelegator,
        registrar: newRegistrar,
        autoAccumulateServices: newAutoAccumulateServices,
      });

      const results = AccumulationResultsBuilder.new()
        .add(
          currentManagerServiceId,
          AccumulationStateUpdateBuilder.new().withPrivilegedServices(newPrivilegedServices).get(),
        )
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

```
