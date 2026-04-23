---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.ts#L1-L101
title: packages/jam/jamnp-s/tasks/ticket-distribution.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 6a31fdec5186ca57a660891631f331b8189efe45c15586c3f8d337828720a2b4
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.ts` (lines 1–101)

```typescript
import type { Epoch } from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import type { ChainSpec } from "@typeberry/config";
import { Logger } from "@typeberry/logger";
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

  /** Pending tickets waiting to be distributed to peers */
  private pendingTickets: Array<{ epochIndex: Epoch; ticket: SignedTicket }> = [];
  /** Current epoch being tracked (cleared when epoch changes) */
  private currentEpoch: Epoch | null = null;

  private constructor(
    private readonly streamManager: StreamManager,
    private readonly connections: Connections,
  ) {}

  /**
   * Should be called periodically to distribute pending tickets to connected peers.
   */
  maintainDistribution() {
    if (this.currentEpoch === null) {
      return; // No tickets to distribute yet
    }

    /** `this` is mutable and TS can't narrow this.currentEpoch inside the callback closure */
    const currentEpoch = this.currentEpoch;

    // Iterate through all pending tickets
    for (let ticketIdx = 0; ticketIdx < this.pendingTickets.length; ticketIdx++) {
      const { epochIndex, ticket } = this.pendingTickets[ticketIdx];

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

            // Mark as sent only after successful send, so failed sends will be retried
            aux.seen.add(ticketIdx);
          } catch (e) {
```
