---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/710'
title: Refactor workflow files for test vectors into single matrix-based workflow
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-11T10:08:58.000Z'
last_modified: '2025-10-11T10:08:58.000Z'
content_kind: issue
---

# Refactor workflow files for test vectors into single matrix-based workflow

## Issue by @coderabbitai[bot]

## Description

Currently, we have separate workflow files for each test-vector suite and version combination. This leads to duplication and maintenance overhead.

## Current Structure

The following workflow files exist:
- `.github/workflows/vectors-jam-conformance-067.yml`
- `.github/workflows/vectors-jam-conformance-070.yml`
- `.github/workflows/vectors-jam-conformance-071.yml`
- `.github/workflows/vectors-jamduna-067.yml`
- `.github/workflows/vectors-javajam.yml`
- `.github/workflows/vectors-w3f-davxy-067.yml`
- `.github/workflows/vectors-w3f-davxy-070.yml`
- `.github/workflows/vectors-w3f-davxy-071.yml`
- `.github/workflows/vectors-w3f.yml`

## Proposed Solution

Create a single workflow file with a matrix strategy that lists all combinations of:
- `<suite-name-with-version>` (e.g., jam-conformance-071, w3f-davxy-067)
- `<gp_version>` (e.g., 0.7.1, 0.7.0, 0.6.7)

This will allow us to:
- Maintain a single workflow file instead of multiple duplicates
- Easily add new suite/version combinations
- Reduce code duplication and maintenance burden

## Context

**Related PR:** https://github.com/FluffyLabs/typeberry/pull/709
**Comment:** https://github.com/FluffyLabs/typeberry/pull/709#discussion_r2422705155
**Requested by:** @tomusdrw
