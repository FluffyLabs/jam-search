---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/207'
title: 'Tracer interface: add program() and generic prelude memwrite support'
site: github.com/tomusdrw/anan-as
created_at: '2026-03-20T20:18:11.000Z'
last_modified: '2026-03-20T20:18:11.000Z'
content_kind: issue
---

# Tracer interface: add program() and generic prelude memwrite support

## Issue by @tomusdrw

## Context

The `Tracer` interface in `bin/src/tracer.ts` produces trace output following the [ecalli trace JIP spec](https://github.com/FluffyLabs/jam-ecalli-trace/blob/main/ecalli-trace-jip.md). However, the interface is missing capabilities to produce a *complete* replayable trace:

1. **No `program()` method** — the `program 0x...` prelude line is not output by the tracer during replay
2. **`spiArgs()` is SPI-specific** — the spec uses generic `memwrite` for all prelude memory writes, but the tracer only supports a single SPI-specific memwrite. For non-SPI traces, initial memwrites are not output at all.

## Proposed changes

- Add a `program(data: Uint8Array): void` method to the `Tracer` interface
- Replace `spiArgs(address: number, data: number[])` with a generic `preludeMemwrite(address: number, data: Uint8Array)` method (or add it alongside `spiArgs` for backwards compatibility)
- Update `trace-replay.ts` to output the full prelude (program + all initial memwrites) via the tracer
- Ensure the replay output is a complete, self-contained trace that can itself be replayed

## Notes

This is a refactoring of the tracer interface, not a correctness bug. The current output is parseable but incomplete — it can't be round-tripped as a standalone trace file.


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/anan-as#78 - Decode standard program [merged]
tomusdrw/anan-as#157 - refactor cli [merged]
tomusdrw/anan-as#166 - Handle log host call in ananas CLI [merged]
tomusdrw/anan-as#169 - Avoid pre-allocating too much memory. [merged]
tomusdrw/anan-as#185 - Per block gas accounting [merged]
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


## Comment by @tomusdrw

Implemented: added `program()` method to Tracer interface, replaced SPI-specific `spiArgs()` with generic `memwrite()` calls for all initial memory writes, and fixed prelude output order to match the spec (program → memwrites → start).
