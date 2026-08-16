---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/verified-ticket-pool.test.ts#L1-L62
title: packages/jam/ticket-pool/verified-ticket-pool.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 13763b91dc14039ac90362d541f259b746632c001021de828791b17a5d1e0794
language: typescript
---
`packages/jam/ticket-pool/verified-ticket-pool.test.ts` (lines 1–62)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type EntropyHash, tryAsEpoch } from "@typeberry/block";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { VerifiedTicketPool } from "./verified-ticket-pool.js";

const E1 = tryAsEpoch(1);
const E2 = tryAsEpoch(2);

function makeTicket(seed: number): SignedTicket {
  const sig = Bytes.zero(BANDERSNATCH_PROOF_BYTES);
  sig.raw[0] = seed;
  return SignedTicket.create({
    attempt: tryAsTicketAttempt(0),
    signature: sig.asOpaque(),
  });
}

function makeId(byte: number): EntropyHash {
  return Bytes.fill(HASH_SIZE, byte).asOpaque();
}

describe("VerifiedTicketPool", () => {
  it("starts empty", () => {
    const pool = VerifiedTicketPool.new();
    assert.deepStrictEqual(pool.getForEpoch(E1), []);
  });

  it("adds and retrieves tickets per epoch", () => {
    const pool = VerifiedTicketPool.new();
    pool.add(E1, [{ ticket: makeTicket(1), id: makeId(0xaa) }]);
    assert.strictEqual(pool.getForEpoch(E1).length, 1);
    assert.deepStrictEqual(pool.getForEpoch(E2), []);
  });

  it("dedups by id", () => {
    const pool = VerifiedTicketPool.new();
    const id = makeId(0x01);
    pool.add(E1, [{ ticket: makeTicket(1), id }]);
    pool.add(E1, [{ ticket: makeTicket(2), id }]);
    assert.strictEqual(pool.getForEpoch(E1).length, 1);
    assert.strictEqual(pool.getForEpoch(E1)[0].ticket.signature.raw[0], 1);
  });

  it("clears previous epochs when a new epoch is added", () => {
    const pool = VerifiedTicketPool.new();
    pool.add(E1, [{ ticket: makeTicket(1), id: makeId(1) }]);
    pool.add(E2, [{ ticket: makeTicket(2), id: makeId(2) }]);
    assert.deepStrictEqual(pool.getForEpoch(E1), []);
    assert.strictEqual(pool.getForEpoch(E2).length, 1);
  });

  it("appends across multiple add() calls for the same epoch", () => {
    const pool = VerifiedTicketPool.new();
    pool.add(E1, [{ ticket: makeTicket(1), id: makeId(1) }]);
    pool.add(E1, [{ ticket: makeTicket(2), id: makeId(2) }]);
    assert.strictEqual(pool.getForEpoch(E1).length, 2);
  });
});
```
