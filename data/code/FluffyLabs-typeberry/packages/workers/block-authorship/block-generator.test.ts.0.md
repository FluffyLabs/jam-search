---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/block-generator.test.ts#L1-L96
title: packages/workers/block-authorship/block-generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 973df65cae6f3baa06cd33fe3b922fb1ac27c5d9000ff50c69070923fa86b512
language: typescript
---
`packages/workers/block-authorship/block-generator.test.ts` (lines 1–96)

```typescript
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import {
  Block,
  DisputesExtrinsic,
  type EntropyHash,
  EpochMarker,
  Extrinsic,
  Header,
  type TicketsMarker,
  type TimeSlot,
  tryAsTimeSlot,
  tryAsValidatorIndex,
  type ValidatorIndex,
  ValidatorKeys,
} from "@typeberry/block";
import { SignedTicket, Ticket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  BANDERSNATCH_PROOF_BYTES,
  BANDERSNATCH_VRF_SIGNATURE_BYTES,
  BLS_KEY_BYTES,
  ED25519_KEY_BYTES,
  initWasm,
} from "@typeberry/crypto";
import { BANDERSNATCH_RING_ROOT_BYTES } from "@typeberry/crypto/bandersnatch.js";
import type { BlocksDb, StatesDb } from "@typeberry/database";
import { Blake2b, HASH_SIZE, keccak } from "@typeberry/hash";
import bandersnatchVrf from "@typeberry/safrole/bandersnatch-vrf.js";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { JAM_FALLBACK_SEAL } from "@typeberry/safrole/constants.js";
import { VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";
import { SafroleSealingKeysKind } from "@typeberry/state/safrole-data.js";
import { asOpaqueType, deepEqual, Result } from "@typeberry/utils";
import { BlockGenerator, type BlockSealInput } from "./block-generator.js";

// Test validator data - need 6 validators to match tinyChainSpec.validatorsCount
const validatorDataArray = [
  {
    bandersnatch: "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
    ed25519: "0x837ce344bc9defceb0d7de7e9e9925096768b7adb4dad932e532eb6551e0ea02",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
  {
    bandersnatch: "0x7f6190116d118d643a98878e294ccf62b509e214299931aad8ff9764181a4e33",
    ed25519: "0xb3e0e096b02e2ec98a3441410aeddd78c95e27a0da6f411a09c631c0f2bea6e9",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
  {
    bandersnatch: "0x48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3",
    ed25519: "0x5c7f34a4bd4f2d04076a8c6f9060a0c8d2c6bdd082ceb3eda7df381cb260faff",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
  {
    bandersnatch: "0x5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d",
    ed25519: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
  {
    bandersnatch: "0x3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0",
    ed25519: "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
  {
    bandersnatch: "0xaa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc",
    ed25519: "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
    bls: Bytes.zero(BLS_KEY_BYTES),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  },
].map(({ bandersnatch, bls, ed25519, metadata }) =>
  ValidatorData.create({
    bandersnatch: Bytes.parseBytes(bandersnatch, BANDERSNATCH_KEY_BYTES).asOpaque(),
    bls: bls.asOpaque(),
    ed25519: Bytes.parseBytes(ed25519, ED25519_KEY_BYTES).asOpaque(),
    metadata: metadata.asOpaque(),
  }),
);

const validators = asKnownSize(validatorDataArray);

// Expected mock values - these are returned by mocked VRF functions
const MOCK_SEAL_SIGNATURE = Bytes.fill(BANDERSNATCH_VRF_SIGNATURE_BYTES, 2);
const MOCK_STATE_ROOT = Bytes.fill(HASH_SIZE, 3);
const MOCK_PARENT_HASH = Bytes.fill(HASH_SIZE, 0xab);

// Common test inputs
const MOCK_BANDERSNATCH_SECRET = Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque();
const MOCK_SEAL_PAYLOAD = asOpaqueType(
  BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, Bytes.zero(HASH_SIZE).raw),
```
