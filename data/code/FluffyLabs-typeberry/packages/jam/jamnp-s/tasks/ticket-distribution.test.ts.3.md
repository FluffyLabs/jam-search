---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L331-L352
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: cba8867746f6d7569d9d6514dc2f80f4d9e661604f9889d3217247dc5e25fbef
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 331–352)

```typescript
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    // Locally added tickets first
    self.ticketTask.addTicket(TEST_EPOCH, createTestTicket(0));
    self.ticketTask.addTicket(TEST_EPOCH, createTestTicket(1));

    // Pool dump replaces with a different set
    const dump = [createTestTicket(2), createTestTicket(3)];
    self.ticketTask.replacePool(TEST_EPOCH, dump);

    self.ticketTask.maintainDistribution();
    await tick();

    assert.strictEqual(peer1.receivedTickets.length, 2);
    assert.deepStrictEqual(peer1.receivedTickets[0].ticket, dump[0]);
    assert.deepStrictEqual(peer1.receivedTickets[1].ticket, dump[1]);
  });
});
```
