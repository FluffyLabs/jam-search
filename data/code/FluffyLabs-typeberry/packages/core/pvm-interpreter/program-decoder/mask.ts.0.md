---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/program-decoder/mask.ts#L1-L62
title: packages/core/pvm-interpreter/program-decoder/mask.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 52aac3a2651e889c0d57a811dbabb5caafdf413f6d12ae2042c52ab358abb3cc
language: typescript
---
`packages/core/pvm-interpreter/program-decoder/mask.ts` (lines 1–62)

```typescript
import { BitVec } from "@typeberry/bytes";
import { check, safeAllocUint8Array } from "@typeberry/utils";

/**
 * Upper bound of instruction distance - it is equal to max value of GP's skip function + 1
 */
const MAX_INSTRUCTION_DISTANCE = 25;

/**
 * Mask class is an implementation of skip function defined in GP.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/237201239801
 */
export class Mask {
  /**
   * The lookup table will have `0` at the index which corresponds to an instruction on the same index in the bytecode.
   * In case the value is non-zero it signifies the offset to the index with next instruction.
   *
   * Example:
   * ```
   * 0..1..2..3..4..5..6..7..8..9 # Indices
   * 0..2..1..0..1..0..3..2..1..0 # lookupTable forward values
   * ```
   * There are instructions at indices `0, 3, 5, 9`.
   */
  private lookupTableForward: Uint8Array;

  static new(mask: BitVec) {
    return new Mask(mask);
  }

  private constructor(mask: BitVec) {
    this.lookupTableForward = this.buildLookupTableForward(mask);
  }

  isInstruction(index: number) {
    return this.lookupTableForward[index] === 0;
  }

  getNoOfBytesToNextInstruction(index: number) {
    check`${index >= 0} index (${index}) cannot be a negative number`;
    return Math.min(this.lookupTableForward[index] ?? 0, MAX_INSTRUCTION_DISTANCE);
  }

  private buildLookupTableForward(mask: BitVec) {
    const table = safeAllocUint8Array(mask.bitLength);
    let lastInstructionOffset = 0;
    for (let i = mask.bitLength - 1; i >= 0; i--) {
      if (mask.isSet(i)) {
        lastInstructionOffset = 0;
      } else {
        lastInstructionOffset++;
      }
      table[i] = lastInstructionOffset;
    }
    return table;
  }

  static empty() {
    return new Mask(BitVec.empty(0));
  }
}
```
