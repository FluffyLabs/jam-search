---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/61'
title: Add roundtrip encode/decode tests for SDK accumulate types
site: github.com/tomusdrw/as-lan
created_at: '2026-03-17T14:06:40.000Z'
last_modified: '2026-03-17T14:06:40.000Z'
content_kind: issue
---

# Add roundtrip encode/decode tests for SDK accumulate types

## Issue by @tomusdrw

## Context

The SDK now has encode/decode support for several accumulate-context types in `sdk/jam/accumulate-item.ts` and `sdk/jam/service.ts`:

- `WorkExecResult` (all 7 variants)
- `Operand` (with nested WorkExecResult)
- `PendingTransfer` (with 128-byte memo)
- `Response` (result + data)
- `RefineArgs` / `AccumulateArgs`

These types have both `encode(e: Encoder)` and `static decode(d: Decoder)` methods, but there are no roundtrip tests verifying that `decode(encode(x)) == x`.

## What to add

Add roundtrip tests in `sdk/test/` (alongside the existing encode/decode/roundtrip tests) that:

1. Construct each type with known values
2. Encode via `encode(e)` / `encodeTagged(e)`
3. Decode back via `decode(d)`
4. Assert all fields match

### Edge cases to cover

- `WorkExecResult` with kind=Ok (has blob) vs kind=OutOfGas..CodeOversize (empty)
- `PendingTransfer` with memo shorter than 128 bytes (should be zero-padded)
- `PendingTransfer` with memo exactly 128 bytes
- `Operand` with empty authorizationOutput
- `Response` with null data vs non-empty data
- `AccumulateArgs` / `RefineArgs` roundtrip through encode → decode

🤖 Generated with [Claude Code](https://claude.com/claude-code)


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#53 - add encoder and split ecalli methods [merged]
</details>

---
<details>
<summary>📝 Issue Planner</summary>

<sub>Check the box below or use the `@coderabbitai plan` command to generate an implementation plan and prompts that you can use with your favorite coding assistant.</sub>

- [ ] <!-- {"checkboxId": "8d4f2b9c-3e1a-4f7c-a9b2-d5e8f1c4a7b9"} --> Create Plan
</details>


---
<details>
<summary> 🧪 Issue enrichment is currently in open beta.</summary>


To disable automatic issue enrichment, add the following to your `.coderabbit.yaml`:
```yaml
issue_enrichment:
  auto_enrich:
    enabled: false
```
</details>

💬 Have feedback or questions? Drop into our [discord](https://discord.gg/coderabbit)!
