---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/tickets-message.ts#L1-L22
title: packages/workers/comms-authorship-network/tickets-message.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: db8f4d5bb7fa9e8cf5b393f0141e4777183326df804201cd03bea71a052bc635
language: typescript
---
`packages/workers/comms-authorship-network/tickets-message.ts` (lines 1–22)

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
```
