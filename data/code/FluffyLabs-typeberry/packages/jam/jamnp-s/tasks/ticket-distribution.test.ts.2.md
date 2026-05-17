---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L221-L324
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: 06c7f0444826cdb7a173cc707a244fedb762bd50cd08d6ee79c96a2518fbc258
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 221–324)

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

    // Self receives the ticket (via onTicketReceived -> addTicket, no callback set)
    assert.strictEqual(self.receivedTickets.length, 1);

    // Self should re-distribute to peer2 (and peer1, but peer1 already has it)
    self.ticketTask.maintainDistribution();
    await tick();

    // peer2 should now have received the ticket from self
    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });

  it("should NOT redistribute ticket if validation callback returns false", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    // Validation always rejects
    self.ticketTask.setOnTicketReceived(async () => false);

    const ticket = createTestTicket(0);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    // self.addTicket was NOT called (callback returned false), so nothing to redistribute
    assert.strictEqual(self.receivedTickets.length, 0);
    self.ticketTask.maintainDistribution();
    await tick();
    assert.strictEqual(peer2.receivedTickets.length, 0);
  });

  it("should redistribute ticket if validation callback returns true", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    // Validation always accepts
    self.ticketTask.setOnTicketReceived(async () => true);

    const ticket = createTestTicket(0);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    // self.addTicket WAS called (callback returned true)
    assert.strictEqual(self.receivedTickets.length, 1);
    self.ticketTask.maintainDistribution();
    await tick();
    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });
});
```
