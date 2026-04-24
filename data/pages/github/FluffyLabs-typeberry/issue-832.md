---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/832'
title: Make Header class fields readonly
site: github.com/FluffyLabs/typeberry
created_at: '2025-12-16T13:23:23.000Z'
last_modified: '2025-12-16T13:23:23.000Z'
content_kind: issue
---

# Make Header class fields readonly

## Issue by @coderabbitai[bot]

Currently, the fields in the Header class (packages/jam/block/header.ts) are mutable public properties. They should be converted to readonly fields for better type safety and immutability guarantees.

Related TODO comment: https://github.com/FluffyLabs/typeberry/pull/827/files#diff-8f6c8a5e5c5f5e5c5f5e5c5f5e5c5f5e5c5f5e5c5f5e5c5f5e5c5f5e5c5f5e

Requested by @tomusdrw in PR #827: https://github.com/FluffyLabs/typeberry/pull/827#discussion_r2623249338
