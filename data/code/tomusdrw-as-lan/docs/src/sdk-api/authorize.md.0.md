---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/authorize.md#L1-L70
title: docs/src/sdk-api/authorize.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 23a9965f8f3dc26d3ec849680603be1fdfe98e8feeef5843b773c2e86d4eb6b8
language: markdown
---
`docs/src/sdk-api/authorize.md` (lines 1–70)

```markdown
# Authorize

Wrappers available during the `is_authorized` entry point.

## AuthorizeContext

Parses the core index from raw arguments.
It also serves as the entry point for creating all authorize-context helpers
via factory methods — **prefer `ctx.*()` over standalone `*.create()`**.

```typescript
import { AuthorizeContext } from "@fluffylabs/as-lan";

export function is_authorized(ptr: u32, len: u32): u64 {
  const ctx = AuthorizeContext.create();
  const coreIndex = ctx.parseCoreIndex(ptr, len);  // CoreIndex (u16)

  const gasLeft = ctx.remainingGas();  // i64 — ecalli 0

  const fetcher = ctx.fetcher();       // AuthorizeFetcher
  const preimages = ctx.preimages();   // Preimages (lookup only)
  const storage = ctx.serviceData();   // CurrentServiceData
  // ...
}
```

**`ctx.remainingGas()`** — return the remaining gas (ecalli 0).

**`ctx.fetcher(bufSize?)`** — create an `AuthorizeFetcher` (fetch kinds 0, 7-13).

**`ctx.preimages(bufSize?)`** — create a `Preimages` helper (lookup only — no historical or lifecycle ops).

**`ctx.serviceData(bufSize?)`** — create a `CurrentServiceData` helper for storage read/write.

## AuthorizeFetcher

Fetches context data (fetch kinds 0, 7-13): protocol constants, work package,
auth config, auth token, and work item payloads.

```typescript
const fetcher = ctx.fetcher();
const config = fetcher.authConfig();
const token = fetcher.authToken();
const wp = fetcher.workPackage();
```

## Self-authorizing dispatch

A single service can handle both `is_authorized` and `refine` by detecting the
invocation context from input length: `is_authorized` receives exactly 2 bytes
(the u16 core index per GP Appendix B), `refine` receives 10+ bytes (a full
RefineArgs encoding). The SDK exposes `isRefineArgs(len)` to centralize that
discriminant — import it from `@fluffylabs/as-lan` and wire up a tiny
`index.ts` dispatch:

```typescript
export { accumulate } from "./accumulate";

import { isRefineArgs } from "@fluffylabs/as-lan";
import { is_authorized } from "./authorize";
import { refine as refine_ } from "./refine";

export function refine(ptr: u32, len: u32): u64 {
  if (isRefineArgs(len)) return refine_(ptr, len);
  return is_authorized(ptr, len);
}
```

See `examples/all-ecalli/`, `examples/ecalli-test/`, and `examples/pastebin/`
for the full pattern in context.
```
