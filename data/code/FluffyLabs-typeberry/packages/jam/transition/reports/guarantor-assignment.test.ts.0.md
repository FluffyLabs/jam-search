---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/guarantor-assignment.test.ts#L1-L68
title: packages/jam/transition/reports/guarantor-assignment.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 4
content_sha: 08c28eae25665d85dcb4b25129ac09177d11b9e3acb5e8abefa92d221e789c2e
language: typescript
---
`packages/jam/transition/reports/guarantor-assignment.test.ts` (lines 1–68)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { tryAsPerValidator, tryAsTimeSlot } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { deepEqual } from "@typeberry/utils";
import { generateCoreAssignment } from "./guarantor-assignment.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("Core assignment", () => {
  it("should assign validators to cores in tinyChainSpec", async () => {
    const spec = tinyChainSpec;
    const entropy = Bytes.fill(HASH_SIZE, 1).asOpaque();

    const coreAssignment1 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(1));
    const coreAssignment2 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(11));

    deepEqual(coreAssignment1, tryAsPerValidator([1, 1, 1, 0, 0, 0], spec));
    deepEqual(coreAssignment2, tryAsPerValidator([1, 1, 1, 0, 0, 0], spec));
  });

  it("should assign validators to cores in tinyChainSpec - 2", async () => {
    const spec = tinyChainSpec;
    const entropy = Bytes.parseBytes(
      "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
      HASH_SIZE,
    ).asOpaque();

    const coreAssignment1 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(14));
    const coreAssignment2 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(11));

    assert.deepStrictEqual(coreAssignment1, tryAsPerValidator([1, 0, 0, 1, 0, 1], spec));
    assert.deepStrictEqual(coreAssignment2, tryAsPerValidator([1, 0, 0, 1, 0, 1], spec));
  });

  it("should assign validators to cores in fullChainSpec", async () => {
    const spec = fullChainSpec;
    const entropy = Bytes.fill(HASH_SIZE, 0xfe).asOpaque();

    const coreAssignment1 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(1));
    const coreAssignment2 = generateCoreAssignment(spec, blake2b, entropy, tryAsTimeSlot(132));

    deepEqual(coreAssignment1.toString(), tryAsPerValidator(FULL_1, spec).toString());
    deepEqual(coreAssignment2.toString(), tryAsPerValidator(FULL_2, spec).toString());
  });
});

const FULL_1 = [
  54, 104, 98, 198, 269, 242, 291, 11, 97, 113, 120, 257, 76, 113, 154, 277, 227, 15, 298, 128, 56, 133, 32, 162, 293,
  313, 67, 91, 123, 137, 119, 168, 306, 148, 319, 74, 34, 325, 106, 134, 308, 191, 232, 22, 6, 27, 281, 264, 263, 251,
  170, 262, 11, 183, 278, 286, 177, 318, 63, 252, 29, 306, 46, 286, 44, 340, 211, 21, 202, 227, 311, 322, 239, 245, 43,
  122, 75, 120, 15, 211, 132, 212, 126, 8, 141, 94, 201, 61, 314, 257, 229, 152, 48, 68, 179, 186, 301, 157, 86, 130,
  197, 307, 250, 296, 240, 65, 241, 130, 213, 233, 45, 309, 235, 332, 124, 93, 88, 225, 206, 316, 225, 284, 312, 336,
  290, 302, 11, 331, 197, 253, 12, 40, 304, 51, 70, 301, 191, 25, 17, 160, 182, 264, 59, 270, 317, 78, 215, 10, 85, 26,
  131, 193, 287, 181, 310, 251, 311, 219, 105, 299, 267, 179, 73, 187, 271, 166, 19, 174, 255, 188, 72, 55, 291, 16,
  194, 55, 127, 29, 254, 269, 162, 79, 286, 36, 56, 221, 128, 102, 64, 62, 114, 251, 169, 44, 128, 78, 269, 261, 287,
  92, 3, 17, 35, 42, 54, 298, 123, 279, 301, 127, 147, 195, 253, 144, 103, 118, 237, 68, 236, 304, 160, 116, 205, 184,
  154, 98, 177, 152, 101, 35, 69, 297, 182, 125, 330, 43, 20, 22, 108, 149, 178, 329, 118, 278, 259, 292, 104, 180, 1,
  176, 215, 178, 146, 324, 25, 7, 208, 302, 218, 209, 334, 193, 159, 198, 323, 235, 261, 33, 230, 322, 83, 97, 224, 327,
  9, 136, 317, 81, 231, 84, 268, 63, 7, 121, 73, 320, 21, 135, 277, 180, 246, 312, 329, 66, 176, 112, 10, 273, 323, 218,
  336, 318, 253, 330, 5, 339, 100, 258, 55, 303, 116, 107, 331, 175, 308, 129, 80, 171, 311, 165, 271, 285, 201, 332,
  100, 56, 204, 217, 42, 275, 171, 207, 5, 25, 3, 222, 32, 138, 9, 64, 101, 190, 221, 231, 244, 41, 192, 236, 28, 33,
```
