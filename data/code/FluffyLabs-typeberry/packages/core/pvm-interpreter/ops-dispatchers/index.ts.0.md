---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/index.ts#L1-L13
title: packages/core/pvm-interpreter/ops-dispatchers/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3d343c3d2f5a5ba2e6a0fd4a10e1f6c95919bfce9faaff56abedcb1bbd32217a
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/index.ts` (lines 1–13)

```typescript
export { NoArgsDispatcher } from "./no-args-dispatcher.js";
export { OneImmDispatcher } from "./one-imm-dispatcher.js";
export { OneOffsetDispatcher } from "./one-offset-dispatcher.js";
export { OneRegOneExtImmDispatcher } from "./one-reg-one-ext-imm-dispatcher.js";
export { OneRegOneImmDispatcher } from "./one-reg-one-imm-dispatcher.js";
export { OneRegOneImmOneOffsetDispatcher } from "./one-reg-one-imm-one-offset-dispatcher.js";
export { OneRegTwoImmsDispatcher } from "./one-reg-two-imms-dispatcher.js";
export { ThreeRegsDispatcher } from "./three-regs-dispatcher.js";
export { TwoImmsDispatcher } from "./two-imms-dispatcher.js";
export { TwoRegsDispatcher } from "./two-regs-dispatcher.js";
export { TwoRegsOneImmDispatcher } from "./two-regs-one-imm-dispatcher.js";
export { TwoRegsOneOffsetDispatcher } from "./two-regs-one-offset-dispatcher.js";
export { TwoRegsTwoImmsDispatcher } from "./two-regs-two-imms-dispatcher.js";
```
