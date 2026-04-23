---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/106'
title: >-
  feat: define calling protocol / external ABI schema with auto-generated
  dispatcher and argument validation
site: github.com/tomusdrw/as-lan
created_at: '2026-04-20T20:17:10.000Z'
last_modified: '2026-04-20T20:17:10.000Z'
content_kind: issue
---

# feat: define calling protocol / external ABI schema with auto-generated dispatcher and argument validation

## Issue by @coderabbitai[bot]

## Summary

It should be easier to define a "calling protocol" for a JAM service — both from the **consumer side** (how a caller invokes the service) and the **provider side** (how the service registers its external ABI) — so that an optimal dispatcher with proper argument validation can be auto-generated rather than written by hand.

## Motivation

PR #102 (https://github.com/tomusdrw/as-lan/pull/102) introduces a library example service that dispatches on a tag byte and manually decodes/validates each `AdminCommand` variant in both `refine.ts` and `accumulate.ts`. The dispatch loop and codec wiring are verbose and error-prone to write by hand, and there is no shared schema that documents the calling convention for external consumers.

Raised in review comment: https://github.com/tomusdrw/as-lan/pull/102#discussion_r3113411285

## Proposed solution

Introduce a protocol/ABI definition mechanism that:

1. **Defines the calling protocol** — a schema or DSL (e.g. decorated classes, a codec descriptor, or a separate manifest) that captures the tag bytes, payload shapes, and entry points a service exposes.
2. **Registers the external ABI** — lets a service author declare its public interface in one place, usable both for documentation and for runtime validation.
3. **Auto-generates an optimal dispatcher** — derives the tag-dispatch switch, codec instantiation, error returns, and `isFinished()` / trailing-bytes checks from the schema, eliminating boilerplate in `refine` and `accumulate`.
4. **Validates arguments** — ensures that malformed payloads are rejected uniformly and consistently, without relying on each service author to remember every defensive check.

## References

- PR #102: https://github.com/tomusdrw/as-lan/pull/102
- Requested by @tomusdrw

