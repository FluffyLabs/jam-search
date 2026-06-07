---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/tickets-extrinsic.ts#L1-L15
title: packages/jam/block-json/tickets-extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 017b3e4bdfdcd7eb50f78fdd1ea3bd7ac4b1ac8176418c1b24949255c8879da0
language: typescript
---
`packages/jam/block-json/tickets-extrinsic.ts` (lines 1–15)

```typescript
import { SignedTicket } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto/bandersnatch.js";
import { json } from "@typeberry/json-parser";
import { fromJson } from "./common.js";

const ticketEnvelopeFromJson = json.object<SignedTicket>(
  {
    attempt: fromJson.ticketAttempt,
    signature: json.fromString((v) => Bytes.parseBytes(v, BANDERSNATCH_PROOF_BYTES).asOpaque()),
  },
  (x) => SignedTicket.create({ attempt: x.attempt, signature: x.signature }),
);

export const ticketsExtrinsicFromJson = json.array(ticketEnvelopeFromJson);
```
