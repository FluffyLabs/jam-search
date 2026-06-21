---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L49-L99'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 6
content_sha: 5c499cb8dacf6a2abfa15f817c36d2c15ce413cb433e04cb408bba02f836dd47
language: markdown
---
`CLAUDE.md` (lines 49–99)

```markdown
  all-ecalli/               Smoke-test service invoking every ecalli (refine + accumulate + authorize)
    assembly/
      refine.ts             Refine entry point — invokes general (0-5, 100) + refine (6-13) ecallis
      accumulate.ts         Accumulate entry point — invokes general + accumulate (14-26) ecallis
      authorize.ts          Authorize entry point — invokes general + authorize-context fetch kinds (0, 7-13)
      index.ts              Self-authorizing dispatch: len==2 → is_authorized, else → refine
      test-data.ts          AuthQueue, AutoAccumulate, ValidatorKeys — test data classes with codecs
  ecalli-test/              Example that exercises all ecalli host calls via dispatch
    assembly/
      refine.ts             Refine entry point — dispatches general + refine ecallis
      accumulate.ts         Accumulate entry point — fetches operands/transfers via fetch(kind=15)
      authorize.ts          Authorize entry point — dispatches general ecallis via authConfig payload
      index.ts              Self-authorizing dispatch: len==2 → is_authorized, else → refine
      dispatch/             Dispatch functions grouped by ecalli category
        common.ts           Shared logger and outputLen helper
        general.ts          Ecalli 0-5, 100 dispatch
        refine.ts           Ecalli 6-13 dispatch
        accumulate.ts       Ecalli 14-26 dispatch
      refine.test.ts        Tests for general + refine ecallis (17 tests)
      accumulate.test.ts    Tests for accumulate ecallis via operand/transfer flow (14 tests)
      authorize.test.ts     Tests for general ecallis via authorize dispatch (7 tests)
      test-helpers.ts       Shared test utilities (callRefine, callAccumulate, builders)
  nested-pvm-spi/           Smoke-test: loads an embedded SPI blob (as-add.jam
                            fixture), strips the Standard-Program metadata
                            prefix, and runs it through `ctx.nestedPvmFromSpiChecked`.
                            Demonstrates the Result-returning entry path.
    fixtures/as-add.jam     Real 648-byte SPI blob from @fluffylabs/pvm-debugger.
    bin/generate-blob.mjs   Regenerates assembly/as-add-jam.ts from the fixture.
  library/                  Library service — hosts reusable PVM verification blobs
                            (ed25519, blake2b, …) as SPI-encoded preimages, resolved
                            by name via storage. Refine demo runs them through
                            `ctx.nestedPvmFromSpiChecked(...)`.
    fixtures/
      halt.pvm              Placeholder preimage bytes (real code lands later)
    assembly/
      index.ts              Exports refine + accumulate
      refine.ts             Tag dispatch (0=demo, 1=admin) + inner-PVM lifecycle
      accumulate.ts         Operand loop + admin command dispatch
      admin.ts              AdminCommand tagged union + codec (Set/Remove/Solicit/Forget/Provide)
      storage.ts            LibraryEntry + codec + "lib:<name>" key helper
      test-helpers.ts       Shared test utilities (callRefine, callAccumulate, builders)
      refine.test.ts
      accumulate.test.ts
  pastebin/                 Open-submission paste service (solicit-only preimage lifecycle, slot-bucketed TTL cleanup)
    assembly/
      refine.ts             Refine entry point — Blake2b-256 (from sdk/core/crypto) the payload, emit `hash ‖ length_LE` (36 B okBlob)
      accumulate.ts         Accumulate — idempotent insert (solicit + metadata + ring) + slot-bucket cursor cleanup
      authorize.ts          is_authorized — accepts any payload (pastebin is open to all)
      index.ts              Self-authorizing dispatch
      constants.ts          TTL_SLOTS=1000, RECENT_N=32, CLEANUP_SLOTS_PER_CALL=8 + storage key prefixes
      storage.ts            Key builders (pasteKey/recentKey/expiryKey), PasteEntry codec, writeU32LE/readU32LE
```
