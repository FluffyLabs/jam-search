---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/getting-started.md#L1-L102
title: docs/src/getting-started.md
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 50495921f8dde06986121beaa21c98fc649478d97c927d30890ad5b39f8b8844
language: markdown
---
`docs/src/getting-started.md` (lines 1–102)

```markdown
# Quick Start

## Scaffold a New Service

Create a new JAM service project with a single command:

```bash
curl -sL https://todr.me/as-lan/start.sh | bash -s my-service
cd my-service
npm run build
```

This will:

1. Create a `my-service/` directory with a git repo
2. Add the as-lan SDK as a git submodule
3. Download template files from the [fibonacci example](https://github.com/tomusdrw/as-lan/tree/main/examples/fibonacci) and patch paths
4. Run `npm install`

## What You Get

```
my-service/
├── assembly/
│   ├── index.ts          # Entry point — re-exports refine & accumulate
│   ├── fibonacci.ts      # Example service logic (fibonacci computation)
│   ├── index.test.ts     # Unit tests
│   ├── test-run.ts       # Test runner entry point
│   └── tsconfig.json     # AssemblyScript path mappings
├── bin/
│   └── test.js           # Test runner (node)
├── sdk/                  # as-lan SDK (git submodule)
│   ├── sdk-ecalli-mocks/ # Configurable ecalli stubs for testing
│   └── pvm-adapter.wat   # Adapter mapping WASM imports to PVM ecalli host calls
├── asconfig.json
└── package.json
```

The ecalli host call stubs used for testing live in `sdk/sdk-ecalli-mocks/` and are shared across all services. There is no per-service `ecalli/` directory — just a dependency in `package.json`:

```json
"ecalli": "file:./sdk/sdk-ecalli-mocks"
```

## Implement Your Service

Edit `assembly/fibonacci.ts` (rename it to match your service). You need to implement `refine` and `accumulate` functions (or `is_authorized` for an authorizer service — see the [authorizer example](https://github.com/tomusdrw/as-lan/tree/main/examples/authorizer) and the [SDK API entry point pattern](./sdk-api/authorize.md)).

Each function takes `(ptr: u32, len: u32)` raw memory arguments and returns a packed `u64` result. Create a context (`AccumulateContext` / `RefineContext`) inside the entry point to parse args and build the response. `ctx.parseArgs()` panics if the host hands back malformed data — that is a host-contract violation, not a recoverable error, so the entry point does not need to handle it.

```typescript
import { AccumulateContext, RefineContext, LogMsg } from "@fluffylabs/as-lan";

// LogMsg is a lightweight buffer-based logger that avoids pulling in
// AssemblyScript's String machinery. You can also use `Logger.create("my-service")`
// with template literals for convenience (at a ~24% WASM size cost).
const logger: LogMsg = LogMsg.create("my-service");

export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.str("accumulate, service ").u32(args.serviceId).str(" @").u32(args.slot).info();
  // TODO: implement your accumulate logic here.
  // Return an Optional<CodeHash> (null = no upgrade) via ctx.yieldHash.
  return ctx.yieldHash(null);
}

export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.str("refine, service ").u32(args.serviceId).info();
  // TODO: implement your refine logic here — for now, echo payload back.
  return args.payload.toPtrAndLen();
}
```

## Build & Test

You need [`wasm-pvm`](https://crates.io/crates/wasm-pvm-cli) installed (`cargo install wasm-pvm-cli@0.9.0`) to produce PVM binaries.

```bash
npm run build          # compile WASM (debug + release) and PVM binary
npm test               # compile test target and run tests
```

The build pipeline:
1. Compiles AssemblyScript to WASM (debug + release targets)
2. Converts the release WASM to a JAM PVM binary (`.pvm`) using `wasm-pvm`

The resulting `build/release.pvm` is the JAM SPI binary ready for deployment.

See the [Testing](./testing.md) guide for details on writing tests and configuring ecalli mocks.

## Manual Setup (without the script)

If you prefer to set things up yourself:

1. Add the SDK as a git submodule:
   ```bash
   git submodule add https://github.com/tomusdrw/as-lan.git sdk
   ```

```
