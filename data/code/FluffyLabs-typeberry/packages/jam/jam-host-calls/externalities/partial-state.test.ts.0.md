---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state.test.ts#L1-L50
title: packages/jam/jam-host-calls/externalities/partial-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 59416c2a34c949bf26d4e9a3e8d16894a999fde93b463b6ada512c05b39568e1
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state.test.ts` (lines 1–50)

```typescript
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tryAsTimeSlot } from "@typeberry/block";
import { asKnownSize } from "@typeberry/collections";
import type { LookupHistorySlots } from "@typeberry/state";
import { PreimageStatusKind, slotsToPreimageStatus } from "./partial-state.js";

describe("slotsToPreimageStatus", () => {
  it("returns Requested when no slots are given", () => {
    const slots: LookupHistorySlots = asKnownSize([]);
    const result = slotsToPreimageStatus(slots);
    assert.deepEqual(result, {
      status: PreimageStatusKind.Requested,
    });
  });

  it("returns Available when one slot is given", () => {
    const slots: LookupHistorySlots = asKnownSize([tryAsTimeSlot(42)]);
    const result = slotsToPreimageStatus(slots);
    assert.deepEqual(result, {
      status: PreimageStatusKind.Available,
      data: slots,
    });
  });

  it("returns Unavailable when two slots are given", () => {
    const slots: LookupHistorySlots = asKnownSize([1, 2].map((x) => tryAsTimeSlot(x)));
    const result = slotsToPreimageStatus(slots);
    assert.deepEqual(result, {
      status: PreimageStatusKind.Unavailable,
      data: slots,
    });
  });

  it("returns Reavailable when three slots are given", () => {
    const slots: LookupHistorySlots = asKnownSize([10, 20, 30].map((x) => tryAsTimeSlot(x)));
    const result = slotsToPreimageStatus(slots);
    assert.deepEqual(result, {
      status: PreimageStatusKind.Reavailable,
      data: slots,
    });
  });

  it("throws an error when more than three slots are given", () => {
    const slots: LookupHistorySlots = asKnownSize([10, 20, 30, 40].map((x) => tryAsTimeSlot(x)));
    assert.throws(() => slotsToPreimageStatus(slots), {
      message: "Invalid slots length: 4",
    });
  });
});
```
