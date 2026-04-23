---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/418'
title: Run RPC E2E tests on CI
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-06T08:00:36.000Z'
last_modified: '2025-06-06T08:00:36.000Z'
content_kind: issue
---

# Run RPC E2E tests on CI

## Issue by @coderabbitai[bot]

## Description

Currently, RPC E2E tests exist but are not running on CI. The tests need to be updated to work with predefined data and integrated into the CI pipeline.

## Requirements

- Use `typeberry` as a library to start a new instance
- Use in-memory database or random temporary path for LMDB
- Import a bunch of blocks for testing
- Connect to the RPC server to run E2E tests
- Leverage existing tests that import blocks as a blueprint

## Current Status

The E2E test file exists at `bin/rpc/test/e2e.ts` but contains a TODO comment indicating the tests need to be updated to work with some predefined data.

## References

- PR: https://github.com/FluffyLabs/typeberry/pull/402
- Comment: https://github.com/FluffyLabs/typeberry/pull/402#discussion_r2130017745
- Requested by: @tomusdrw
