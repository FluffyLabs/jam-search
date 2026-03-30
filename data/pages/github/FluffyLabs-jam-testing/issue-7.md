---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/7'
title: Standardize docker memory limit for all performance targets
site: github.com/FluffyLabs/jam-testing
created_at: '2026-03-15T12:55:25.000Z'
last_modified: '2026-03-15T12:55:25.000Z'
---

# Standardize docker memory limit for all performance targets

## Issue by @coderabbitai[bot]

## Context

This issue tracks the work to standardize docker memory limits across all performance workflow targets.

Currently, each team's `*-performance.yml` workflow can specify its own `docker_memory` value, which leads to inconsistency. The goal is to define a single, sensible default for everyone.

## Problem

- Running picofuzz 10 times in a row can cause some targets to go OOM at lower limits (e.g. 512M).
- Some targets have been setting their own values (e.g. `8192m`) based on their own fuzzing setup, rather than a shared standard.

## Proposal

- Set a fixed `docker_memory` default of `2048m` for all targets in the reusable workflow.
- Remove per-team `docker_memory` overrides.
- Teams whose targets exceed this limit should optimize their code to work within the `2048m` boundary.

## References

- PR: https://github.com/FluffyLabs/jam-testing/pull/6
- Comment: https://github.com/FluffyLabs/jam-testing/pull/6#discussion_r2936679001

/cc @tomusdrw
