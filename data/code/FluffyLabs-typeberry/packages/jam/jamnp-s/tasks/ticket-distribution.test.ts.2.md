---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L221-L275
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 61905548d892bd80472c6e979b7ab2d19b46ef882ffd9ab7aba010d02c9e6b90
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 221–275)

```typescript
  it("should send new tickets to newly connected peers", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    // Connect peer1 first
    self.openConnection(peer1);
    await tick();

    const ticket = createTestTicket(0);
    self.ticketTask.addTicket(TEST_EPOCH, ticket);
    self.ticketTask.maintainDistribution();
    await tick();

    // Now connect peer2 after ticket was already distributed to peer1
    self.openConnection(peer2);
    await tick();

    // Run maintainDistribution again - peer2 should get the ticket
    self.ticketTask.maintainDistribution();
    await tick();

    assert.strictEqual(peer1.receivedTickets.length, 1);
    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });

  it("should re-distribute received tickets to other peers", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    // Self connects to both peers
    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    // peer1 sends a ticket to self
    const ticket = createTestTicket(0);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    // Self receives the ticket (via onTicketReceived -> addTicket)
    assert.strictEqual(self.receivedTickets.length, 1);

    // Self should re-distribute to peer2 (and peer1, but peer1 already has it)
    self.ticketTask.maintainDistribution();
    await tick();

    // peer2 should now have received the ticket from self
    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });
});
```
