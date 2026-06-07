---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/verification-utils.test.ts#L1-L95
title: packages/jam/transition/disputes/verification-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5a2bb15147a347449f1c0f168fe5e21effab30999a15aa285388c7294356b0f8
language: typescript
---
`packages/jam/transition/disputes/verification-utils.test.ts` (lines 1–95)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";

import { tryAsValidatorIndex } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { ED25519_KEY_BYTES, ED25519_SIGNATURE_BYTES, initWasm } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { prepareCulpritSignature, prepareJudgementSignature, vefifyAllSignatures } from "./verification-utils.js";

before(async () => {
  await initWasm();
});

describe("verification-utils", () => {
  describe("verifyVoteSignature", () => {
    it("should return true for valid signature and valid work report", async () => {
      const signature = Bytes.parseBytes(
        "0x0b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
        ED25519_SIGNATURE_BYTES,
      ).asOpaque();
      const key = Bytes.parseBytes(
        "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
        ED25519_KEY_BYTES,
      ).asOpaque();
      const workReportHash = Bytes.parseBytes(
        "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
        HASH_SIZE,
      ).asOpaque();
      const isWorkReportValid = true;
      const item = prepareJudgementSignature(
        { index: tryAsValidatorIndex(0), isWorkReportValid, signature },
        workReportHash,
        key,
      );

      const { judgements } = await vefifyAllSignatures({ culprits: [], faults: [], judgements: [item] });

      assert.strictEqual(judgements[0].isValid, true);
    });

    it("should return false for invalid signature (value of isWorkReportValid is changed)", async () => {
      const signature = Bytes.parseBytes(
        "0x0b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
        ED25519_SIGNATURE_BYTES,
      ).asOpaque();
      const key = Bytes.parseBytes(
        "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
        ED25519_KEY_BYTES,
      ).asOpaque();
      const workReportHash = Bytes.parseBytes(
        "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
        HASH_SIZE,
      ).asOpaque();
      const isWorkReportValid = false;
      const item = prepareJudgementSignature(
        { index: tryAsValidatorIndex(0), isWorkReportValid, signature },
        workReportHash,
        key,
      );

      const { judgements } = await vefifyAllSignatures({ culprits: [], faults: [], judgements: [item] });

      assert.strictEqual(judgements[0].isValid, false);
    });

    it("should return true for valid signature and invalid work report", async () => {
      const signature = Bytes.parseBytes(
        "0xd76bba06ffb8042bedce3f598e22423660e64f2108566cbd548f6d2c42b1a39607a214bddfa7ccccf83fe993728a58393c64283b8a9ab8f3dff49cbc3cc2350e",
        ED25519_SIGNATURE_BYTES,
      ).asOpaque();
      const key = Bytes.parseBytes(
        "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
        ED25519_KEY_BYTES,
      ).asOpaque();
      const workReportHash = Bytes.parseBytes(
        "0x7b0aa1735e5ba58d3236316c671fe4f00ed366ee72417c9ed02a53a8019e85b8",
        HASH_SIZE,
      ).asOpaque();
      const isWorkReportValid = false;
      const item = prepareJudgementSignature(
        { index: tryAsValidatorIndex(0), isWorkReportValid, signature },
        workReportHash,
        key,
      );

      const { judgements } = await vefifyAllSignatures({ culprits: [], faults: [], judgements: [item] });

      assert.strictEqual(judgements[0].isValid, true);
    });

    it("should return false for invalid signature (the first byte in signature is changed)", async () => {
      const signature = Bytes.parseBytes(
        "0x1b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
        ED25519_SIGNATURE_BYTES,
      ).asOpaque();
```
