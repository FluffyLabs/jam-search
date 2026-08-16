---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/instruction-gas-map.ts#L1-L14
title: packages/core/pvm-interpreter/instruction-gas-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5503ff239d288a80cbac2406e22a84bdbece7506dbbe242c17176fad8eb81d78
language: typescript
---
`packages/core/pvm-interpreter/instruction-gas-map.ts` (lines 1–14)

```typescript
import type { SmallGas } from "@typeberry/pvm-interface";
import { byteToOpCodeMap } from "./assemblify.js";
import { HIGHEST_INSTRUCTION_NUMBER } from "./instruction.js";

export const instructionGasMap = (() => {
  const instructionGasMap = new Array<SmallGas>(HIGHEST_INSTRUCTION_NUMBER + 1);

  for (let i = 0; i < HIGHEST_INSTRUCTION_NUMBER + 1; i++) {
    const gas = byteToOpCodeMap[i]?.gas;
    instructionGasMap[i] = gas;
  }

  return instructionGasMap;
})();
```
