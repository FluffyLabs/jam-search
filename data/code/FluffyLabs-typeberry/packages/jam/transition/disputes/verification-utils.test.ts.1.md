---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/verification-utils.test.ts#L92-L158
title: packages/jam/transition/disputes/verification-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 7556effea44d54805de0eb4a43a37439b602190f4e911af7e90c7821d00d3c24
language: typescript
---
`packages/jam/transition/disputes/verification-utils.test.ts` (lines 92–158)

```typescript
      const signature = Bytes.parseBytes(
        "0x1b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
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

      assert.strictEqual(judgements[0].isValid, false);
    });
  });

  describe("verifyCulpritSignature", () => {
    it("should return true for valid signature", async () => {
      const signature = Bytes.parseBytes(
        "0xf23e45d7f8977a8eda61513bd5cab1451eb64f265edf340c415f25480123391364521f9bb4c14f840a0dae20eb4dc4a735c961d9966da51dde0d85281dc1dc0b",
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
      const item = prepareCulpritSignature({ key, signature, workReportHash });

      const { culprits } = await vefifyAllSignatures({ culprits: [item], faults: [], judgements: [] });

      assert.strictEqual(culprits[0].isValid, true);
    });

    it("should return false for invalid signature (the first byte in signature is changed)", async () => {
      const signature = Bytes.parseBytes(
        "0xe23e45d7f8977a8eda61513bd5cab1451eb64f265edf340c415f25480123391364521f9bb4c14f840a0dae20eb4dc4a735c961d9966da51dde0d85281dc1dc0b",
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
      const item = prepareCulpritSignature({ key, signature, workReportHash });

      const { culprits } = await vefifyAllSignatures({ culprits: [item], faults: [], judgements: [] });

      assert.strictEqual(culprits[0].isValid, false);
    });
  });
});
```
