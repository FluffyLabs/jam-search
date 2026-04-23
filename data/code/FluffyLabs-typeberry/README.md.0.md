---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/README.md#L1-L121'
title: README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 80a5c7140de16b72a5b1b6cfae4ccccc7ce3baf4387098ba79b5fbc953bff722
language: markdown
---
`README.md` (lines 1–121)

```markdown
# typeberry 🫐

[![Vectors - test suites](https://github.com/FluffyLabs/typeberry/actions/workflows/vectors-test-suites.yml/badge.svg?branch=main)](https://github.com/FluffyLabs/typeberry/actions/workflows/vectors-test-suites.yml) [![E2E - @typeberry/jam](https://github.com/FluffyLabs/typeberry/actions/workflows/e2e-jam.yml/badge.svg?branch=main)](https://github.com/FluffyLabs/typeberry/actions/workflows/e2e-jam.yml) [![QA - @typeberry/rpc](https://github.com/FluffyLabs/typeberry/actions/workflows/e2e-rpc.yml/badge.svg?branch=main)](https://github.com/FluffyLabs/typeberry/actions/workflows/e2e-rpc.yml) [![Publish commits](https://github.com/FluffyLabs/typeberry/actions/workflows/prize-blockchain.yml/badge.svg?branch=main)](https://github.com/FluffyLabs/typeberry/actions/workflows/prize-blockchain.yml) [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

Typeberry is a TypeScript implementation of [JAM protocol](https://graypaper.com/) by Fluffy Labs.

**NOTE: Since we are taking part in the JAM Prize, we do not accept any external
PRs unless the contributor waives any claims to the prize and copy rights for
the submitted code. By creating the PR you accept this requirement.**

## Links

- [Documentation](https://fluffylabs.dev/typeberry)
- [Performance Charts](https://typeberry.fluffylabs.dev)

## Implementation status

Gray Paper compliance can be controlled via `GP_VERSION` environment variable.

- [x] 0.7.1
- [x] 0.7.2

JAM Prize requirements

- [x] Milestone 1
    - [x] Block import
    - [x] W3F test vectors
    - [x] JAM Conformance Fuzzer
    - [x] Performance optimisations
- [ ] Milestone 2
    - [x] Networking (partial)
    - [x] Fast PVM (ananas)
- [ ] Milestone 3
    - [ ] PVM Recompiler
- [ ] Milestone 4
- [ ] Milestone 5

## Requirements

```bash
$ node --version
v24.0.0
```

We recommend [NVM](https://github.com/nvm-sh/nvm) to install and manage different
`node` versions.

### Installing dependencies

```bash
$ npm ci
```

### Running typeberry

```bash
$ npm start
```

### Running fuzz-target

```bash
$ npm start -- fuzz-target
```

### Running with Docker

Build and run typeberry using Docker:

```bash
# Build the Docker image
$ docker build -t typeberry .

# Run with default settings
$ docker run typeberry

# Run with custom arguments
$ docker run typeberry --config /app/configs/typeberry-dev.json --node-name my-node

# Run with environment variables (e.g., for logging)
$ docker run -e JAM_LOG=trace GP_VERSION=0.7.2 typeberry

# Run with volume mounts for persistent data
$ docker run -v $(pwd)/database:/app/database typeberry
```

The Docker container uses a minimal Alpine Linux image and forwards all arguments to `npm start`.

### Running the JSON RPC

JSON-RPC does not require `typeberry` to be running, so we just need to point the binary to the correct database.

Note the DB needs to be already initialized.

```bash
$ npm start -w @typeberry/rpc 
```

### Additional tooling

- [@typeberry/convert](bin/convert/README.md) - convert common JAM formats
- [@typeberry/jam](bin/jam/README.md) - main typeberry/jam node binary
- [@typeberry/lib](bin/lib/README.md) - typeberry-as-library. All utilities exposed as ESM, browser-compatible
    library.
- [JAM search](https://github.com/fluffylabs/jam-search) - search across all public JAM-related channels
- [State Viewer](https://github.com/fluffylabs/state-viewer) - load & inspect state of test vectors
- [PVM Debugger](https://github.com/fluffylabs/pvm-debugger) - load & inspect a PVM program
- [Gray Paper Reader](https://github.com/fluffylabs/graypaper-reader) - view the Gray Paper
- [Ananas](https://github.com/tomusdrw/anan-as) - AssemblyScript PVM interpreter

### Formatting & linting

```bash
$ npm run qa
```

Formatting & linting is done by [biomejs](https://biomejs.dev/)). You can run
separate tools using commands below.
Note that all safe fixes will be applied automatically.

```bash
```
