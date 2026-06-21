---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-131-ce-132-safrole-ticket-distribution.test.ts#L1-L45
title: >-
  packages/jam/jamnp-s/protocol/ce-131-ce-132-safrole-ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 7fcbc4656f24105cafbcb4a2661528f9afe6c2510ed5593f5bd93c0fca3397d9
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-131-ce-132-safrole-ticket-distribution.test.ts` (lines 1–45)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type Epoch, tryAsEpoch } from "@typeberry/block";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto";
import { OK } from "@typeberry/utils";
import {
  ClientHandler,
  ServerHandler,
  STREAM_KIND_GENERATOR_TO_PROXY,
} from "./ce-131-ce-132-safrole-ticket-distribution.js";
import { testClientServer } from "./test-utils.js";

const TEST_EPOCH = tryAsEpoch(1);
const TEST_TICKET = SignedTicket.create({
  attempt: tryAsTicketAttempt(0),
  signature: Bytes.zero(BANDERSNATCH_PROOF_BYTES).asOpaque(),
});

describe("CE 131 and CE 132: Safrole Ticket Distribution", () => {
  it("Client sends a ticket distribution request and the server receives it", async () => {
    const handlers = testClientServer();

    await new Promise((resolve) => {
      handlers.server.registerHandlers(
        ServerHandler.new(tinyChainSpec, STREAM_KIND_GENERATOR_TO_PROXY, (epochIndex: Epoch, ticket: SignedTicket) => {
          assert.strictEqual(epochIndex, TEST_EPOCH);
          assert.deepStrictEqual(ticket, TEST_TICKET);
          resolve(undefined);
        }),
      );
      handlers.client.registerHandlers(ClientHandler.new(tinyChainSpec, STREAM_KIND_GENERATOR_TO_PROXY));

      handlers.client.withNewStream(
        STREAM_KIND_GENERATOR_TO_PROXY,
        (handler: ClientHandler<typeof STREAM_KIND_GENERATOR_TO_PROXY>, sender) => {
          handler.sendTicket(sender, TEST_EPOCH, TEST_TICKET);
          return OK;
        },
      );
    });
  });
});
```
