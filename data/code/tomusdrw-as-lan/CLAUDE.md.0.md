---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L1-L51'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 6
content_sha: 59aaffc1f9e2b91fa7681bed15e13ad6a7416e8434f1a55855ac0eb6ba0898b0
language: markdown
---
`CLAUDE.md` (lines 1–51)

```markdown
# as-lan

AssemblyScript SDK for writing JAM (Join-Accumulate Machine) services.

## Project Structure

```text
sdk/                        AssemblyScript SDK library
  core/                     Core types: bytes, byte-buf, codec (Encoder/Decoder), crypto, mem, pack, panic, result
    crypto/blake2b.ts       Pure-AS Blake2b-256 (RFC 7693, unkeyed, 32-byte output)
  ecalli/                   Host call declarations (@external decorators)
    general/                Ecalli 0-5, 100 (gas, fetch, lookup, read, write, info, log)
    refine/                 Ecalli 6-13 (historical_lookup, export, machine, peek, poke, pages, invoke, expunge)
    accumulate/             Ecalli 14-26 (bless, assign, designate, checkpoint, new_service, upgrade, transfer, eject, query, solicit, forget, yield_result, provide)
  jam/                      JAM protocol types
    types.ts                Core type aliases (ServiceId, Slot, CodeHash, etc.) + ValidatorKey, AutoAccumulateEntry
    service.ts              Service ABI: RefineArgs, AccumulateArgs, Response + codec classes
    account-info.ts         AccountInfo (96-byte service info from ecalli 5) + AccountInfoCodec
    service-data.ts         ServiceData (info, read) + CurrentServiceData (adds write) — high-level storage wrappers
    fetcher.ts              Base Fetcher class with buffer management (constants only)
    work-package-fetcher.ts Intermediate fetcher adding typed kinds 7-13 (WorkPackage, etc.)
    work-package.ts         WorkPackage, WorkItem, WorkItemInfo, RefinementContext, ImportRef, ExtrinsicRef + codec classes
    accumulate/             Accumulate-context types, fetcher, and high-level wrappers
      item.ts               Operand, PendingTransfer, WorkExecResult, AccumulateItem + codec classes
      fetcher.ts            AccumulateFetcher (entropy, allTransfersAndOperands, oneTransferOrOperand)
      admin.ts              Admin (bless, blessDelegator, blessRegistrar, assign, designate) — privileged governance
      child-services.ts     ChildServices (newChild, ejectChild) — child service lifecycle
      self-service.ts       SelfService (upgradeCode, requestEjection) — self-management
      memo.ts               Memo — fixed 128-byte transfer memo with auto-pad/truncate
    refine/                 Refine-context fetcher and machine wrapper
      fetcher.ts            RefineFetcher (entropy, authorizerTrace, extrinsics, imports + inherits kinds 7-13)
      machine.ts            Machine (inner PVM lifecycle: create, peek, poke, pages, invoke, expunge)
      nested-pvm.ts         NestedPvm (SPI-backed inner PVM: decodes SPI blob, wires memory/registers, caller-driven invoke loop)
    authorize/              Authorize-context fetcher
      fetcher.ts            AuthorizeFetcher (inherits constants + kinds 7-13 from WorkPackageFetcher)
  test/                     Test framework (Assert, TestSuite, strBlob, unpackResult)
    test-ecalli/            Test helpers for configuring mock stubs from AS
sdk-ecalli-mocks/           JS-side mock stubs for ecalli host calls (used in tests)
  src/
    memory.ts               Shared WASM memory helpers
    general/                Mock stubs for ecalli 0-5, 100 (incl. fetch kind=14/15 for accumulate items)
    refine/                 Mock stubs for ecalli 6-13
    accumulate/             Mock stubs for ecalli 14-26
pvm-adapter.wat             WAT adapter mapping WASM imports to PVM host_call_N intrinsics
examples/
  authorizer/               Example authorizer service (is_authorized)
  fibonacci/                Example service (refine + accumulate)
  all-ecalli/               Smoke-test service invoking every ecalli (refine + accumulate + authorize)
    assembly/
      refine.ts             Refine entry point — invokes general (0-5, 100) + refine (6-13) ecallis
      accumulate.ts         Accumulate entry point — invokes general + accumulate (14-26) ecallis
```
