---
type: page
url: 'https://docs.jamcha.in/testing/pvm-debug'
title: PVM Debugging | JAM Docs
site: docs.jamcha.in
created_at: '2026-06-09T04:23:14.704Z'
last_modified: '2026-06-09T04:23:14.704Z'
---
Tools to help test PolkaVM blobs (custom format) and JAM services (GP format).

PVM blobs:

*   [polkatool](https://github.com/paritytech/polkavm/tree/master/tools/polkatool): Must have for disassembling and inspecting blobs.
*   [fluffy labs/pvm-debugger](https://pvm.fluffylabs.dev/): Interactive online debugger.

PolkaVM blobs:

*   [JamBrains/PolkaVm-examples](https://github.com/JamBrains/polkavm-examples?tab=readme-ov-file#universal-pvm-executor): Universal PVM executor with hostcall mocking. Only good for smokescreen testing.

Host calls:

*   [JIP-1](/knowledge/testing/pvm/host-call-log): Optional host call that can be used to log messages.

JAM services:

*   CoreVM
*   CoreChains
*   CorePlay
