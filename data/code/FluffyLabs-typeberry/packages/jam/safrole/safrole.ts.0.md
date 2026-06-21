---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole.ts#L1-L129
title: packages/jam/safrole/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 6
content_sha: 1bed4bb53959f306c3db1133758895cb2aeb09667fb0d6232cb4b394ca83d6cd
language: typescript
---
`packages/jam/safrole/safrole.ts` (lines 1–129)

```typescript
import {
  type EntropyHash,
  EpochMarker,
  type EpochMarkerView,
  type PerValidator,
  TicketsMarker,
  type TicketsMarkerView,
  type TimeSlot,
  tryAsPerEpochBlock,
  tryAsTimeSlot,
  ValidatorKeys,
} from "@typeberry/block";
import type { SignedTicket, Ticket, TicketsExtrinsic } from "@typeberry/block/tickets.js";
import { Bytes, bytesBlobComparator } from "@typeberry/bytes";
import { type Codec, Decoder, type DescriptorRecord, Encoder, type ViewOf } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray, type ImmutableSortedSet, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  type BandersnatchKey,
  type BandersnatchRingRoot,
  BLS_KEY_BYTES,
  ED25519_KEY_BYTES,
  type Ed25519Key,
} from "@typeberry/crypto";
import type { Blake2b } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU32, u32AsLeBytes } from "@typeberry/numbers";
import { type State, ValidatorData } from "@typeberry/state";
import { type SafroleSealingKeys, SafroleSealingKeysData } from "@typeberry/state/safrole-data.js";
import { asOpaqueType, OK, Result } from "@typeberry/utils";
import bandersnatchVrf from "./bandersnatch-vrf.js";
import { BandernsatchWasm } from "./bandersnatch-wasm.js";
import type { SafroleSealState } from "./safrole-seal.js";

export const logger = Logger.new(import.meta.filename, "safrole");

export const VALIDATOR_META_BYTES = 128;
export type VALIDATOR_META_BYTES = typeof VALIDATOR_META_BYTES;

const ticketComparator = (a: Ticket, b: Ticket) => bytesBlobComparator(a.id, b.id);

export type SafroleState = Pick<
  State,
  | "designatedValidatorData"
  | "timeslot"
  | "previousValidatorData"
  | "currentValidatorData"
  | "nextValidatorData"
  | "entropy"
  | "ticketsAccumulator"
  | "sealingKeySeries"
  | "epochRoot"
>;

export type SafroleStateUpdate = Pick<
  SafroleState,
  | "nextValidatorData"
  | "currentValidatorData"
  | "previousValidatorData"
  | "epochRoot"
  | "timeslot"
  | "entropy"
  | "sealingKeySeries"
  | "ticketsAccumulator"
>;

export type OkResult = {
  epochMark: EpochMarker | null;
  ticketsMark: TicketsMarker | null;
  stateUpdate: SafroleStateUpdate;
};

export type Input = {
  /** Current block time slot. */
  slot: TimeSlot;
  /** Y(H_v): a high-entropy hash yielded from bandersnatch block seal. */
  entropy: EntropyHash;
  /** Current block tickets extrinsic. */
  extrinsic: TicketsExtrinsic;
  /** Punish set from disputes */
  punishSet: ImmutableSortedSet<Ed25519Key>;
  /** Epoch marker from header */
  epochMarker: EpochMarkerView | null;
  /** Tickets marker from header */
  ticketsMarker: TicketsMarkerView | null;
};

export enum SafroleErrorCode {
  IncorrectData = 1,
  // Timeslot value must be strictly monotonic.
  BadSlot = 2,
  // Received a ticket while in epoch's tail.
  UnexpectedTicket = 3,
  // Tickets must be sorted.
  BadTicketOrder = 4,
  // Invalid ticket ring proof.
  BadTicketProof = 5,
  // Invalid ticket attempt value.
  BadTicketAttempt = 6,
  // Found a ticket duplicate.
  DuplicateTicket = 7,
  // Epoch marker missing, unexpected or invalid
  EpochMarkerInvalid = 8,
  // Tickets marker missing, unexpected or invalid
  TicketsMarkerInvalid = 9,
}

type EpochValidators = Pick<
  SafroleState,
  "nextValidatorData" | "currentValidatorData" | "previousValidatorData" | "epochRoot"
>;

export class Safrole {
  constructor(
    private readonly chainSpec: ChainSpec,
    private readonly blake2b: Blake2b,
    public readonly state: SafroleState,
    private readonly bandersnatch: Promise<BandernsatchWasm> = BandernsatchWasm.new(),
  ) {}

  /** `e' > e` */
  private isEpochChanged(timeslot: TimeSlot): boolean {
    const stateEpoch = Math.floor(this.state.timeslot / this.chainSpec.epochLength);
    const blockEpoch = Math.floor(timeslot / this.chainSpec.epochLength);
    return blockEpoch > stateEpoch;
  }

  /** `e' === e` */
```
