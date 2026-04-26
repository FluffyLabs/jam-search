---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/README.md#L1-L67'
title: README.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f4e5c6a14263d17184ed0b6a47555a6e0f267308e5c53dce23bb84debe0fbc5b
language: markdown
---
`README.md` (lines 1–67)

```markdown
# 🦁 as-lan

AssemblyScript SDK for building [JAM](https://graypaper.com/) services.

**[Full Documentation](https://todr.me/as-lan/)**

## Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [wasm-pvm-cli](https://crates.io/crates/wasm-pvm-cli) — compiles WASM to JAM PVM binaries

  ```bash
  cargo install wasm-pvm-cli@0.8.0
  ```

## Quick Start

Scaffold a new service project with one command:

```bash
curl -sL https://todr.me/as-lan/start.sh | bash -s my-service
cd my-service
npm run build
```

This creates basic project with the SDK wired up as a git submodule. Edit `assembly/service.ts` to implement your service logic.

See the [Getting Started guide](https://todr.me/as-lan/getting-started.html) for details on what gets generated and next steps.

## Development

```bash
# Install dependencies
npm install

# Build the fibonacci example (WASM + PVM)
npm run build

# Run tests (SDK + example)
npm test

# Lint & format
npm run qa
npm run qa-fix
```

The build produces both `.wasm` and `.pvm` (PolkaVM/JAM SPI binary) files in the `build/` directory of each service. The `.pvm` file is what gets deployed to JAM.

## Releases

Published packages on npm:

- [`@fluffylabs/as-lan`](https://www.npmjs.com/package/@fluffylabs/as-lan) — the AssemblyScript SDK.
- [`@fluffylabs/as-lan-ecalli-mocks`](https://www.npmjs.com/package/@fluffylabs/as-lan-ecalli-mocks) — JS ecalli host-call mocks for testing.

Both ship from the same commit and share a version.

### Releasing a new version (maintainers)

1. In GitHub Actions, run **Release: Prepare** and enter the new version (e.g. `0.1.0`).
2. Review and merge the `release/vX.Y.Z` PR it opens.
3. Open the draft release `vX.Y.Z`, edit the auto-generated notes, and click **Publish release**.
4. The **Release: Publish** workflow runs automatically, asserts versions match, builds, tests, and publishes both packages to npm with provenance.

## License

MPL-2.0
```
