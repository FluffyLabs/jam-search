---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/403'
title: Optimize storage of empty blocks.
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-28T13:26:01.000Z'
last_modified: '2025-05-28T13:26:01.000Z'
content_kind: issue
---

# Optimize storage of empty blocks.

## Issue by @tomusdrw

I'm assuming that a large portion of blocks might be empty (especially in the beginning or on testsnets, etc).

I think it would be worth to store less that for cases like that, although that might be yet to be seen.

Total savings would be at least `67 + 6 bytes = 73 bytes out of 304 bytes ~ 25%` at the expense of a little bit more storage reads (getting postStateRoot) and compute (calculating extrinsic hash).

```ts
type StoredHeader = CompactHeader | Header;
type Extrinsics = CompactExtrinsic | Extrinsic;

// we store all the non-obvious things. The rest:
// 32 - priorStateRoot - not needed can be figured out from parentHeaderHash
// 32 - extrinsicHash - not needed, can be recalculated
// 1 - epochMarker - assuming empty 
// 1 - ticketsMarker - assuming empty
// 1 - offendersMarker - assuming empty
// Saving: 67 bytes out of 297 bytes
type CompactHeader = Pick<Header, "parentHeaderHash" (32) |  "timeSlotIndex" (4) | "bandersnatchBlockAuthorIndex" (2) | "entropySource" (96) | "seal" (96)>

// we just store tickets (since that's what validators would keep adding even if there is no activity). Savings:
// 1 - preimages
// 1 - guarantees
// 1 - assurances
// 3 - disputes
// Saving: 6 bytes out of 7 bytes (worth case: assuming tickets empty)
type CompactExtrinsic = Pick<Extrinsic, "tickets" (min: 1 byte)>;
```
