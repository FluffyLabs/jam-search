---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/ticket-validator.test.ts#L1-L39
title: packages/jam/ticket-pool/ticket-validator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ffc2a73c1c7b198ec53290d36d5fc59705fdd4c10f42862117b6d69e06e2b55a
language: typescript
---
`packages/jam/ticket-pool/ticket-validator.test.ts` (lines 1–39)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsEpoch } from "@typeberry/block";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes } from "@typeberry/bytes";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { AcceptTicketsValidator, DenyTicketsValidator, ValidationError } from "./ticket-validator.js";

const E1 = tryAsEpoch(1);

function makeTicket(): SignedTicket {
  return SignedTicket.create({
    attempt: tryAsTicketAttempt(0),
    signature: Bytes.zero(BANDERSNATCH_PROOF_BYTES).asOpaque(),
  });
}

describe("AcceptTicketsValidator", () => {
  it("returns ok with zero id", async () => {
    const v = new AcceptTicketsValidator();
    const res = await v.validate(E1, [makeTicket()]);
    assert.strictEqual(res.isOk, true);
    if (res.isOk) {
      assert.strictEqual(res.ok[0].id.toString(), Bytes.zero(HASH_SIZE).toString());
    }
  });
});

describe("DenyTicketsValidator", () => {
  it("returns ValidatorUnavailable", async () => {
    const v = new DenyTicketsValidator();
    const res = await v.validate(E1, [makeTicket()]);
    assert.strictEqual(res.isError, true);
    if (res.isError) {
      assert.strictEqual(res.error, ValidationError.ValidatorUnavailable);
    }
  });
});
```
