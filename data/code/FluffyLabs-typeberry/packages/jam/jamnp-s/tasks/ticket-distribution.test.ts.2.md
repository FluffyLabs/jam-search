---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L221-L338
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 4
content_sha: 7bffc77c444d2e941dd9c7437949ecf3bbf30969a988aef438bbc1ef782d02d5
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 221–338)

```typescript
    assert.strictEqual(peer1.receivedTickets.length, 1);
    assert.strictEqual(peer1.receivedTickets[0].epochIndex, OTHER_EPOCH);
    assert.deepStrictEqual(peer1.receivedTickets[0].ticket, ticket2);
  });

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

  it("should NOT redistribute ticket if validator rejects", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    // Validation always rejects
    self.ticketTask.setTicketValidator({
      validate: async () => Result.error(ValidationError.InvalidProof, () => "rejected"),
    });

    const ticket = createTestTicket(0);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    // self.addTicket was NOT called (validator rejected), so nothing to redistribute
    assert.strictEqual(self.receivedTickets.length, 0);
    self.ticketTask.maintainDistribution();
    await tick();
    assert.strictEqual(peer2.receivedTickets.length, 0);
  });

  it("should redistribute ticket if validator accepts", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");
    const peer2 = await init("peer2");

    self.openConnection(peer1);
    self.openConnection(peer2);
    await tick();

    // Default init() already wires an AcceptTicketsValidator
    const ticket = createTestTicket(0);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    // self.addTicket WAS called
    assert.strictEqual(self.receivedTickets.length, 1);
    self.ticketTask.maintainDistribution();
    await tick();
    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });

  it("replacePool overwrites the redistribution pool", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    // Locally added tickets first
    self.ticketTask.addTicket(TEST_EPOCH, createTestTicket(0));
```
