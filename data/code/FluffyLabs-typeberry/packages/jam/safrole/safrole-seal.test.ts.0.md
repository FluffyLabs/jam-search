---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole-seal.test.ts#L1-L92
title: packages/jam/safrole/safrole-seal.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 37385a1f4632b21661c491b7967d0e99ca28da637edada12f808f4175ea169c0
language: typescript
---
`packages/jam/safrole/safrole-seal.test.ts` (lines 1–92)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import {
  Header,
  reencodeAsView,
  tryAsPerEpochBlock,
  tryAsPerValidator,
  tryAsTimeSlot,
  tryAsValidatorIndex,
  ValidatorKeys,
} from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES } from "@typeberry/crypto";
import { BANDERSNATCH_VRF_SIGNATURE_BYTES } from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE } from "@typeberry/hash";
import { VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";
import { SafroleSealingKeysData } from "@typeberry/state/safrole-data.js";
import { BandernsatchWasm } from "./bandersnatch-wasm.js";
import { SafroleSeal } from "./safrole-seal.js";

const bandersnatch = BandernsatchWasm.new();

describe("Safrole Seal verification", () => {
  it("should verify a valid fallback mode seal and entropySource", async () => {
    // based on test-vectors/w3f-davxy_070/traces/fallback/00000002.json
    const header = Header.create({
      parentHeaderHash: Bytes.parseBytes(
        "0x74ad675f8d6480a17b6ec0178962ea0166053c384689044c6f4cd38c97c2776d",
        HASH_SIZE,
      ).asOpaque(),
      priorStateRoot: Bytes.parseBytes(
        "0x4542b8bd55b25f52767e37c1c72004fefdd068878084e9c87c3ab0dc38543173",
        HASH_SIZE,
      ).asOpaque(),
      extrinsicHash: Bytes.parseBytes(
        "0x189d15af832dfe4f67744008b62c334b569fcbb4c261e0f065655697306ca252",
        HASH_SIZE,
      ).asOpaque(),
      timeSlotIndex: tryAsTimeSlot(2),
      epochMarker: null,
      ticketsMarker: null,
      offendersMarker: [],
      bandersnatchBlockAuthorIndex: tryAsValidatorIndex(3),
      entropySource: Bytes.parseBytes(
        "0x21237c35f11cd849a27ffa62e4aeb1c9a06bca2e42b89e16f93932d773b4ed5e7df1d7c48986eeb1313462aec31668dbfa6d3e499b457c678320ce0bb0fb611be3b6b240e1cd757e624d50cb1a163ca5c6348f97b782f5db74f8877eae593a0d",
        BANDERSNATCH_VRF_SIGNATURE_BYTES,
      ).asOpaque(),
      seal: Bytes.parseBytes(
        "0x732cef37ec4d9f100aca7445a486afc3fa1015056e3377905168e7b88d40286e68d943e77c0e5f5539c40416cd494b50aeb227ba55701d64e5586c790aebc60c1eba819c07c1b6f8fbca0d7765caaa61e494271c925df7ee42e6a19b0d3d2313",
        BANDERSNATCH_VRF_SIGNATURE_BYTES,
      ).asOpaque(),
    });
    const spec = tinyChainSpec;
    const headerView = reencodeAsView(Header.Codec, header, spec);

    const safroleSeal = new SafroleSeal(bandersnatch);
    const result = await safroleSeal.verifyHeaderSeal(headerView, {
      currentValidatorData: TEST_VALIDATOR_DATA,
      sealingKeySeries: SEALING_KEYS,
      currentEntropy: Bytes.parseBytes(
        "0x405c80c1f6a2d5a0f8dbc56996f04230221100d9500244648f02a795d7850eac",
        HASH_SIZE,
      ).asOpaque(),
    });

    assert.strictEqual(result.isOk, true);
    assert.strictEqual(result.ok.toString(), "0xc13af3d0cbdb7174590f34518e3beb05708935ceaee242e7ba11a94ca87bd007");
  });

  it("should verify a valid ticket seal and entropySource", async () => {
    // based on test-vectors/w3f-davxy_070/traces/safrole/00000002.json
    const header = Header.create({
      parentHeaderHash: Bytes.parseBytes(
        "0x74ad675f8d6480a17b6ec0178962ea0166053c384689044c6f4cd38c97c2776d",
        HASH_SIZE,
      ).asOpaque(),
      priorStateRoot: Bytes.parseBytes(
        "0x4542b8bd55b25f52767e37c1c72004fefdd068878084e9c87c3ab0dc38543173",
        HASH_SIZE,
      ).asOpaque(),
      extrinsicHash: Bytes.parseBytes(
        "0x189d15af832dfe4f67744008b62c334b569fcbb4c261e0f065655697306ca252",
        HASH_SIZE,
      ).asOpaque(),
      timeSlotIndex: tryAsTimeSlot(2),
      epochMarker: null,
      ticketsMarker: null,
      offendersMarker: [],
      bandersnatchBlockAuthorIndex: tryAsValidatorIndex(3),
      entropySource: Bytes.parseBytes(
```
