---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/gas.ts#L1-L48
title: packages/core/pvm-interpreter/gas.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: fd0faff4186db671918a2d7e4ce5d06321dbaf772530a86612aaeaa157c25c87
language: typescript
---
`packages/core/pvm-interpreter/gas.ts` (lines 1–48)

```typescript
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { type Gas, type IGasCounter, tryAsGas } from "@typeberry/pvm-interface";

/** Create a new gas counter instance depending on the gas value. */
export function gasCounter(gas: Gas): IGasCounter {
  return GasCounterU64.new(tryAsU64(gas));
}

class GasCounterU64 implements IGasCounter {
  initialGas: Gas;

  static new(gas: U64) {
    return new GasCounterU64(gas);
  }

  private constructor(private gas: U64) {
    this.initialGas = tryAsGas(gas);
  }

  set(g: Gas) {
    this.gas = tryAsU64(g);
  }

  get() {
    return tryAsGas(this.gas);
  }

  sub(g: Gas) {
    const result = this.gas - tryAsU64(g);
    if (result >= 0n) {
      this.gas = tryAsU64(result);
      return false;
    }
    this.gas = tryAsU64(0n);
    return true;
  }

  used(): Gas {
    const gasConsumed = tryAsU64(this.initialGas) - this.gas;

    // In we have less than zero left we assume that all gas has been consumed.
    if (gasConsumed < 0) {
      return this.initialGas;
    }

    return tryAsGas(gasConsumed);
  }
}
```
