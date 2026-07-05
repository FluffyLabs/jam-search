---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L1-L107
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 3cb1349be677db71ce07794275a2e3ceacf073d5d104feaf18a88b31d553dd86
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 1–107)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { setTimeout } from "node:timers/promises";
import { type Epoch, tryAsEpoch } from "@typeberry/block";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto";
import { Logger } from "@typeberry/logger";
import { createTestPeerPair, MockNetwork } from "@typeberry/networking/testing.js";
import { AcceptTicketsValidator, ValidationError } from "@typeberry/ticket-pool";
import { OK, Result } from "@typeberry/utils";
import { Connections } from "../peers.js";
import { StreamManager } from "../stream-manager.js";
import { TicketDistributionTask } from "./ticket-distribution.js";

const logger = Logger.new(import.meta.filename, "test:tickets");

const TEST_EPOCH = tryAsEpoch(42);
const OTHER_EPOCH = tryAsEpoch(43);

function createTestTicket(attempt: number, signatureByte = 0): SignedTicket {
  const signatureBytes = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
  // Make signature unique based on attempt and signatureByte
  signatureBytes.raw[0] = attempt;
  signatureBytes.raw[1] = signatureByte;
  return SignedTicket.create({
    attempt: tryAsTicketAttempt(attempt),
    signature: signatureBytes.asOpaque(),
  });
}

describe("TicketDistributionTask", () => {
  async function init(name: string) {
    const network = new MockNetwork(name);
    const streamManager = new StreamManager();
    const connections = Connections.new(network);

    // Track received tickets for verification
    const receivedTickets: { epochIndex: Epoch; ticket: SignedTicket }[] = [];

    // Use real TicketDistributionTask
    const ticketTask = TicketDistributionTask.start(streamManager, connections, tinyChainSpec);

    // Default validator accepts every ticket so the test asserts purely on distribution
    // behaviour. Tests that exercise the rejection path overwrite this.
    ticketTask.setTicketValidator(new AcceptTicketsValidator());

    // Intercept received tickets by wrapping onTicketReceived behavior
    // The task already adds received tickets to pending queue via addTicket,
    // so we can track them by checking the pending queue growth or by
    // hooking into the CE-131 server handler directly
    const originalAddTicket = ticketTask.addTicket.bind(ticketTask);
    ticketTask.addTicket = (epochIndex: Epoch, ticket: SignedTicket) => {
      receivedTickets.push({ epochIndex, ticket });
      originalAddTicket(epochIndex, ticket);
    };

    // Setup peer listeners for incoming streams
    network.peers.onPeerConnected((peer) => {
      peer.addOnIncomingStream((stream) => {
        streamManager.onIncomingStream(peer, stream);
        return OK;
      });
      return OK;
    });

    let connectionIdx = 0;
    const openConnection = (other: { name: string; network: MockNetwork }) => {
      const [self, peer] = createTestPeerPair(connectionIdx++, name, other.name);
      network._peers.peerConnected(peer);
      other.network._peers.peerConnected(self);
      return [self, peer] as const;
    };

    return {
      name,
      ticketTask,
      network,
      connections,
      streamManager,
      openConnection,
      receivedTickets,
    };
  }

  async function tick() {
    logger.log`tick`;
    await setTimeout(10);
  }

  it("should distribute ticket to all connected peers via maintainDistribution", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    const ticket = createTestTicket(0);
    self.ticketTask.addTicket(TEST_EPOCH, ticket);
    self.ticketTask.maintainDistribution();
    await tick();

    // Both peers should have received the ticket
    assert.strictEqual(peer1.receivedTickets.length, 1);
```
