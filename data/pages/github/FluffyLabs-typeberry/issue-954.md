---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/954'
title: >-
  Refactor TicketDistributionTask: introduce TicketQueue/TicketPool and
  TicketValidator abstraction
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T09:37:32.000Z'
last_modified: '2026-05-15T09:37:32.000Z'
content_kind: issue
---

# Refactor TicketDistributionTask: introduce TicketQueue/TicketPool and TicketValidator abstraction

## Issue by @coderabbitai[bot]

## Summary

During review of #923, it was suggested to refactor the ticket distribution logic for better separation of concerns.

## Proposed Changes

### 1. Rename validation callback to reflect its purpose
- Rename `setOnTicketReceived` → `setTicketValidator` in `TicketDistributionTask`

### 2. Introduce a `TicketValidator` abstraction
- Create an `AcceptTicketsValidator` (or `DenyTicketsValidator`) interface/class to be used as the default, making the validation behaviour explicit and replaceable rather than relying on a nullable callback.

### 3. Split `TicketQueue`/`TicketPool` from `TicketDistributionTask`
- Extract ticket accumulation, deduplication, and async validation logic into a dedicated `TicketQueue` or `TicketPool` class.
- Keep the `TicketDistributionTask` networking layer simple — only responsible for calling `addTicket` — and delegate all async validation concerns to the queue/pool.

## Context

- Raised in: https://github.com/FluffyLabs/typeberry/pull/923#discussion_r3010536605
- Affected file: `packages/jam/jamnp-s/tasks/ticket-distribution.ts`

/cc @tomusdrw
