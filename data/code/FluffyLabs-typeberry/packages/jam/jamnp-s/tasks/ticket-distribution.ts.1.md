---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.ts#L95-L152
title: packages/jam/jamnp-s/tasks/ticket-distribution.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a5943e784b3b190ec139eb361f6990b07154cf936f829f6b3d96e0780ba366de
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.ts` (lines 95–152)

```typescript
                return OK;
              },
            );

            // Mark as sent only after successful send, so failed sends will be retried
            aux.seen.add(ticketIdx);
          } catch (e) {
            logger.warn`[${peerInfo.peerId}] Failed to send ticket for epoch ${epochIndex}: ${e}`;
          }
          return aux;
        });
      }
    }
  }

  /**
   * Add a ticket to the pending queue for distribution.
   * Clears pending tickets when epoch changes.
   * Deduplicates tickets based on signature.
   */
  addTicket(epochIndex: Epoch, ticket: SignedTicket) {
    // Check if epoch changed - if so, clear old tickets
    if (this.currentEpoch !== null && this.currentEpoch !== epochIndex) {
      logger.log`[addTicket] Epoch changed from ${this.currentEpoch} to ${epochIndex}, clearing ${this.pendingTickets.length} old tickets`;
      this.pendingTickets = [];
      // Note: We don't need to clear aux data for all peers here.
      // The aux data contains the epoch, so maintainDistribution will lazily
      // reset it when it detects an epoch mismatch. This handles both connected
      // and disconnected peers correctly.
    }

    this.currentEpoch = epochIndex;

    /**
     * Deduplicate: check if a ticket with the same signature already exists
     *
     * Here we are risking "poisoning" the local pendingTickets - i.e:
     *  1. The adversary sees a signature and swaps the ticket attempt to something different.
     *  2. This creates an invalid ticket, but prevents a valid ticket with the same signature from being included and distributed.
     *
     * TODO [MaSi]: The poisoning risk should be fixed during implementation of ticket validation.
     */
    const isDuplicate = this.pendingTickets.some(
      (pending) => pending.epochIndex === epochIndex && pending.ticket.signature.isEqualTo(ticket.signature),
    );

    if (!isDuplicate) {
      this.pendingTickets.push({ epochIndex, ticket });
      logger.info`[addTicket] Added ticket for epoch ${epochIndex}, total: ${this.pendingTickets.length}`;
    }
  }

  private onTicketReceived(epochIndex: Epoch, ticket: SignedTicket) {
    logger.trace`Received ticket for epoch ${epochIndex}, attempt ${ticket.attempt}`;
    // Add to pending queue for potential re-distribution
    this.addTicket(epochIndex, ticket);
  }
}
```
