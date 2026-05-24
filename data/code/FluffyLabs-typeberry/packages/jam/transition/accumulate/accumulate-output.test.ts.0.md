---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-output.test.ts#L1-L48
title: packages/jam/transition/accumulate/accumulate-output.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3082fa8b250d11d1e4dc41adfdc5f737e0c970852f2b6a2d3a638d335b08fc99
language: typescript
---
`packages/jam/transition/accumulate/accumulate-output.test.ts` (lines 1–48)

```typescript
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { SortedArray } from "@typeberry/collections";
import { HASH_SIZE } from "@typeberry/hash";
import { AccumulationOutput, accumulationOutputComparator } from "@typeberry/state";
import { deepEqual } from "@typeberry/utils";
import { AccumulateOutput } from "./accumulate-output.js";

describe("AccumulateOutput", () => {
  function prepareAccumulationOutput(length: number): SortedArray<AccumulationOutput> {
    const output: AccumulationOutput[] = [];

    for (let i = 0; i < length; i++) {
      output.push(
        AccumulationOutput.create({
          serviceId: tryAsServiceId(i),
          output: Bytes.fill(HASH_SIZE, i).asOpaque(),
        }),
      );
    }

    return SortedArray.fromArray(accumulationOutputComparator, output);
  }

  it("should return empty hash when input is empty", async () => {
    const accumulateOutput = new AccumulateOutput();
    const accumulationOutputLog = prepareAccumulationOutput(0);
    const expectedAccumulateRoot = Bytes.fill(HASH_SIZE, 0);

    const accumulateRoot = await accumulateOutput.transition({ accumulationOutputLog });

    deepEqual(accumulateRoot, expectedAccumulateRoot);
  });

  it("should return correct root hash when input is not empty", async () => {
    const accumulateOutput = new AccumulateOutput();
    const accumulationOutputLog = prepareAccumulationOutput(10);
    const expectedAccumulateRoot = Bytes.parseBytes(
      "0x90328360e199f220b0efac00ec6f3a8511fe511ea0657374df04cc566664d29e",
      HASH_SIZE,
    );

    const accumulateRoot = await accumulateOutput.transition({ accumulationOutputLog });

    deepEqual(accumulateRoot, expectedAccumulateRoot);
  });
});
```
