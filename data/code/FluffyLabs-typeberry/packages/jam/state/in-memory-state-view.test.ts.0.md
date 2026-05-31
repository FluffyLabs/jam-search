---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state-view.test.ts#L1-L52
title: packages/jam/state/in-memory-state-view.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3c3e487f7f167b86513de8a6caecb2281a41504cc74a5b3781e4c8fe78e7b7b4
language: typescript
---
`packages/jam/state/in-memory-state-view.test.ts` (lines 1–52)

```typescript
import { describe, it } from "node:test";
import type { BytesBlob } from "@typeberry/bytes";
import { type Encode, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { deepEqual } from "@typeberry/utils";
import { accumulationQueueCodec } from "./accumulation-queue.js";
import { availabilityAssignmentsCodec } from "./assurances.js";
import { authPoolsCodec, authQueuesCodec } from "./auth.js";
import { recentlyAccumulatedCodec } from "./recently-accumulated.js";
import { SafroleData } from "./safrole-data.js";
import { testState } from "./test.utils.js";
import { validatorsDataCodec } from "./validator-data.js";

const encode = <T>(codec: Encode<T>, val: T): BytesBlob => {
  return Encoder.encodeObject(codec, val, tinyChainSpec);
};

describe("InMemoryStateView", () => {
  it("should match encoded state", () => {
    const state = testState();
    const view = state.view();
    const serviceId = state.services.keys().next().value;
    if (serviceId === undefined) {
      throw new Error("missing service!");
    }

    deepEqual(view.accumulationQueueView().encoded(), encode(accumulationQueueCodec, state.accumulationQueue));
    deepEqual(view.authPoolsView().encoded(), encode(authPoolsCodec, state.authPools));
    deepEqual(view.authQueuesView().encoded(), encode(authQueuesCodec, state.authQueues));
    deepEqual(
      view.availabilityAssignmentView().encoded(),
      encode(availabilityAssignmentsCodec, state.availabilityAssignment),
    );
    deepEqual(view.currentValidatorDataView().encoded(), encode(validatorsDataCodec, state.currentValidatorData));
    deepEqual(view.designatedValidatorDataView().encoded(), encode(validatorsDataCodec, state.designatedValidatorData));
    deepEqual(view.getServiceInfoView(serviceId)?.materialize(), state.getService(serviceId)?.getInfo());
    deepEqual(view.previousValidatorDataView().encoded(), encode(validatorsDataCodec, state.previousValidatorData));
    deepEqual(view.recentBlocksView().materialize(), state.recentBlocks);
    deepEqual(view.recentlyAccumulatedView().encoded(), encode(recentlyAccumulatedCodec, state.recentlyAccumulated));

    deepEqual(
      view.safroleDataView().materialize(),
      SafroleData.create({
        nextValidatorData: state.nextValidatorData,
        epochRoot: state.epochRoot,
        sealingKeySeries: state.sealingKeySeries,
        ticketsAccumulator: state.ticketsAccumulator,
      }),
    );
    deepEqual(view.statisticsView().materialize(), state.statistics);
  });
});
```
