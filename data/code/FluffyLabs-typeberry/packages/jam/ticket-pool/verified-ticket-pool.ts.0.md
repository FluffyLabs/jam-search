---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/verified-ticket-pool.ts#L1-L54
title: packages/jam/ticket-pool/verified-ticket-pool.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0e64fdbe7a141111725a67f2a758c56ed22f966a5fd2c20e3362ca46041aa2fd
language: typescript
---
`packages/jam/ticket-pool/verified-ticket-pool.ts` (lines 1–54)

```typescript
import type { EntropyHash, Epoch } from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import { HashSet } from "@typeberry/collections/hash-set.js";

/** A ticket the validator already verified, paired with the entropy hash (ticket id). */
export type VerifiedTicket = {
  ticket: SignedTicket;
  id: EntropyHash;
};

/**
 * In-memory pool of verified tickets for the current epoch, keyed by ticket id.
 *
 * Used on the authorship side. Tickets are stored per epoch and deduplicated by their
 * computed entropy hash (so duplicates arriving via different peers / paths are coalesced
 * cheaply). The pool only ever needs to hold tickets for one epoch at a time; switching
 * to a new epoch clears everything older.
 */
export class VerifiedTicketPool {
  private readonly perEpoch = new Map<Epoch, VerifiedTicket[]>();
  private readonly idSets = new Map<Epoch, HashSet<EntropyHash>>();

  static new() {
    return new VerifiedTicketPool();
  }

  private constructor() {}

  /** Add pre-verified tickets to the pool, deduping by id. */
  add(epochIndex: Epoch, verifiedTickets: readonly VerifiedTicket[]): void {
    if (this.perEpoch.size > 0 && !this.perEpoch.has(epochIndex)) {
      this.perEpoch.clear();
      this.idSets.clear();
    }
    const existing = this.perEpoch.get(epochIndex) ?? [];
    let idSet = this.idSets.get(epochIndex) ?? null;
    if (idSet === null) {
      idSet = HashSet.new();
      this.idSets.set(epochIndex, idSet);
    }
    for (const entry of verifiedTickets) {
      if (!idSet.has(entry.id)) {
        existing.push(entry);
        idSet.insert(entry.id);
      }
    }
    this.perEpoch.set(epochIndex, existing);
  }

  /** Returns the verified tickets for the given epoch, or an empty array if none. */
  getForEpoch(epochIndex: Epoch): readonly VerifiedTicket[] {
    return this.perEpoch.get(epochIndex) ?? [];
  }
}
```
