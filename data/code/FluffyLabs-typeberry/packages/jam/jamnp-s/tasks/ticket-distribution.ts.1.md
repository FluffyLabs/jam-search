---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.ts#L95-L186
title: packages/jam/jamnp-s/tasks/ticket-distribution.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 196274ac781cbb036daad92151f0fb2ac103c6d1d711cb9582f04b4f70228b16
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.ts` (lines 95–186)

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
    // Drop tickets for older epochs (can happen when a delayed validation callback completes
    // after the epoch has already advanced — accepting it would roll back currentEpoch).
    if (this.currentEpoch !== null && epochIndex < this.currentEpoch) {
      return;
    }

    // Epoch advanced — clear old tickets
    if (this.currentEpoch !== null && epochIndex > this.currentEpoch) {
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

  private onTicketReceivedCallback: ((epochIndex: Epoch, ticket: SignedTicket) => Promise<boolean>) | null = null;

  /**
   * Register a callback that validates a received ticket.
   * The ticket is only added to the redistribution pool if the callback returns `true`.
   * This prevents redistribution of invalid tickets (e.g. those with a tampered `attempt` field).
   */
  setOnTicketReceived(cb: (epochIndex: Epoch, ticket: SignedTicket) => Promise<boolean>) {
    this.onTicketReceivedCallback = cb;
  }

  private onTicketReceived(epochIndex: Epoch, ticket: SignedTicket) {
    logger.trace`Received ticket for epoch ${epochIndex}, attempt ${ticket.attempt}`;
    if (this.onTicketReceivedCallback !== null) {
      // Validate first; only redistribute if valid to avoid spreading tampered tickets.
      // Wrap with Promise.resolve().then() to catch both sync throws and async rejections.
      const cb = this.onTicketReceivedCallback;
      Promise.resolve()
        .then(() => cb(epochIndex, ticket))
        .then((isValid) => {
          if (isValid) {
            this.addTicket(epochIndex, ticket);
          } else {
            logger.warn`Dropping invalid ticket for epoch ${epochIndex} (validation failed)`;
          }
        })
        .catch((error) => {
          logger.error`Error validating ticket for epoch ${epochIndex}, attempt ${ticket.attempt}: ${error}`;
        });
    } else {
      this.addTicket(epochIndex, ticket);
    }
  }
}
```
