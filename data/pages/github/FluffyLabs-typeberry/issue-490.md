---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/490'
title: Separate CLI from main functionality in RPC server
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-17T12:29:49.000Z'
last_modified: '2025-07-17T12:29:49.000Z'
content_kind: issue
---

# Separate CLI from main functionality in RPC server

## Issue by @coderabbitai[bot]

## Description

There is a TODO comment in `bin/rpc/index.ts` suggesting that the RPC server should be refactored to start similar to `bin/jam` by:
- Accepting a config file to the `main` function
- Separating CLI parsing from main functionality

## Current State
The RPC server currently handles CLI argument parsing directly in the `main` function, which couples the CLI interface with the core functionality.

## Proposed Changes
- Refactor the `main` function to accept a config object instead of raw CLI arguments
- Move CLI argument parsing to a separate layer
- Align the architecture with how `bin/jam` is structured

## Context
- **File**: `bin/rpc/index.ts`
- **PR**: https://github.com/FluffyLabs/typeberry/pull/459
- **Comment**: https://github.com/FluffyLabs/typeberry/pull/459#discussion_r2213173018
- **Reported by**: @tomusdrw

## TODO Comment
```
// TODO: [MaSo] Could be starting like `bin/jam`
// from giving a config file to `main` function
// and separating cli from main funcionality
```

This appears to be an architectural improvement to improve code organization and consistency across the codebase.
