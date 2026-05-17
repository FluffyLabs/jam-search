---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/pvm-gas-cost.ts#L1-L24
title: bin/test-runner/w3f/pvm-gas-cost.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: da527e988c2e2a9413eacbaf72644448d99c9f9bc5a4c59e4b042513f3367444
language: typescript
---
`bin/test-runner/w3f/pvm-gas-cost.ts` (lines 1–24)

```typescript
import assert from "node:assert";
import { fromJson } from "@typeberry/block-json";
import { type FromJson, json } from "@typeberry/json-parser";
import { tryAsGas } from "@typeberry/pvm-interface";
import { Interpreter } from "@typeberry/pvm-interpreter";

export class PvmGasCostTest {
  static fromJson: FromJson<PvmGasCostTest> = {
    program: fromJson.uint8Array,
    block_gas_costs: json.map("string", "number"),
  };

  program!: Uint8Array;
  block_gas_costs!: Map<string, number>;
}

export async function runPvmGasCostTest(testContent: PvmGasCostTest) {
  const pvm = Interpreter.new();
  pvm.resetGeneric(testContent.program, 0, tryAsGas(1000));

  const blockGasCosts = pvm.calculateBlockGasCost();

  assert.deepStrictEqual(blockGasCosts, testContent.block_gas_costs);
}
```
