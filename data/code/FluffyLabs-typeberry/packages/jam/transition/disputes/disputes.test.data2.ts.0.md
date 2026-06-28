---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data2.ts#L1-L94
title: packages/jam/transition/disputes/disputes.test.data2.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 36b190304ed5857a532eb51dace0a01940d898d61fdd89234caa96a5040650a4
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data2.ts` (lines 1–94)

```typescript
// from progress_invalidates_avail_assignments-1.json

import { tryAsCoreIndex, tryAsPerValidator, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { RefineContext, type WorkPackageHash } from "@typeberry/block/refine-context.js";
import { WorkPackageSpec, WorkReport } from "@typeberry/block/work-report.js";
import { WorkExecResult, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU8, tryAsU16, tryAsU32 } from "@typeberry/numbers";
import { createCulprit, createFault, createValidatorData, createVerdict } from "./disputes.test.data.js";

export const currentValidatorData = tryAsPerValidator(
  [
    {
      bandersnatch: "0xff71c6c03ff88adb5ed52c9681de1629a54e702fc14729f6b50d2f0a76f185b3",
      ed25519: "0x4418fb8c85bb3985394a8c2756d3643457ce614546202a2f50b093d762499ace",
    },
    {
      bandersnatch: "0xdee6d555b82024f1ccf8a1e37e60fa60fd40b1958c4bb3006af78647950e1b91",
      ed25519: "0xad93247bd01307550ec7acd757ce6fb805fcf73db364063265b30a949e90d933",
    },
    {
      bandersnatch: "0x9326edb21e5541717fde24ec085000b28709847b8aab1ac51f84e94b37ca1b66",
      ed25519: "0xcab2b9ff25c2410fbe9b8a717abb298c716a03983c98ceb4def2087500b8e341",
    },
    {
      bandersnatch: "0x0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc",
      ed25519: "0xf30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d",
    },
    {
      bandersnatch: "0x151e5c8fe2b9d8a606966a79edd2f9e5db47e83947ce368ccba53bf6ba20a40b",
      ed25519: "0x8b8c5d436f92ecf605421e873a99ec528761eb52a88a2f9a057b3b3003e6f32a",
    },
    {
      bandersnatch: "0x2105650944fcd101621fd5bb3124c9fd191d114b7ad936c1d79d734f9f21392e",
      ed25519: "0xab0084d01534b31c1dd87c81645fd762482a90027754041ca1b56133d0466c06",
    },
  ].map(createValidatorData),
  tinyChainSpec,
);

export const previousValidatorData = tryAsPerValidator(
  [
    {
      bandersnatch: "0x9326edb21e5541717fde24ec085000b28709847b8aab1ac51f84e94b37ca1b66",
      ed25519: "0xcab2b9ff25c2410fbe9b8a717abb298c716a03983c98ceb4def2087500b8e341",
    },
    {
      bandersnatch: "0x2105650944fcd101621fd5bb3124c9fd191d114b7ad936c1d79d734f9f21392e",
      ed25519: "0xab0084d01534b31c1dd87c81645fd762482a90027754041ca1b56133d0466c06",
    },
    {
      bandersnatch: "0xff71c6c03ff88adb5ed52c9681de1629a54e702fc14729f6b50d2f0a76f185b3",
      ed25519: "0x4418fb8c85bb3985394a8c2756d3643457ce614546202a2f50b093d762499ace",
    },
    {
      bandersnatch: "0x151e5c8fe2b9d8a606966a79edd2f9e5db47e83947ce368ccba53bf6ba20a40b",
      ed25519: "0x8b8c5d436f92ecf605421e873a99ec528761eb52a88a2f9a057b3b3003e6f32a",
    },
    {
      bandersnatch: "0xdee6d555b82024f1ccf8a1e37e60fa60fd40b1958c4bb3006af78647950e1b91",
      ed25519: "0xad93247bd01307550ec7acd757ce6fb805fcf73db364063265b30a949e90d933",
    },
    {
      bandersnatch: "0x0746846d17469fb2f95ef365efcab9f4e22fa1feb53111c995376be8019981cc",
      ed25519: "0xf30aa5444688b3cab47697b37d5cac5707bb3289e986b19b17db437206931a8d",
    },
  ].map(createValidatorData),
  tinyChainSpec,
);

export const verdicts = [
  {
    target: "0x253a07e4ceacf3541a6b529c5d8089180a226d3acb9d10b9c3026cd2744a893b",
    age: 0,
    votes: [
      {
        vote: true,
        index: 0,
        signature:
          "0x0b5fdb78578af439d20ac06c8fa59a222c66e31f5d3174d3f3698951d9bd8c150a735604aa54dbf5a1d6a6b5fda4297dbbbee524592a36c504052efdb4fbcb0a",
      },
      {
        vote: true,
        index: 1,
        signature:
          "0xddcd6ca7a180fca910a5d57569d4ac464d43a072311ad9843c7440a0c11a8c0b2ac7c6c1a209479749ed427292ecc484075f5c050b6a287d756f100cb0033e0d",
      },
      {
        vote: true,
        index: 2,
        signature:
```
