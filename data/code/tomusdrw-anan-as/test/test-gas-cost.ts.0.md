---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/test/test-gas-cost.ts#L1-L71'
title: test/test-gas-cost.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c32b441be89bf82c156b72ec7427a78dc1efa48f88dfc295028c12836b01d0c0
language: typescript
---
`test/test-gas-cost.ts` (lines 1–71)

```typescript
#!/usr/bin/env node

import "json-bigint-patch";
import * as assert from "node:assert";
import { ERR, OK, ProcessableData, read, run, TestOptions } from "../bin/src/test-json.js";
import { disassemble, getBlockGasCosts, HasMetadata, InputKind } from "../build/release.js";

// Run the CLI application
main();

type GasCostTest = {
  program: number[];
  block_gas_costs: Record<number, number>;
} & ProcessableData;

// Main function
function main() {
  const options: TestOptions = {
    isDebug: false,
    isSilent: false,
  };

  run(processGasCost, options);
}

function processGasCost(data: GasCostTest, options: TestOptions, filePath: string) {
  if (options.isDebug) {
    console.info(`🤖 reading ${filePath}`);
  }
  // input
  const input = {
    program: read(data, "program"),
    blockGasCosts: read(data, "block_gas_costs"),
  };

  if (options.isDebug) {
    const assembly = disassemble(input.program, InputKind.Generic, HasMetadata.No);
    console.info("===========");
    console.info(assembly);
    console.info("\n^^^^^^^^^^^\n");
  }

  const result = asMap(getBlockGasCosts(input.program, InputKind.Generic, HasMetadata.No));

  // silent mode - just put our vals into expected (comparison done externally)
  if (options.isSilent) {
    data.block_gas_costs = result;
    if (filePath !== "-") {
      console.log(JSON.stringify(data, null, 2));
    }
    return data;
  }

  try {
    assert.deepStrictEqual(result, input.blockGasCosts);
    console.log(`${OK} ${filePath}`);
  } catch (e) {
    console.log(`${ERR} ${filePath}`);
    throw e;
  }

  return data;
}

function asMap(costs: { pc: number; gas: bigint }[]) {
  const obj: Record<number, number> = {};
  for (const { pc, gas } of costs) {
    obj[pc] = Number(gas);
  }
  return obj;
}
```
