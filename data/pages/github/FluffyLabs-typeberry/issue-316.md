---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/316'
title: Block verification
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-02T11:05:29.000Z'
last_modified: '2025-04-02T11:05:29.000Z'
content_kind: issue
---

# Block verification

## Issue by @tomusdrw

Implementation of `BlockVerifier` from here: https://github.com/FluffyLabs/typeberry/pull/308/files#diff-ca708eda02b2879ad31fbb05cd107b22dec0109542f95fa6f07bece4c5925bb5R12

Example (but not exhaustive) formulas from GP:
- https://graypaper.fluffylabs.dev/#/68eaa1f/0c02010c0201?v=0.6.4 (time slot validation)
- https://graypaper.fluffylabs.dev/#/68eaa1f/0cba000cba00?v=0.6.4 (extrinsic merkle root)
- https://graypaper.fluffylabs.dev/#/68eaa1f/0c9d000c9d00?v=0.6.4 (ancestry)
- https://graypaper.fluffylabs.dev/#/68eaa1f/0c18010c1801?v=0.6.4 (state merkle root validation)
