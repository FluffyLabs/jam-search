---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/59'
title: Add tests for refine/accumulate ecalli host calls (6-26)
site: github.com/tomusdrw/as-lan
created_at: '2026-03-17T09:21:52.000Z'
last_modified: '2026-03-17T09:21:52.000Z'
content_kind: issue
---

# Add tests for refine/accumulate ecalli host calls (6-26)

## Issue by @tomusdrw

## Context

Ecalli host calls 6-26 (refine + accumulate) were added with SDK declarations, WAT adapter mappings, and mock stubs. However, they currently have **no test coverage** — only the original 7 general host calls (0-5, 100) are exercised by the ecalli-test example.

## What's needed

1. **Extend `examples/ecalli-test/assembly/service.ts`** to dispatch the new ecalli indices (the `EcalliIndex` enum already has all 27 entries)
2. **Add test cases in `examples/ecalli-test/assembly/index.test.ts`** that exercise each new host call through the dispatch mechanism
3. **Optionally add AS-side test wrappers** in `sdk/test/test-ecalli/` for host calls that benefit from configurable mock state (e.g. `TestHistoricalLookup`, `TestMachine`)

## Priority calls to test

- `historical_lookup` (6) — has configurable preimage mock, same pattern as `lookup`
- `export_` (7) and `machine` (8) — counter-based mocks, verify incrementing IDs
- `invoke` (12) and `query` (22) — use `host_call_2b`/`host_call_r8` for dual-register returns, most important to verify the `out_r8` pointer write works correctly
- `checkpoint` (17) — delegates to `gas()` mock
- `new_service` (18) — counter-based, verify incrementing service IDs

The remaining stubs (peek, poke, pages, expunge, bless, assign, designate, upgrade, transfer, eject, solicit, forget, yield_result, provide) just return OK/NONE and are lower priority.


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#52 - Compile WASM to PVM [merged]
tomusdrw/as-lan#53 - add encoder and split ecalli methods [merged]
tomusdrw/as-lan#56 - Ecalli Mocks and ecalli example service [merged]
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
