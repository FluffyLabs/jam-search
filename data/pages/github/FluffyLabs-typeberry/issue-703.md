---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/703'
title: Support exporting blocks to a single concatenated file
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-08T15:33:38.000Z'
last_modified: '2025-10-08T15:33:38.000Z'
content_kind: issue
---

# Support exporting blocks to a single concatenated file

## Issue by @coderabbitai[bot]

## Description

Currently, the block export functionality (introduced in #699) exports each block to a separate .bin file in the output directory.

This issue tracks adding support for exporting all blocks to a single concatenated file, which would make it easier to transfer blocks between nodes.

## Proposed behavior

The export command should detect the output destination type:

1. **If the destination exists and is a directory**: Export separate files (current behavior)
2. **If the destination does not exist or is a file**: Create/overwrite the file and append blocks to it

## Implementation notes

- This would require corresponding support on the import side to read concatenated blocks from a single file
- The detection logic should be added in `packages/jam/node/export.ts`

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/699
- Comment: https://github.com/FluffyLabs/typeberry/pull/699#discussion_r2414274956
- Requested by: @tomusdrw


## Comment by @tomusdrw

@skoszuta isn't that implemented already?


## Comment by @skoszuta

Resolved by #721 
