---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/README.md#L1-L51'
title: README.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: d1a667007103c4003e25701cacd156f60881ab18a2193afd5d4c4a88a308db88
language: markdown
---
`README.md` (lines 1–51)

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

## License

MPL-2.0
```
