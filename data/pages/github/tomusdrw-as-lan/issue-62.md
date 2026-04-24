---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/62'
title: Mock reset functions are incomplete
site: github.com/tomusdrw/as-lan
created_at: '2026-03-17T14:06:59.000Z'
last_modified: '2026-03-17T14:06:59.000Z'
content_kind: issue
---

# Mock reset functions are incomplete

## Issue by @tomusdrw

## Problem

The mock reset functions in `sdk-ecalli-mocks` don't fully reset all stateful mocks:

### `resetAccumulate()` in `sdk-ecalli-mocks/src/accumulate/index.ts`
Only calls `resetServices()`. Missing resets for:
- Preimage mocks (`query`, `solicit`, `forget`, `yield_result`, `provide`) — though currently these are stateless stubs returning constants, if they gain state in the future the reset will be missing.

### `resetFetch()` in `sdk-ecalli-mocks/src/general/fetch.ts`
Currently resets both `fetchData` and `accumulateItems` — this is correct.

### General concern
The pattern of having a per-module `reset*()` function that must be manually wired into the aggregate `resetAll()` is fragile. If a new mock gains state, the developer must remember to:
1. Add a reset function to the mock module
2. Export it from the category index
3. Call it from the category's `reset*()` function

## Suggestion

Consider adding a test that verifies `resetAll()` returns all mocks to their default state, or adopt a pattern where reset is automatic (e.g., each mock registers itself).

🤖 Generated with [Claude Code](https://claude.com/claude-code)


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#60 - add all host calls [closed]
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
