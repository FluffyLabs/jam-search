---
type: page
url: 'https://docs.jamcha.in/knowledge/testing/pvm/host-call-log'
title: host-call-log | JAM Docs
site: docs.jamcha.in
created_at: '2025-05-26T09:22:35.065Z'
last_modified: '2026-03-24T03:46:25.613Z'
---
(fetched from [here](https://github.com/polkadot-fellows/JIPs/blob/main/JIP-1.md) on 2026-02-11)

A host call for passing a debugging message from the service/authorizer to the hosting environment for logging to the node operator.

## Host-call specification [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#host-call-specification "Direct link to Host-call specification")

**Index**: 100

**Name**: `log`

**Gas usage**: 10 (same as host-call with bad index)

**Input registers**: φ7⋯+5\\varphi\_{7\\dots+5}φ7⋯+5​

- `level` = φ7\\varphi\_7φ7​
- `target` = ∅\\varnothing∅ if φ8=0∧φ9=0\\varphi\_8 = 0 \\wedge \\varphi\_9 = 0φ8​=0∧φ9​=0, otherwise μφ8⋯+φ9\\mu\_{\\varphi\_8\\dots+\\varphi\_9}μφ8​⋯+φ9​​
- `message` = μφ10⋯+φ11\\mu\_{\\varphi\_{10}\\dots+\\varphi\_{11}}μφ10​⋯+φ11​​

**Output registers**: φ7′\\varphi'\_7φ7′​

- φ7′\\varphi'\_7φ7′​ = `WHAT`. `WHAT` is always returned so that authorizer/service behaviour is the same
whether or not this JIP is implemented.

### Side-effects [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#side-effects "Direct link to Side-effects")

No side-effects if memory access is invalid.

Otherwise, express a message to user according to the user-agent.

## Suggestions & examples [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#suggestions--examples "Direct link to Suggestions & examples")

### Levels definition [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#levels-definition "Direct link to Levels definition")

- 0: User agent displays as fatal error ⛔️
- 1: User agent displays as warning ⚠️
- 2: User agent displays as important information ℹ️
- 3: User agent displays as helpful information 💁
- 4: User agent displays as pedantic information 🪡

### Display format for console logging [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#display-format-for-console-logging "Direct link to Display format for console logging")

Note that `<CORE>` is assumed to be the integer index of the core on which the PVM is executing, which may not exist (e.g. in the Accumulate logic).

Note that `<SERVICE_ID>` is assumed to be the integer index of the service for which the PVM is executing, which may not exist (e.g. in the Is-Authorized logic).

```text
<YYYY-MM-DD hh-mm-ss> <LEVEL>[@<CORE>]?[#<SERVICE_ID>]? [<TARGET>]? <MESSAGE>
```

#### Example log item [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#example-log-item "Direct link to Example log item")

```text
2025/01/01 12:10:42 DEBUG@1#42 bootstrap-refine Hello world!
```

### Format for JSON logging [​](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log\#format-for-json-logging "Direct link to Format for JSON logging")

```text
{
    "time": "<YYYY-MM-DD hh-mm-ss>",
    "level": "<LEVEL>",
    "message": "<MESSAGE>",
    "target": "<TARGET>" | null
    "service": "<SERVICE_ID>" | null
    "core": "<CORE>" | null
}
```

- [Host-call specification](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#host-call-specification)
  - [Side-effects](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#side-effects)
- [Suggestions & examples](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#suggestions--examples)
  - [Levels definition](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#levels-definition)
  - [Display format for console logging](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#display-format-for-console-logging)
  - [Format for JSON logging](https://docs.jamcha.in/knowledge/testing/pvm/host-call-log#format-for-json-logging)
