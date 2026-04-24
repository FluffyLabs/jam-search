---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/116'
title: Scaffold new services via npm once packages are published
site: github.com/tomusdrw/as-lan
created_at: '2026-04-23T20:36:13.000Z'
last_modified: '2026-04-23T20:36:13.000Z'
content_kind: issue
---

# Scaffold new services via npm once packages are published

## Issue by @tomusdrw

## Context

Once `@fluffylabs/as-lan` and `@fluffylabs/as-lan-ecalli-mocks` are published to npm (tracked in #114), the current scaffold path becomes stale.

Today `scripts/start.sh` and `docs/src/getting-started.md` steer new users toward a git-submodule clone of the whole repo, with the SDK consumed via `file:./sdk`. This was the only option before npm publishing; after release it is no longer the simplest path for consumers.

## Proposal

Replace (or offer as the primary option) an npm-based scaffold:

- Generated `package.json` uses registry deps:
  ```json
  "devDependencies": {
    "@fluffylabs/as-lan": "^X.Y.Z",
    "@fluffylabs/as-lan-ecalli-mocks": "^X.Y.Z",
    "assemblyscript": "^0.28.15"
  }
  ```
- `ecalli` alias no longer needed — imports become `import ... from "@fluffylabs/as-lan-ecalli-mocks"` (or keep the alias via `"ecalli": "npm:@fluffylabs/as-lan-ecalli-mocks"` to avoid churn in template assembly code).
- `pvm-adapter.wat` referenced from `node_modules/@fluffylabs/as-lan/pvm-adapter.wat` instead of the repo-root copy.
- `asconfig.json` / tsconfig paths adjusted for the `node_modules` layout.

## Scope

- `scripts/start.sh` — rewrite the sed patches and stop assuming the repo-as-submodule.
- `docs/src/getting-started.md` — update the quick-start prose and project-tree diagram.
- Decide whether the submodule path stays as a secondary "contributing to the SDK" option or is removed entirely.
- Possibly migrate in-repo examples to the same npm-style deps for dogfooding — or leave them on `file:` so local SDK changes remain live-edited.

## Dependencies

- Blocked on the first successful npm publish (PR #114).
- Should land in the same release cycle as the first publish so docs are accurate the moment packages are live.


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#49 - Refactor SDK & services [merged]
tomusdrw/as-lan#50 - Bump biome [merged]
tomusdrw/as-lan#73 - HostCall testing service [merged]
tomusdrw/as-lan#111 - chore: bump wasm-pvm-cli to 0.8.0 [merged]
tomusdrw/as-lan#112 - docs: refresh quick start and fix scaffold script [merged]
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
