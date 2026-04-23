---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/90'
title: Split sdk-api.md into separate pages
site: github.com/tomusdrw/as-lan
created_at: '2026-04-08T21:00:43.000Z'
last_modified: '2026-04-08T21:00:43.000Z'
content_kind: issue
---

# Split sdk-api.md into separate pages

## Issue by @tomusdrw

## Context

`docs/src/sdk-api.md` has grown to cover entry points, types, utilities (Logger, LogMsg, ByteBuf, Decoder, Bytes), fetchers, service data, preimages, host calls, and test utilities — all in one file. It's getting hard to navigate.

## Proposal

Split into separate mdbook pages, roughly:

- **Entry Points & Types** — calling convention, parsed args, type table
- **Fetchers** — WorkPackageFetcher, RefineFetcher, AccumulateFetcher, AuthorizeFetcher
- **Service Data** — ServiceData, CurrentServiceData
- **Preimages** — Preimages, RefinePreimages, AccumulatePreimages, PreimageStatus
- **Host Calls (ecalli)** — raw ecalli tables (general, refine, accumulate)
- **Utilities** — Logger, LogMsg, ByteBuf, Decoder, byte types

Update `SUMMARY.md` to nest these under an "SDK API" section.

🤖 Generated with [Claude Code](https://claude.com/claude-code)


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#57 - Avoid string errors in SDK [merged]
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
