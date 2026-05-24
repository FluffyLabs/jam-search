---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/ticket-distribution.test.ts#L104-L229
title: packages/jam/jamnp-s/tasks/ticket-distribution.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 26b77fb558770ff3681e089a4b909ba5e6504b8f56568281d6fe9c530518ee16
language: typescript
---
`packages/jam/jamnp-s/tasks/ticket-distribution.test.ts` (lines 104–229)

```typescript
    assert.deepStrictEqual(peer1.receivedTickets[0].ticket, ticket);

    assert.strictEqual(peer2.receivedTickets.length, 1);
    assert.strictEqual(peer2.receivedTickets[0].epochIndex, TEST_EPOCH);
    assert.deepStrictEqual(peer2.receivedTickets[0].ticket, ticket);
  });

  it("should receive tickets from peers", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    const ticket = createTestTicket(1);
    peer1.ticketTask.addTicket(TEST_EPOCH, ticket);
    peer1.ticketTask.maintainDistribution();
    await tick();

    assert.strictEqual(self.receivedTickets.length, 1);
    assert.strictEqual(self.receivedTickets[0].epochIndex, TEST_EPOCH);
    assert.deepStrictEqual(self.receivedTickets[0].ticket, ticket);
  });

  it("should handle multiple tickets", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    const ticket0 = createTestTicket(0);
    const ticket1 = createTestTicket(1);

    self.ticketTask.addTicket(TEST_EPOCH, ticket0);
    self.ticketTask.addTicket(TEST_EPOCH, ticket1);
    self.ticketTask.maintainDistribution();
    await tick();

    assert.strictEqual(peer1.receivedTickets.length, 2);
    assert.deepStrictEqual(peer1.receivedTickets[0].ticket, ticket0);
    assert.deepStrictEqual(peer1.receivedTickets[1].ticket, ticket1);
  });

  it("should handle no connected peers gracefully", async () => {
    const self = await init("self");

    const ticket = createTestTicket(0);
    // Should not throw
    self.ticketTask.addTicket(TEST_EPOCH, ticket);
    self.ticketTask.maintainDistribution();
    await tick();
  });

  it("should deduplicate tickets with same signature", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    const ticket = createTestTicket(0);

    // Add same ticket twice
    self.ticketTask.addTicket(TEST_EPOCH, ticket);
    self.ticketTask.addTicket(TEST_EPOCH, ticket);
    self.ticketTask.maintainDistribution();
    await tick();

    // Peer should only receive it once
    assert.strictEqual(peer1.receivedTickets.length, 1);
  });

  it("should not send same ticket to same peer twice", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    const ticket = createTestTicket(0);
    self.ticketTask.addTicket(TEST_EPOCH, ticket);

    // Call maintainDistribution twice
    self.ticketTask.maintainDistribution();
    await tick();
    self.ticketTask.maintainDistribution();
    await tick();

    // Peer should only receive the ticket once (aux data tracks sent indices)
    assert.strictEqual(peer1.receivedTickets.length, 1);
  });

  it("should clear tickets when epoch changes", async () => {
    const self = await init("self");
    const peer1 = await init("peer1");

    self.openConnection(peer1);
    await tick();

    const ticket1 = createTestTicket(0);
    const ticket2 = createTestTicket(1);

    // Add ticket for first epoch
    self.ticketTask.addTicket(TEST_EPOCH, ticket1);

    // Change epoch - this should clear old tickets
    self.ticketTask.addTicket(OTHER_EPOCH, ticket2);
    self.ticketTask.maintainDistribution();
    await tick();

    // Peer should only receive the second ticket (first was cleared on epoch change)
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

```
