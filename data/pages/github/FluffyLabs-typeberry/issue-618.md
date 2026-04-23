---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/618'
title: 'Migrate internal @typeberry dependencies to workspace:* protocol'
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-14T18:52:01.000Z'
last_modified: '2025-09-14T18:52:01.000Z'
content_kind: issue
---

# Migrate internal @typeberry dependencies to workspace:* protocol

## Issue by @coderabbitai[bot]

## Background

Currently, all internal @typeberry packages use hardcoded version numbers in their package.json dependencies (e.g., "0.0.2"). This requires manual version bumps across all package.json files during releases, as seen in PR #617.

## Proposal

Migrate internal @typeberry dependencies to use the workspace protocol ("workspace:*") so that monorepo package managers (pnpm/yarn) can resolve in-repo packages automatically.

## Benefits

- Eliminates manual version bump churn during releases
- Reduces the number of files that need updating when cutting new versions
- Prevents version mismatches between internal packages
- Simplifies release automation

## Scope

Update all package.json files in the monorepo to replace hardcoded @typeberry dependency versions with "workspace:*" while leaving external dependencies unchanged.

## References

- Related PR: https://github.com/FluffyLabs/typeberry/pull/617
- Discussion: https://github.com/FluffyLabs/typeberry/pull/617#discussion_r2347270146

Requested by: @tomusdrw
