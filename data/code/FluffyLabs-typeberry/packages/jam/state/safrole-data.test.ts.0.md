---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/safrole-data.test.ts#L1-L78
title: packages/jam/state/safrole-data.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 15
content_sha: 4115545598d9cd8eb0b4ad6df3e69483847ebc95d48dbce4677b0efb84f4764b
language: typescript
---
`packages/jam/state/safrole-data.test.ts` (lines 1–78)

```typescript
import { describe, it } from "node:test";
import { codecPerValidator, tryAsPerEpochBlock } from "@typeberry/block";
import { Ticket } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { codec, Decoder, Encoder } from "@typeberry/codec";
import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  BANDERSNATCH_RING_ROOT_BYTES,
  type BandersnatchKey,
} from "@typeberry/crypto/bandersnatch.js";
import { deepEqual } from "@typeberry/utils";
import { SafroleData, SafroleSealingKeysData } from "./safrole-data.js";
import { ValidatorData } from "./validator-data.js";

const banderKey = (hex: string): BandersnatchKey => {
  return Bytes.parseBytes(hex, BANDERSNATCH_KEY_BYTES).asOpaque();
};

describe("Safrole Data", () => {
  it("should decode safrole data", () => {
    const spec = tinyChainSpec;
    const validators = Decoder.decodeObject(
      codecPerValidator(ValidatorData.Codec),
      BytesBlob.parseBlob(VALIDATORS),
      spec,
    );
    const epochRoot = Bytes.parseBytes(BANDERSNATCH_RING_ROOT_DATA, BANDERSNATCH_RING_ROOT_BYTES).asOpaque();
    const sealingKeys = Decoder.decodeObject(
      SafroleSealingKeysData.Codec,
      BytesBlob.parseBlob(SEALING_KEYS_DATA),
      spec,
    );
    const ticketsAccumulator = Decoder.decodeObject(
      codec.sequenceVarLen(Ticket.Codec),
      BytesBlob.parseBlob(WTF_DATA),
      spec,
    );
    const safroleData = Decoder.decodeObject(SafroleData.Codec, BytesBlob.parseBlob(TEST_DATA), spec);

    deepEqual(
      safroleData,
      SafroleData.create({
        nextValidatorData: validators,
        epochRoot,
        sealingKeySeries: sealingKeys,
        ticketsAccumulator: asKnownSize(ticketsAccumulator),
      }),
    );
  });

  it("should encode and decode SafroleSealingKeys (keys variant)", () => {
    const spec = tinyChainSpec;
    const keys = [
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
      banderKey("0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d"),
      banderKey("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
      banderKey("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
      banderKey("0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0"),
      banderKey("0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d"),
      banderKey("0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0"),
      banderKey("0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3"),
    ];

    const original = SafroleSealingKeysData.keys(tryAsPerEpochBlock(keys, spec));
    const encoded = Encoder.encodeObject(SafroleSealingKeysData.Codec, original, spec);
    const decoded = Decoder.decodeObject(SafroleSealingKeysData.Codec, encoded, spec);

    deepEqual(decoded, original);
  });
});

const VALIDATORS =
```
