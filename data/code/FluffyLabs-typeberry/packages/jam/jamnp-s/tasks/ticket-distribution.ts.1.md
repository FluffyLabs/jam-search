---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.ts#L95-L156
title: packages/jam/jamnp-s/tasks/ticket-distribution.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 33e49527a821fb3e183a015e06defac53da7f43fd7b92bf3c0b701df9a2a4b21
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.ts` (lines 95–156)

```typescript
                logger.trace`[${peerInfo.peerId}] <-- Sending ticket for epoch ${epochIndex}`;
                handler.sendTicket(sender, epochIndex, ticket);
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
   * Add a ticket to the redistribution pool.
   * Clears pending tickets when epoch changes.
   * Deduplicates tickets based on signature.
   */
  addTicket(epochIndex: Epoch, ticket: SignedTicket) {
    this.pool.addTicket(epochIndex, ticket);
  }

  /**
   * Replace the redistribution pool for the given epoch with the supplied tickets.
   * Used when the authorship worker dumps the authoritative pool on an epoch boundary.
   */
  replacePool(epochIndex: Epoch, tickets: readonly SignedTicket[]) {
    this.pool.replace(epochIndex, tickets);
  }

  /**
   * Register the validator that decides whether tickets received from peers should be
   * accepted (and therefore redistributed). The default is {@link DenyTicketsValidator},
   * so the caller must install a real validator for any peer ticket to make it through.
   */
  setTicketValidator(validator: TicketValidator) {
    this.validator = validator;
  }

  private onTicketReceived(epochIndex: Epoch, ticket: SignedTicket) {
    logger.trace`Received ticket for epoch ${epochIndex}, attempt ${ticket.attempt}`;
    const validator = this.validator;
    // Wrap with Promise.resolve().then() so a synchronous throw inside the validator
    // funnels into the same .catch() as an async rejection.
    Promise.resolve()
      .then(() => validator.validate(epochIndex, [ticket]))
      .then((result) => {
        if (result.isOk) {
          this.addTicket(epochIndex, ticket);
        } else {
          logger.trace`Dropping ticket for epoch ${epochIndex}: ${result.error}`;
        }
      })
      .catch((error) => {
        logger.error`Error validating ticket for epoch ${epochIndex}, attempt ${ticket.attempt}: ${error}`;
      });
  }
}
```
