---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/comms-authorship-network/protocol.ts#L1-L42
title: packages/workers/comms-authorship-network/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 55310422f7958b8fcb8e45f83c0a1a16296bb4c4f3196452ecf45384e003c38d
language: typescript
---
`packages/workers/comms-authorship-network/protocol.ts` (lines 1–42)

```typescript
import { codec } from "@typeberry/codec";
import { type Api, createProtocol, type Internal } from "@typeberry/workers-api";
import { TicketsMessage } from "./tickets-message.js";

/**
 * Port name for authorship-network direct communication.
 * Used when spawning jam-network worker to pass the port for receiving tickets.
 */
export const AUTHORSHIP_NETWORK_PORT = "authorship-network";

/**
 * Protocol for direct communication between block-authorship and jam-network workers.
 *
 * This bypasses the main thread for ticket distribution, reducing latency.
 */
export const protocol = createProtocol("authorship-network", {
  // Messages from block-authorship to jam-network.
  toWorker: {
    // Newly generated own tickets; networking should add them to its redistribution pool.
    tickets: {
      request: TicketsMessage.Codec,
      response: codec.nothing,
    },
    // Authoritative pool snapshot for the given epoch; networking replaces its local
    // pool with these tickets (one-way, source of truth lives in block-authorship).
    replaceTicketPool: {
      request: TicketsMessage.Codec,
      response: codec.nothing,
    },
  },
  // Messages from jam-network to block-authorship
  // Response indicates whether all tickets in batch were valid (no per-ticket validity!)
  fromWorker: {
    receivedTickets: {
      request: TicketsMessage.Codec,
      response: codec.bool,
    },
  },
});

export type NetworkingComms = Api<typeof protocol>;
export type AuthorshipComms = Internal<typeof protocol>;
```
