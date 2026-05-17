---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialized-state-view.ts#L103-L144
title: packages/jam/state-merkleization/serialized-state-view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: d84c3a3e0f90fd09789a46c94fc7a19e0f50951b04ef4da3435009058f4fd6ad
language: typescript
---
`packages/jam/state-merkleization/serialized-state-view.ts` (lines 103–144)

```typescript
  authQueuesView(): SequenceView<AuthorizationQueue, SequenceView<AuthorizerHash>> {
    return this.retrieveView(serialize.authQueues, "authQueuesView");
  }

  recentBlocksView(): RecentBlocksView {
    return this.retrieveView(serialize.recentBlocks, "recentBlocksView");
  }

  statisticsView(): StatisticsDataView {
    return this.retrieveView(serialize.statistics, "statisticsView");
  }

  accumulationQueueView(): AccumulationQueueView {
    return this.retrieveView(serialize.accumulationQueue, "accumulationQueueView");
  }

  recentlyAccumulatedView(): RecentlyAccumulatedView {
    return this.retrieveView(serialize.recentlyAccumulated, "recentlyAccumulatedView");
  }

  safroleDataView(): SafroleDataView {
    return this.retrieveView(serialize.safrole, "safroleDataView");
  }

  getServiceInfoView(id: ServiceId): ServiceAccountInfoView | null {
    const serviceData = serialize.serviceData(id);
    const bytes = this.backend.get(serviceData.key);
    if (bytes === null) {
      return null;
    }
    if (!this.recentlyUsedServices.includes(id)) {
      this.recentlyUsedServices.push(id);
    }

    return Decoder.decodeObject(serviceData.Codec.View, bytes, this.spec);
  }
}

type KeyAndCodecWithView<T, V> = {
  key: StateKey;
  Codec: CodecWithView<T, V>;
};
```
