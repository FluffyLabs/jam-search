---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/877'
title: Implement RefineExternalitiesImpl
site: github.com/FluffyLabs/typeberry
created_at: '2026-01-20T11:02:12.000Z'
last_modified: '2026-01-20T11:02:12.000Z'
content_kind: issue
---

# Implement RefineExternalitiesImpl

## Issue by @coderabbitai[bot]

Follow-up task from PR #859: https://github.com/FluffyLabs/typeberry/pull/859

Machine-related work to be split into multiple PRs.

Currently, `RefineExternalitiesImpl` is a stub implementation with all methods throwing "Method not implemented." errors. This task involves implementing the actual machine-level operations including:
- [ ] Machine expunge, pages management, void/zero pages
- [ ] Memory peek/poke operations
- [ ] Machine initialization and invocation
- [ ] Segment export
- [ ] Historical lookups

Each point should be handled separately as a sub-task.

Requested by: @tomusdrw
Reference: https://github.com/FluffyLabs/typeberry/pull/859#discussion_r
