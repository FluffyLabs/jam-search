---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/461'
title: Enhance node config files
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-07T15:28:46.000Z'
last_modified: '2025-07-07T15:28:46.000Z'
content_kind: issue
---

# Enhance node config files

## Issue by @coderabbitai[bot]

## Feature Request: Configuration Extension Support
Add support for extending configurations similar to `tsconfig`, allowing configuration files to inherit from other configuration files.

Example:
```json
{
  "extends": "./typeberry-default.json",
  "chain_spec": {
     "bootnodes": []
   }
}
```

## Context
These ideas were discussed in the context of replacing CLI options with config files.

## References
- PR: https://github.com/FluffyLabs/typeberry/pull/455
- Comment: https://github.com/FluffyLabs/typeberry/pull/455#discussion_r2189931250
- Requested by: @tomusdrw
