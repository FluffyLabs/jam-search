---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/auth.ts#L1-L37
title: packages/jam/state/auth.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 7d2cd529c6dae60ebf1c4b9c93242cd77884dda469b9788b6dd3b598f4f9facf
language: typescript
---
`packages/jam/state/auth.ts` (lines 1–37)

```typescript
import { codecFixedSizeArray, codecKnownSizeArray } from "@typeberry/block/codec-utils.js";
import { O, Q } from "@typeberry/block/gp-constants.js";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { codec, type SequenceView } from "@typeberry/codec";
import type { FixedSizeArray, KnownSizeArray } from "@typeberry/collections";
import { HASH_SIZE } from "@typeberry/hash";
import { codecPerCore } from "./common.js";

/** `O`: Maximal authorization pool size. */
export const MAX_AUTH_POOL_SIZE = O;
export type MAX_AUTH_POOL_SIZE = typeof MAX_AUTH_POOL_SIZE;

/** `Q`: Size of the authorization queue. */
export const AUTHORIZATION_QUEUE_SIZE = Q;
export type AUTHORIZATION_QUEUE_SIZE = typeof AUTHORIZATION_QUEUE_SIZE;

/** A pool of authorization hashes that is filled from the queue. */
export type AuthorizationPool = KnownSizeArray<AuthorizerHash, `At most ${typeof MAX_AUTH_POOL_SIZE}`>;

/**
 * A fixed-size queue of authorization hashes used to fill up the pool.
 *
 * Can be set using `ASSIGN` host call in batches of `AUTHORIZATION_QUEUE_SIZE`.
 */
export type AuthorizationQueue = FixedSizeArray<AuthorizerHash, AUTHORIZATION_QUEUE_SIZE>;

export const authPoolsCodec = codecPerCore<AuthorizationPool, SequenceView<AuthorizerHash>>(
  codecKnownSizeArray(codec.bytes(HASH_SIZE).asOpaque<AuthorizerHash>(), {
    minLength: 0,
    maxLength: MAX_AUTH_POOL_SIZE,
    typicalLength: MAX_AUTH_POOL_SIZE,
  }),
);

export const authQueuesCodec = codecPerCore<AuthorizationQueue, SequenceView<AuthorizerHash>>(
  codecFixedSizeArray(codec.bytes(HASH_SIZE).asOpaque<AuthorizerHash>(), AUTHORIZATION_QUEUE_SIZE),
);
```
