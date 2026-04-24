---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/373'
title: Publish typeberry "binary"
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-12T15:43:45.000Z'
last_modified: '2025-05-12T15:43:45.000Z'
content_kind: issue
---

# Publish typeberry "binary"

## Issue by @tomusdrw

We should prepare a simple "binary" of typeberry that could be used for cross-implementation testing.

My idea for this would be to build a single JS file, with all dependencies baked in. The only required runtime dependency would be `node` and it wouldn't require any installation step.

The build step should also produce a sourcemap file so that we convert stack traces into readable/addressable format. Source map will most likely not be published.

This JS file could be published to `npmjs.com` but also under our github pages. The file name should include version from `package.json` and the commit hash.

Most likely some sort of `ts` compilation + rollup. We target `bin/jam/index.ts` CLI.
