---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/258'
title: Speed up `ed25519` verification
site: github.com/FluffyLabs/typeberry
created_at: '2025-02-03T18:04:29.000Z'
last_modified: '2025-02-03T18:04:29.000Z'
content_kind: issue
---

# Speed up `ed25519` verification

## Issue by @tomusdrw

When running `assurances/full` jam tests it seems that verifying 1023 signatures is taking around `1.4s` (I guess it will be similar/even worse in `disputes`).
```
INFO  [test-runner] Running assurances/full tests [1/1] @ /bin/test-runner/cases.ts
ed25519.verify: 1.499s
ed25519.verify: 1.434s
ed25519.verify: 1.439s
ed25519.verify: 1.443s
ed25519.verify: 1.440s
ed25519.verify: 1.436s
ed25519.verify: 0.005ms
ed25519.verify: 0.003ms
ed25519.verify: 1.439s
```
That's way to slow, so we need to figure out how to speed it up.

Ideas:
1. Try out WASM implementation.
2. Try out Rust implementation
3. Consider parallelism in both (i.e. compare passing all `1023` sigs at once and passing `128` signatures to `8` threads/workers to do it in parallel).
