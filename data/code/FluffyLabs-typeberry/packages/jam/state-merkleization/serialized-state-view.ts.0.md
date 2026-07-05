---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialized-state-view.ts#L1-L107
title: packages/jam/state-merkleization/serialized-state-view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 134d83202b9e7fc466aaf14061b248e10cede6ee720483f25104fbd602afe751
language: typescript
---
`packages/jam/state-merkleization/serialized-state-view.ts` (lines 1–107)

```typescript
import type { ServiceId } from "@typeberry/block";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import type { BytesBlob } from "@typeberry/bytes";
import { type CodecWithView, Decoder, type SequenceView } from "@typeberry/codec";
import type { HashDictionary } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import type {
  AccumulationQueueView,
  AuthorizationPool,
  AuthorizationQueue,
  AvailabilityAssignmentsView,
  RecentBlocksView,
  RecentlyAccumulatedView,
  SafroleDataView,
  ServiceAccountInfoView,
  StatisticsDataView,
  ValidatorData,
  ValidatorDataView,
} from "@typeberry/state";
import type { StateView } from "@typeberry/state/state-view.js";
import type { StateKey } from "./keys.js";
import { serialize } from "./serialize.js";

/**
 * Abstraction over some backend containing serialized state entries.
 *
 * This may or may not be backed by some on-disk database or can be just stored in memory.
 */
export interface SerializedStateBackend {
  /** Retrieve given state key. */
  get(key: StateKey): BytesBlob | null;
}

export class SerializedStateView<T extends SerializedStateBackend> implements StateView {
  private readonly spec: ChainSpec;
  public backend: T;
  /** Best-effort list of recently active services. */
  private readonly recentlyUsedServices: ServiceId[];
  private readonly viewCache: HashDictionary<StateKey, unknown>;

  /** Build a new view over an existing serialized-state backend. */
  static new<T extends SerializedStateBackend>(args: {
    spec: ChainSpec;
    backend: T;
    recentlyUsedServices: ServiceId[];
    viewCache: HashDictionary<StateKey, unknown>;
  }): SerializedStateView<T> {
    return new SerializedStateView(args.spec, args.backend, args.recentlyUsedServices, args.viewCache);
  }

  private constructor(
    spec: ChainSpec,
    backend: T,
    recentlyUsedServices: ServiceId[],
    viewCache: HashDictionary<StateKey, unknown>,
  ) {
    this.spec = spec;
    this.backend = backend;
    this.recentlyUsedServices = recentlyUsedServices;
    this.viewCache = viewCache;
  }

  private retrieveView<A, B>({ key, Codec }: KeyAndCodecWithView<A, B>, description: string): B {
    const cached = this.viewCache.get(key);
    if (cached !== undefined) {
      return cached as B;
    }
    const bytes = this.backend.get(key);
    if (bytes === null) {
      throw new Error(`Required state entry for ${description} is missing!. Accessing view of key: ${key}`);
    }
    // NOTE [ToDr] we are not using `Decoder.decodeObject` here because
    // it needs to get to the end of the data (skip), yet that's expensive.
    // we assume that the state data is correct and coherent anyway, so
    // for performance reasons we simply create the view here.
    const d = Decoder.fromBytesBlob(bytes);
    d.attachContext(this.spec);
    const view = Codec.View.decode(d);
    this.viewCache.set(key, view);
    return view;
  }

  availabilityAssignmentView(): AvailabilityAssignmentsView {
    return this.retrieveView(serialize.availabilityAssignment, "availabilityAssignmentView");
  }

  designatedValidatorDataView(): SequenceView<ValidatorData, ValidatorDataView> {
    return this.retrieveView(serialize.designatedValidators, "designatedValidatorsView");
  }

  currentValidatorDataView(): SequenceView<ValidatorData, ValidatorDataView> {
    return this.retrieveView(serialize.currentValidators, "currentValidatorsView");
  }

  previousValidatorDataView(): SequenceView<ValidatorData, ValidatorDataView> {
    return this.retrieveView(serialize.previousValidators, "previousValidatorsView");
  }

  authPoolsView(): SequenceView<AuthorizationPool, SequenceView<AuthorizerHash>> {
    return this.retrieveView(serialize.authPools, "authPoolsView");
  }

  authQueuesView(): SequenceView<AuthorizationQueue, SequenceView<AuthorizerHash>> {
    return this.retrieveView(serialize.authQueues, "authQueuesView");
  }

  recentBlocksView(): RecentBlocksView {
```
