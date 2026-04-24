---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/79'
title: SPI decoder args length validation may be too permissive
site: github.com/tomusdrw/anan-as
created_at: '2025-09-30T14:23:40.000Z'
last_modified: '2025-09-30T14:23:40.000Z'
content_kind: issue
---

# SPI decoder args length validation may be too permissive

## Issue by @coderabbitai[bot]

## Context

This issue tracks a discussion raised in PR #78 about the `argsLength > DATA_LENGTH` validation check in the `decodeSpi` function in `assembly/spi.ts`.

## Problem

Currently, the decoder validates that arguments length is less than `DATA_LENGTH` (2^24 bytes):

```typescript
if (argsLength > DATA_LENGTH) {
  throw new Error("Arguments length too big");
}
```

However, `DATA_LENGTH` represents the maximum size for multiple memory segments (readonly, read-write, and stack), not just arguments. The current check may accept argument sizes that would later fail due to insufficient remaining memory after allocating other segments.

## Suggestion

The validation should ideally check against the actual remaining memory available for arguments after allocating ro, rw, and stack segments, rather than checking against the total `DATA_LENGTH` constant.

## References

- PR: https://github.com/tomusdrw/anan-as/pull/78
- Discussion: https://github.com/tomusdrw/anan-as/pull/78#discussion_r2380234704
- Reported by: @tomusdrw


## Comment by @DrEverr

@tomusdrw this value is straight from GP. https://graypaper.fluffylabs.dev/#/ab2cdbd/2d39002d3900?v=0.7.2
`B:ZI` `ZI = 2^24`
