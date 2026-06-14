---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/program-decoder/program-decoder.ts#L1-L75
title: packages/core/pvm-interpreter/program-decoder/program-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 24de9d1123a609413de397a39c2ba7ea2494768c98c3666c9c47e5cd59833833
language: typescript
---
`packages/core/pvm-interpreter/program-decoder/program-decoder.ts` (lines 1–75)

```typescript
import { Decoder } from "@typeberry/codec";
import { Logger } from "@typeberry/logger";
import { Result } from "@typeberry/utils";
import { JumpTable } from "./jump-table.js";
import { Mask } from "./mask.js";

const logger = Logger.new(import.meta.filename, "pvm-interpreter");

export enum ProgramDecoderError {
  InvalidProgramError = 0,
}

export class ProgramDecoder {
  private code: Uint8Array;
  private mask: Mask;
  private jumpTable: JumpTable;

  static new(rawProgram: Uint8Array) {
    return new ProgramDecoder(rawProgram);
  }

  private constructor(rawProgram: Uint8Array) {
    const { code, mask, jumpTable, jumpTableItemLength } = this.decodeProgram(rawProgram);

    this.code = new Uint8Array(code);
    this.mask = Mask.new(mask);
    this.jumpTable = JumpTable.fromRaw(jumpTableItemLength, jumpTable);
  }

  private decodeProgram(program: Uint8Array) {
    const decoder = Decoder.fromBlob(program);
    // number of items in the jump table
    const jumpTableLength = decoder.varU32();
    // how many bytes are used to encode a single item of the jump table
    const jumpTableItemLength = decoder.u8();
    // the length of the code (in bytes).
    const codeLength = decoder.varU32();

    const jumpTableLengthInBytes = jumpTableLength * jumpTableItemLength;
    const jumpTable = decoder.bytes(jumpTableLengthInBytes).raw;

    const code = decoder.bytes(codeLength).raw;
    const mask = decoder.bitVecFixLen(codeLength);
    decoder.finish();

    return {
      mask,
      code,
      jumpTableItemLength,
      jumpTable,
    };
  }

  getMask() {
    return this.mask;
  }

  getCode() {
    return this.code;
  }

  getJumpTable() {
    return this.jumpTable;
  }

  /** https://graypaper.fluffylabs.dev/#/68eaa1f/23f400234701?v=0.6.4 */
  static deblob(program: Uint8Array): Result<ProgramDecoder, ProgramDecoderError> {
    try {
      return Result.ok(ProgramDecoder.new(program));
    } catch (e) {
      logger.error`Invalid program: ${e}`;
      return Result.error(ProgramDecoderError.InvalidProgramError, () => `Program decoder error: ${e}`);
    }
  }
}
```
