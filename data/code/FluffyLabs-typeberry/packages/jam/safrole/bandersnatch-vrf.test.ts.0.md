---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/bandersnatch-vrf.test.ts#L1-L75
title: packages/jam/safrole/bandersnatch-vrf.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 9
content_sha: e612f827d59f234a7c5be0d3e9d8187f94535c14ce3474ddb17c4ccde33327ed
language: typescript
---
`packages/jam/safrole/bandersnatch-vrf.test.ts` (lines 1–75)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";

import { tryAsValidatorIndex } from "@typeberry/block";
import { type SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize } from "@typeberry/collections";
import { BANDERSNATCH_KEY_BYTES, SEED_SIZE } from "@typeberry/crypto";
import {
  BANDERSNATCH_PROOF_BYTES,
  BANDERSNATCH_RING_ROOT_BYTES,
  BANDERSNATCH_VRF_SIGNATURE_BYTES,
  type BandersnatchKey,
  type BandersnatchRingRoot,
} from "@typeberry/crypto/bandersnatch.js";
import { deriveBandersnatchPublicKey } from "@typeberry/crypto/key-derivation.js";
import { HASH_SIZE } from "@typeberry/hash";
import { deepEqual, Result } from "@typeberry/utils";
import bandersnatchVrf from "./bandersnatch-vrf.js";
import { BandernsatchWasm } from "./bandersnatch-wasm.js";

const bandersnatchWasm = BandernsatchWasm.new();

const attempt = (v: number) => tryAsTicketAttempt(v);

describe("Bandersnatch verification", () => {
  describe("getRingCommitment", () => {
    const bandersnatchKeys = asKnownSize(
      [
        "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
        "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
        "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
        "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
        "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
        "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
      ].map((x) => Bytes.parseBytes(x, BANDERSNATCH_KEY_BYTES).asOpaque()),
    );

    it("should return commitment", async () => {
      const result = await bandersnatchVrf.getRingCommitment(await bandersnatchWasm, bandersnatchKeys);
      const expectedCommitment = Bytes.parseBytes(
        "0x8387a131593447e4e1c3d4e220c322e42d33207fa77cd0fedb39fc3491479ca47a2d82295252e278fa3eec78185982ed82ae0c8fd691335e703d663fb5be02b3def15380789320636b2479beab5a03ccb3f0909ffea59d859fcdc7e187e45a8c92e630ae2b14e758ab0960e372172203f4c9a41777dadd529971d7ab9d23ab29fe0e9c85ec450505dde7f5ac038274cf",
        BANDERSNATCH_RING_ROOT_BYTES,
      );

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok.toString(), expectedCommitment.toString());
    });
  });

  describe("verifyTickets", () => {
    const bandersnatchKeys = [
      "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
      "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
      "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
      "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
      "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
      "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
    ].map((x) => Bytes.parseBytes(x, BANDERSNATCH_KEY_BYTES).asOpaque<BandersnatchKey>());

    let commitment: BandersnatchRingRoot;
    before(async () => {
      const res = await bandersnatchVrf.getRingCommitment(await bandersnatchWasm, bandersnatchKeys);
      if (res.isOk) {
        commitment = res.ok;
      } else {
        throw new Error("Unable to calculate ring commitment.");
      }
    });

    it("should confirm that all tickets are valid and return correct ids", async () => {
      const tickets: SignedTicket[] = [
        {
          attempt: attempt(1),
          signature: Bytes.parseBytes(
```
