---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/host-call-registers.test.ts#L1-L27
title: packages/core/pvm-host-calls/host-call-registers.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bfbca0e756751d347f3d5ab11a6dcf6c9c93500264a5467e8516da5cebc0d7b1
language: typescript
---
`packages/core/pvm-host-calls/host-call-registers.test.ts` (lines 1–27)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { tryAsU64 } from "@typeberry/numbers";
import { HostCallRegisters } from "./host-call-registers.js";

describe("HostCallRegisters", () => {
  describe("getAllEncoded", () => {
    it("reads a u64 value from the underlying registers", () => {
      const regs = new BigUint64Array(13);
      regs[0] = 0xffff_ffff_ffff_fffdn;
      const hostCallRegisters = HostCallRegisters.fromRaw(new Uint8Array(regs.buffer));
      assert.strictEqual(hostCallRegisters.get(0), tryAsU64(0xffff_ffff_ffff_fffdn));
    });
  });

  describe("setAllEncoded", () => {
    it("writes a u64 value to the underlying registers", () => {
      const regs = new BigUint64Array(13);
      const hostCallRegisters = HostCallRegisters.fromRaw(new Uint8Array(regs.buffer));
      hostCallRegisters.set(0, tryAsU64(0xffff_ffff_ffff_fffdn));
      const view = new DataView(hostCallRegisters.getEncoded().buffer);
      assert.strictEqual(view.getBigUint64(0, true), tryAsU64(0xffff_ffff_ffff_fffdn));
      assert.strictEqual(regs[0], tryAsU64(0xffff_ffff_ffff_fffdn));
    });
  });
});
```
