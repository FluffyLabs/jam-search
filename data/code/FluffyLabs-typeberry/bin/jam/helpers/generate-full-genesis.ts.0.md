---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/helpers/generate-full-genesis.ts#L1-L104
title: bin/jam/helpers/generate-full-genesis.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 65cd387f7418df5307815799a0b2a242557c3755b1569838a15c9d9d413e85c5
language: typescript
---
`bin/jam/helpers/generate-full-genesis.ts` (lines 1–104)

```typescript
#!/usr/bin/env tsx
// biome-ignore-all lint/suspicious/noConsole: bin file

// Generate a "full"-flavor dev config JSON with 1023 trivial-seed validators.
// Output goes to stdout; redirect to e.g. packages/configs/typeberry-dev-full.json
// then run with:
//   npm start -- --config packages/configs/typeberry-dev-full.json dev all --fast-forward

import {
  Block,
  DisputesExtrinsic,
  Extrinsic,
  Header,
  reencodeAsView,
  tryAsPerEpochBlock,
  tryAsPerValidator,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { asKnownSize } from "@typeberry/collections";
import { fullChainSpec } from "@typeberry/config";
import { BLS_KEY_BYTES, initWasm } from "@typeberry/crypto";
import {
  deriveBandersnatchPublicKey,
  deriveBandersnatchSecretKey,
  deriveEd25519PublicKey,
  deriveEd25519SecretKey,
  trivialSeed,
} from "@typeberry/crypto/key-derivation.js";
import { Blake2b } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import bandersnatchVrf from "@typeberry/safrole/bandersnatch-vrf.js";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { InMemoryState, SafroleSealingKeysData, VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";
import { StateEntries } from "@typeberry/state-merkleization";
import { TransitionHasher } from "@typeberry/transition";
import { asOpaqueType } from "@typeberry/utils";

async function main() {
  await initWasm();
  const blake2b = await Blake2b.createHasher();
  const bandersnatch = await BandernsatchWasm.new();
  const spec = fullChainSpec;
  const n = spec.validatorsCount;

  console.error(`Deriving ${n} validator keys...`);
  const validators: ValidatorData[] = [];
  for (let i = 0; i < n; i++) {
    const seed = trivialSeed(tryAsU32(i));
    const bandersnatchSecret = deriveBandersnatchSecretKey(seed, blake2b);
    const ed25519Secret = deriveEd25519SecretKey(seed, blake2b);
    const bandersnatchPub = deriveBandersnatchPublicKey(bandersnatchSecret);
    const ed25519Pub = await deriveEd25519PublicKey(ed25519Secret);
    validators.push(
      ValidatorData.create({
        bandersnatch: bandersnatchPub,
        ed25519: ed25519Pub,
        bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
        metadata: Bytes.zero(VALIDATOR_META_BYTES).asOpaque(),
      }),
    );
    if ((i + 1) % 100 === 0) {
      console.error(`  ${i + 1}/${n}`);
    }
  }

  console.error("Computing ring commitment...");
  const ringRootResult = await bandersnatchVrf.getRingCommitment(
    bandersnatch,
    validators.map((v) => v.bandersnatch),
  );
  if (ringRootResult.isError) {
    throw new Error(`Failed to compute ring commitment: ${ringRootResult.error}`);
  }
  const epochRoot = ringRootResult.ok;

  console.error("Building genesis state...");
  const state = InMemoryState.empty(spec);
  const perValidator = tryAsPerValidator(validators, spec);
  state.designatedValidatorData = perValidator;
  state.nextValidatorData = perValidator;
  state.currentValidatorData = perValidator;
  state.previousValidatorData = perValidator;
  state.epochRoot = epochRoot;
  // Fallback sealing keys: cycle bandersnatch keys across epoch slots. The first
  // epoch transition will recompute this via safrole; we only need a valid
  // SafroleSealingKeysData here so the genesis state encodes successfully.
  state.sealingKeySeries = SafroleSealingKeysData.keys(
    tryAsPerEpochBlock(
      Array.from({ length: spec.epochLength }, (_, i) => validators[i % n].bandersnatch),
      spec,
    ),
  );

  console.error("Serialising state entries...");
  const stateEntries = StateEntries.serializeInMemory(spec, blake2b, state);
  const stateRoot = stateEntries.getRootHash(blake2b);
  console.error(`Genesis state root: ${stateRoot}`);

  console.error("Building genesis header...");
  const hasher = await TransitionHasher.create();
  const extrinsic = Extrinsic.create({
```
