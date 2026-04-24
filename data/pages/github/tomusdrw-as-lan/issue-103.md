---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/103'
title: 'Library example: add a library-consumer example service'
site: github.com/tomusdrw/as-lan
created_at: '2026-04-20T12:55:04.000Z'
last_modified: '2026-04-20T12:55:04.000Z'
content_kind: issue
---

# Library example: add a library-consumer example service

## Issue by @tomusdrw

## Background

The Library service (`examples/library/`, PR #102) hosts reusable verification PVM blobs as preimages, resolved by name via storage and invoked by the service's own refine as a demo. The demo path only exercises the Library's own refine invoking its own preimages — which is useful but doesn't show the cross-service pattern the Library was actually designed for.

## What's missing

A *separate* example service that:

1. Takes some payload that needs verification (e.g. an ed25519 signature + message + pubkey).
2. Fetches the Library service's mapping storage entry (via a preimage or shared hash), resolves `"lib:ed25519"` → `(hash, length)`.
3. `historicalLookup(hash)` → PVM code.
4. Spawns a `Machine`, follows the SPI calling convention documented in [`docs/src/sdk-api/refine.md`](docs/src/sdk-api/refine.md#calling-convention-for-library-style-inner-pvms), invokes, and returns the verification result.

This is the canonical \"service A uses Library service B\" shape that the Library design targets.

## Why it matters

Without this second example, anyone building on the Library has to figure out the cross-service piece themselves. It's also the first chance to exercise `Machine` end-to-end with a non-mock preimage once real ed25519 / blake2b PVM code exists.

## Dependencies / blockers

- Real PVM placeholder bytes in `examples/library/fixtures/halt.pvm` (currently empty — tests mock the Machine layer). Either a minimal halt-only PVM blob or a real verification implementation needs to land first.
- `INPUT_ADDR = 0xFEFF0000` in the SPI convention should be cross-referenced against a canonical JAM/GP reference — the consumer example will fail at `poke` time if the address is wrong (and mocks won't catch it).

## Suggested scope

- New `examples/library-consumer/` with refine + accumulate.
- Consumer's refine takes `(signature, message, pubkey)` payload, looks up `"lib:ed25519"` from the Library service's storage (service-id parameterized or hardcoded), fetches the preimage, runs the Machine, returns verification result.
- Tests mirror the existing Library tests: happy path (valid signature), bad signature, library-missing, preimage-missing.
- Small additions to `CLAUDE.md` project structure block describing the new example.

Non-goals (still): real ed25519 PVM code, sharing storage between services beyond the lookup. Those come later.
