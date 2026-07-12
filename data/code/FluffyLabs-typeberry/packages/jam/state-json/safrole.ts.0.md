---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/safrole.ts#L1-L39
title: packages/jam/state-json/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7a5eddea5ea16cb266419f4b517cd221c193ce1c9cdf08f8f71d472e6d0ba458
language: typescript
---
`packages/jam/state-json/safrole.ts` (lines 1–39)

```typescript
import { tryAsPerEpochBlock } from "@typeberry/block";
import { Ticket } from "@typeberry/block/tickets.js";
import { fromJson } from "@typeberry/block-json";
import type { ChainSpec } from "@typeberry/config";
import type { BandersnatchKey } from "@typeberry/crypto";
import { type FromJson, json } from "@typeberry/json-parser";
import { type SafroleSealingKeys, SafroleSealingKeysData } from "@typeberry/state";

export const ticketFromJson: FromJson<Ticket> = json.object<Ticket>(
  {
    id: fromJson.bytes32(),
    attempt: fromJson.ticketAttempt,
  },
  Ticket.create,
);

export class TicketsOrKeys {
  static fromJson(): FromJson<TicketsOrKeys> {
    return {
      keys: json.optional<BandersnatchKey[]>(json.array(fromJson.bytes32())),
      tickets: json.optional<Ticket[]>(json.array(ticketFromJson)),
    };
  }

  keys?: BandersnatchKey[];
  tickets?: Ticket[];

  static toSafroleSealingKeys(data: TicketsOrKeys, chainSpec: ChainSpec): SafroleSealingKeys {
    if (data.keys !== undefined) {
      return SafroleSealingKeysData.keys(tryAsPerEpochBlock(data.keys, chainSpec));
    }

    if (data.tickets !== undefined) {
      return SafroleSealingKeysData.tickets(tryAsPerEpochBlock(data.tickets, chainSpec));
    }

    throw new Error("Neither tickets nor keys are defined!");
  }
}
```
