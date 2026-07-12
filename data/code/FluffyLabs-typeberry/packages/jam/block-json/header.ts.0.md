---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/header.ts#L1-L111
title: packages/jam/block-json/header.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 91a28ca643cd195b1f02f7f390a0df3974b438908dcfadb72935e28f73f931a4
language: typescript
---
`packages/jam/block-json/header.ts` (lines 1–111)

```typescript
import {
  type EntropyHash,
  EpochMarker,
  type ExtrinsicHash,
  Header,
  type HeaderHash,
  type PerValidator,
  type StateRootHash,
  TicketsMarker,
  type TimeSlot,
  type ValidatorIndex,
  ValidatorKeys,
} from "@typeberry/block";
import { Ticket } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import type { BandersnatchKey, Ed25519Key } from "@typeberry/crypto";
import type { BandersnatchVrfSignature } from "@typeberry/crypto/bandersnatch.js";
import { json } from "@typeberry/json-parser";
import { asOpaqueType } from "@typeberry/utils";
import { fromJson } from "./common.js";

const bandersnatchVrfSignature = json.fromString((v) => Bytes.parseBytes(v, 96).asOpaque<BandersnatchVrfSignature>());

const validatorKeysFromJson = json.object<ValidatorKeys, ValidatorKeys>(
  {
    bandersnatch: fromJson.bytes32<BandersnatchKey>(),
    ed25519: fromJson.bytes32<Ed25519Key>(),
  },
  ValidatorKeys.create,
);

type JsonEpochMarker = {
  entropy: EntropyHash;
  tickets_entropy: EntropyHash;
  validators: PerValidator<ValidatorKeys>;
};

const epochMark = json.object<JsonEpochMarker, EpochMarker>(
  {
    entropy: fromJson.bytes32(),
    tickets_entropy: fromJson.bytes32(),
    validators: json.array(validatorKeysFromJson),
  },
  (x) => EpochMarker.create({ entropy: x.entropy, ticketsEntropy: x.tickets_entropy, validators: x.validators }),
);

type JsonHeader = {
  parent: HeaderHash;
  parent_state_root: StateRootHash;
  extrinsic_hash: ExtrinsicHash;
  slot: TimeSlot;
  epoch_mark?: EpochMarker;
  tickets_mark?: Ticket[];
  offenders_mark: Ed25519Key[];
  author_index: ValidatorIndex;
  entropy_source: BandersnatchVrfSignature;
  seal: BandersnatchVrfSignature;
};

const ticket = json.object<Ticket>(
  {
    id: fromJson.bytes32(),
    attempt: fromJson.ticketAttempt,
  },
  (x) => Ticket.create({ id: x.id, attempt: x.attempt }),
);

export const headerFromJson = json.object<JsonHeader, Header>(
  {
    parent: fromJson.bytes32(),
    parent_state_root: fromJson.bytes32(),
    extrinsic_hash: fromJson.bytes32(),
    slot: "number",
    epoch_mark: json.optional(epochMark),
    tickets_mark: json.optional(json.array(ticket)),
    offenders_mark: json.array(fromJson.bytes32<Ed25519Key>()),
    author_index: "number",
    entropy_source: bandersnatchVrfSignature,
    seal: bandersnatchVrfSignature,
  },
  ({
    parent,
    parent_state_root,
    extrinsic_hash,
    slot,
    epoch_mark,
    tickets_mark,
    offenders_mark,
    author_index,
    entropy_source,
    seal,
  }) => {
    const epochMarker = epoch_mark ?? null;
    const ticketsMarker =
      tickets_mark === undefined || tickets_mark === null
        ? null
        : TicketsMarker.create({ tickets: asOpaqueType(tickets_mark) });
    return Header.create({
      parentHeaderHash: parent,
      priorStateRoot: parent_state_root,
      extrinsicHash: extrinsic_hash,
      timeSlotIndex: slot,
      epochMarker,
      ticketsMarker,
      offendersMarker: offenders_mark,
      bandersnatchBlockAuthorIndex: author_index,
      entropySource: entropy_source,
      seal,
    });
  },
);
```
