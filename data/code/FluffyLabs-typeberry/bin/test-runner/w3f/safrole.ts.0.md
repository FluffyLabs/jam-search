---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/safrole.ts#L1-L102
title: bin/test-runner/w3f/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: 63d5d1cfc113542d672a49a0ef262a67b27ba9af6b89c29e8d7cff8ee9ac4d7f
language: typescript
---
`bin/test-runner/w3f/safrole.ts` (lines 1–102)

```typescript
import {
  type EntropyHash,
  EpochMarker,
  type EpochMarkerView,
  TicketsMarker,
  type TicketsMarkerView,
  type TimeSlot,
  tryAsPerEpochBlock,
  tryAsPerValidator,
  type ValidatorKeys,
} from "@typeberry/block";
import type { SignedTicket, Ticket, TicketsExtrinsic } from "@typeberry/block/tickets.js";
import { fromJson } from "@typeberry/block-json";
import { Bytes } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, ED25519_KEY_BYTES, type Ed25519Key } from "@typeberry/crypto";
import {
  BANDERSNATCH_PROOF_BYTES,
  BANDERSNATCH_RING_ROOT_BYTES,
  type BandersnatchRingRoot,
} from "@typeberry/crypto/bandersnatch.js";
import { Blake2b } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import { Safrole } from "@typeberry/safrole";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { type OkResult, SafroleErrorCode, type SafroleState } from "@typeberry/safrole/safrole.js";
import { ENTROPY_ENTRIES, hashComparator, type ValidatorData } from "@typeberry/state";
import { TicketsOrKeys, ticketFromJson, validatorDataFromJson } from "@typeberry/state-json";
import { copyAndUpdateState } from "@typeberry/transition/test.utils.js";
import { deepEqual, Result } from "@typeberry/utils";
import type { RunOptions } from "../common.js";

namespace safroleFromJson {
  export const ticketEnvelope: FromJson<SignedTicket> = {
    attempt: "number",
    signature: json.fromString((v) => Bytes.parseBytes(v, BANDERSNATCH_PROOF_BYTES).asOpaque()),
  };

  export const validatorKeys: FromJson<ValidatorKeys> = {
    bandersnatch: json.fromString((v) => Bytes.parseBytes(v, BANDERSNATCH_KEY_BYTES).asOpaque()),
    ed25519: json.fromString((v) => Bytes.parseBytes(v, ED25519_KEY_BYTES).asOpaque()),
  };
}

export enum TestErrorCode {
  IncorrectData = "incorrect_data",
  // Timeslot value must be strictly monotonic.
  BadSlot = "bad_slot",
  // Received a ticket while in epoch's tail.
  UnexpectedTicket = "unexpected_ticket",
  // Tickets must be sorted.
  BadTicketOrder = "bad_ticket_order",
  // Invalid ticket ring proof.
  BadTicketProof = "bad_ticket_proof",
  // Invalid ticket attempt value.
  BadTicketAttempt = "bad_ticket_attempt",
  // Found a ticket duplicate.
  DuplicateTicket = "duplicate_ticket",
}

class JsonState {
  static fromJson: FromJson<JsonState> = {
    tau: "number",
    eta: json.array(fromJson.bytes32()),
    lambda: json.array(validatorDataFromJson),
    kappa: json.array(validatorDataFromJson),
    gamma_k: json.array(validatorDataFromJson),
    iota: json.array(validatorDataFromJson),
    gamma_a: json.array(ticketFromJson),
    gamma_s: TicketsOrKeys.fromJson(),
    gamma_z: json.fromString((v) => Bytes.parseBytes(v, BANDERSNATCH_RING_ROOT_BYTES).asOpaque()),
    post_offenders: json.array(fromJson.bytes32()),
  };
  // timeslot
  tau!: TimeSlot;
  // entropy
  eta!: [EntropyHash, EntropyHash, EntropyHash, EntropyHash];
  // previous validators
  lambda!: ValidatorData[];
  // current validators
  kappa!: ValidatorData[];
  // next validators
  gamma_k!: ValidatorData[];
  // designatedValidators
  iota!: ValidatorData[];
  // Sealing-key contest ticket accumulator.
  gamma_a!: Ticket[];
  // sealing-key series of current epoch
  gamma_s!: TicketsOrKeys;
  // bandersnatch ring commitment
  gamma_z!: BandersnatchRingRoot;
  // posterior offenders sequence
  post_offenders!: Ed25519Key[];

  static toSafroleState(state: JsonState, chainSpec: ChainSpec): SafroleState {
    return {
      timeslot: state.tau,
      entropy: FixedSizeArray.new(state.eta, ENTROPY_ENTRIES),
      previousValidatorData: tryAsPerValidator(state.lambda, chainSpec),
      currentValidatorData: tryAsPerValidator(state.kappa, chainSpec),
```
