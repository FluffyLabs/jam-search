---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.ts#L1-L100
title: packages/jam/jamnp-s/tasks/ticket-distribution.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 091aaca03357973be20652ec4ed1a6cbab3e901f530a35798c45fabc44cda369
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.ts` (lines 1–100)

```typescript
import type { Epoch } from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import type { ChainSpec } from "@typeberry/config";
import { Logger } from "@typeberry/logger";
import { DenyTicketsValidator, PendingTicketPool, type TicketValidator } from "@typeberry/ticket-pool";
import { OK } from "@typeberry/utils";
import type { AuxData, Connections } from "../peers.js";
import { ce131 } from "../protocol/index.js";
import type { StreamManager } from "../stream-manager.js";

const logger = Logger.new(import.meta.filename, "net:tickets");

/** Aux data shape: tracks epoch and which ticket indices have been sent to each peer */
type TicketAuxData = {
  epoch: Epoch;
  seen: Set<number>;
};

/** Aux data to track which tickets have been sent to each peer (using indices) */
const TICKET_AUX: AuxData<TicketAuxData> = {
  id: Symbol("tickets"),
};

/**
 * Manages distribution of Safrole tickets to connected peers.
 *
 * Uses CE-132 (proxy-to-all) for direct broadcast to all peers.
 * Implements a maintain pattern similar to SyncTask: tickets are collected
 * and periodically distributed to peers that haven't received them yet.
 *
 * Incoming tickets from peers are first run through a {@link TicketValidator};
 * only validated tickets are added to the redistribution pool. The default
 * validator denies everything, so callers must wire a real one via
 * {@link setTicketValidator} before any networked ticket can be redistributed.
 */
export class TicketDistributionTask {
  static start(streamManager: StreamManager, connections: Connections, chainSpec: ChainSpec) {
    const task = new TicketDistributionTask(streamManager, connections);

    // server mode: receive tickets from peers
    streamManager.registerIncomingHandlers(
      ce131.ServerHandler.new(chainSpec, ce131.STREAM_KIND_PROXY_TO_ALL, (epochIndex, ticket) => {
        task.onTicketReceived(epochIndex, ticket);
      }),
    );

    // client mode: send tickets to peers
    streamManager.registerOutgoingHandlers(ce131.ClientHandler.new(chainSpec, ce131.STREAM_KIND_PROXY_TO_ALL));

    return task;
  }

  private readonly pool = new PendingTicketPool();
  private validator: TicketValidator = new DenyTicketsValidator();

  private constructor(
    private readonly streamManager: StreamManager,
    private readonly connections: Connections,
  ) {}

  /**
   * Should be called periodically to distribute pending tickets to connected peers.
   */
  maintainDistribution() {
    const currentEpoch = this.pool.currentEpoch;
    if (currentEpoch === null) {
      return;
    }

    const tickets = this.pool.getTickets();
    for (let ticketIdx = 0; ticketIdx < tickets.length; ticketIdx++) {
      const { epochIndex, ticket } = tickets[ticketIdx];

      // Try to send to each connected peer
      for (const peerInfo of this.connections.getConnectedPeers()) {
        this.connections.withAuxData(peerInfo.peerId, TICKET_AUX, (maybeAux) => {
          const shouldReset = maybeAux === undefined || maybeAux.epoch !== currentEpoch;
          const aux = shouldReset ? { epoch: currentEpoch, seen: new Set<number>() } : maybeAux;

          if (peerInfo.peerRef === null) {
            return aux;
          }

          // Check if we already sent this ticket to this peer
          if (aux.seen.has(ticketIdx)) {
            return aux; // Already sent
          }

          // Send the ticket - only mark as sent after successful send
          try {
            this.streamManager.withNewStream<ce131.ClientHandler<typeof ce131.STREAM_KIND_PROXY_TO_ALL>>(
              peerInfo.peerRef,
              ce131.STREAM_KIND_PROXY_TO_ALL,
              (handler, sender) => {
                logger.trace`[${peerInfo.peerId}] <-- Sending ticket for epoch ${epochIndex}`;
                handler.sendTicket(sender, epochIndex, ticket);
                return OK;
              },
            );

```
