---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data.ts#L1-L93
title: packages/jam/transition/disputes/disputes.test.data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: 4f91eac9dedbdf46188520fb00c50dd9f9c1d5d821b400ce514e6f72b2cf9cf8
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data.ts` (lines 1–93)

```typescript
import { tryAsEpoch, tryAsPerValidator, tryAsValidatorIndex } from "@typeberry/block";
import { Culprit, Fault, Judgement, Verdict } from "@typeberry/block/disputes.js";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES, ED25519_SIGNATURE_BYTES } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";

export const currentValidatorData = tryAsPerValidator(
  [
    {
      bandersnatch: "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
      ed25519: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    },
    {
      bandersnatch: "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
      ed25519: "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
    },
    {
      bandersnatch: "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
      ed25519: "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
    },
    {
      bandersnatch: "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
      ed25519: "0xb3e0e096b02e2ec98a3441410aeddd78c95e27a0da6f411a09c631c0f2bea6e9",
    },
    {
      bandersnatch: "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
      ed25519: "0x5c7f34a4bd4f2d04076a8c6f9060a0c8d2c6bdd082ceb3eda7df381cb260faff",
    },
    {
      bandersnatch: "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
      ed25519: "0x837ce344bc9defceb0d7de7e9e9925096768b7adb4dad932e532eb6551e0ea02",
    },
  ].map(createValidatorData),
  tinyChainSpec,
);

export const previousValidatorData = tryAsPerValidator(
  [
    {
      bandersnatch: "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
      ed25519: "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
    },
    {
      bandersnatch: "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
      ed25519: "0x837ce344bc9defceb0d7de7e9e9925096768b7adb4dad932e532eb6551e0ea02",
    },
    {
      bandersnatch: "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
      ed25519: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    },
    {
      bandersnatch: "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
      ed25519: "0x5c7f34a4bd4f2d04076a8c6f9060a0c8d2c6bdd082ceb3eda7df381cb260faff",
    },
    {
      bandersnatch: "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
      ed25519: "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
    },
    {
      bandersnatch: "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
      ed25519: "0xb3e0e096b02e2ec98a3441410aeddd78c95e27a0da6f411a09c631c0f2bea6e9",
    },
  ].map(createValidatorData),
  tinyChainSpec,
);

export const culprits = [
  {
    target: "0x7b0aa1735e5ba58d3236316c671fe4f00ed366ee72417c9ed02a53a8019e85b8",
    key: "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
    signature:
      "0xa6a135b2f36906be1c00cd0e48425a38cbde296a5ff73d6de6d3b0e4c26f1761adbf563961da0d3611c24ee8f5c5781647f327513912cb58f1de4bc72b5e6f01",
  },
  {
    target: "0x7b0aa1735e5ba58d3236316c671fe4f00ed366ee72417c9ed02a53a8019e85b8",
    key: "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
    signature:
      "0x940439909168820e32e5788b293786e1e02e7377e32260a96997cb991638c8c88980d0a7a6f26c7fb9bb81282129fdaa09c87932db02cbfd9955dc1940b90a03",
  },
].map(createCulprit);

export const verdicts = [
  {
    target: "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
    age: 0,
    votes: [
      {
        vote: true,
        index: 0,
        signature:
```
