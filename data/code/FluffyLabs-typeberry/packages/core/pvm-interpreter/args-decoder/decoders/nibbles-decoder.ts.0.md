---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/nibbles-decoder.ts#L1-L36
title: packages/core/pvm-interpreter/args-decoder/decoders/nibbles-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1e78cbfadfab8bc62f10b82dd9b077c4d90b5bbb5ed961f41e8eabe6596de9ed
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/nibbles-decoder.ts` (lines 1–36)

```typescript
import { NO_OF_REGISTERS } from "@typeberry/pvm-interface";

const MAX_REGISTER_INDEX = NO_OF_REGISTERS - 1;
const MAX_LENGTH = 4;

export class NibblesDecoder {
  private byte = new Int8Array(1);

  setByte(byte: number) {
    this.byte[0] = byte;
  }

  getHighNibble() {
    return (this.byte[0] & 0xf0) >>> 4;
  }

  getLowNibble() {
    return this.byte[0] & 0x0f;
  }

  getHighNibbleAsRegisterIndex() {
    return Math.min(this.getHighNibble(), MAX_REGISTER_INDEX);
  }

  getLowNibbleAsRegisterIndex() {
    return Math.min(this.getLowNibble(), MAX_REGISTER_INDEX);
  }

  getHighNibbleAsLength() {
    return Math.min(this.getHighNibble(), MAX_LENGTH);
  }

  getLowNibbleAsLength() {
    return Math.min(this.getLowNibble(), MAX_LENGTH);
  }
}
```
