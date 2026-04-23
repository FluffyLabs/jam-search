---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/658'
title: Remove fuzzer V0
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-24T08:29:49.000Z'
last_modified: '2025-09-24T08:29:49.000Z'
content_kind: issue
---

# Remove fuzzer V0

## Issue by @tomusdrw

Remove the V0 version of the fuzzer, since it doesn't need to be supported going forward.

NOTE that the `--version` flag might stay (and only support `--version=1`), because otherwise we need to update our `jam-conformance` target: https://github.com/davxy/jam-conformance/blob/main/scripts/targets.json#L141
