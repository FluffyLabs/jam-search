---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/tickets-message.ts#L1-L41
title: packages/workers/comms-authorship-network/tickets-message.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e664495a7734f212105f86f1c733f7d8025d06cf80c3f3b6d7e58c1561aec6ab
language: typescript
---
`packages/workers/comms-authorship-network/tickets-message.ts` (lines 1–41)

```typescript
import type { Epoch } from "@typeberry/block";
import { SignedTicket } from "@typeberry/block/tickets.js";
import { type CodecRecord, codec } from "@typeberry/codec";
import { WithDebug } from "@typeberry/utils";

export class TicketsMessage extends WithDebug {
  static Codec = codec.Class(TicketsMessage, {
    epochIndex: codec.u32.asOpaque<Epoch>(),
    tickets: codec.sequenceVarLen(SignedTicket.Codec),
  });

  static create({ epochIndex, tickets }: CodecRecord<TicketsMessage>) {
    return new TicketsMessage(epochIndex, tickets);
  }

  private constructor(
    public readonly epochIndex: Epoch,
    public readonly tickets: SignedTicket[],
  ) {
    super();
  }
}

/** Single-ticket message sent from jam-network to block-authorship (one ticket per peer relay). */
export class ReceivedTicketMessage extends WithDebug {
  static Codec = codec.Class(ReceivedTicketMessage, {
    epochIndex: codec.u32.asOpaque<Epoch>(),
    ticket: SignedTicket.Codec,
  });

  static create({ epochIndex, ticket }: CodecRecord<ReceivedTicketMessage>) {
    return new ReceivedTicketMessage(epochIndex, ticket);
  }

  private constructor(
    public readonly epochIndex: Epoch,
    public readonly ticket: SignedTicket,
  ) {
    super();
  }
}
```
