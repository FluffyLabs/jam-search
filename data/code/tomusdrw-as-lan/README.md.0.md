---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/README.md#L1-L100'
title: README.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 37aea4f9f6bb8e278854a81c0fed4d7a9b99c7a5046707a6d0c0eae339924c88
language: markdown
---
`README.md` (lines 1–100)

```markdown
# 🦁 as-lan

AssemblyScript SDK for building [JAM](https://graypaper.com/) services.

**[Full Documentation](https://todr.me/as-lan/)**

## Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [wasm-pvm-cli](https://crates.io/crates/wasm-pvm-cli) — compiles WASM to JAM PVM binaries

  ```bash
  cargo install wasm-pvm-cli@0.9.0
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

## Docker image (`jammin-as-lan`)

A pre-baked builder image is published to GHCR for use with [jammin]
(https://github.com/fluffylabs/jammin) or any environment that needs a
ready-to-run AssemblyScript + PVM toolchain:

```bash
docker pull ghcr.io/fluffylabs/jammin-as-lan:latest
```

The image ships with `wasm-pvm`, Node.js, and the following packages
pre-installed globally — **no `npm install` required** for a service whose
only `devDependencies` are these three:

- `@fluffylabs/as-lan`
- `@fluffylabs/as-lan-ecalli-mocks`
- `assemblyscript`

Mount your service source at `/app` and pass the build/test command:

```bash
docker run --rm -v "$(pwd):/app" ghcr.io/fluffylabs/jammin-as-lan:latest \
    npm run build
```

If your `node_modules/` directory is absent at startup, the image's
entrypoint symlinks the global install into `/app/node_modules` so `asc`
can resolve `@fluffylabs/as-lan`. If you bring your own `node_modules`
(e.g., installed on the host), it wins — the symlink is skipped.

A service that depends on additional npm packages still has to install
those itself.

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
