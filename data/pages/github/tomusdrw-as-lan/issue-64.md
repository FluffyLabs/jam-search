---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/64'
title: Add `varU32` method to `Decoder` to avoid repeated overflow-guard boilerplate
site: github.com/tomusdrw/as-lan
created_at: '2026-03-17T15:25:30.000Z'
last_modified: '2026-03-17T15:25:30.000Z'
content_kind: issue
---

# Add `varU32` method to `Decoder` to avoid repeated overflow-guard boilerplate

## Issue by @coderabbitai[bot]

## Summary

Add a `varU32()` method to the `Decoder` class (in `sdk/core/codec/decode.ts`) that decodes a variable-length u64, validates it fits within a `u32` range (`<= 0xffff_ffff`), and sets `isError` if the value overflows — returning `0` in that case.

This would replace the current pattern of manually calling `u32(d.varU64())` and then adding an explicit overflow check at every call site (e.g. in `examples/ecalli-test/assembly/dispatch/accumulate.ts` lines 23, 25, 26, 28, 49, 51, 88, 91, 92, 122, 143, 159, 175, 190, 218).

## Motivation

Multiple dispatch functions (dispatchBless, dispatchAssign, dispatchDesignate, dispatchNewService, dispatchUpgrade, dispatchTransfer, dispatchEject, dispatchQuery, dispatchSolicit, dispatchForget, dispatchYieldResult, dispatchProvide) all decode `ServiceId`/`u32` fields from a variable-length encoded u64. Without a `varU32()` helper, each site must repeat the bounds check or risk silent truncation.

## Proposed API

```ts
/** Decodes a var-length u64 and validates it fits in a u32. Sets isError if it does not. */
varU32(): u32
```

## References

- PR: https://github.com/tomusdrw/as-lan/pull/63
- Review comment: https://github.com/tomusdrw/as-lan/pull/63#discussion_r2947603621

/cc @tomusdrw
