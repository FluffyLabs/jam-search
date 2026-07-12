---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/README.md#L108-L230'
title: README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 163539d5060ab4df03f8048961f57036d0bf0a1ba39edd3c67342db803a0a63e
language: markdown
---
`README.md` (lines 108–230)

```markdown
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
$ npm run format # format the code
$ npm run lint   # lint the code & organise imports
```

A shorthand to run all the checks and apply safe fixes all at once is:
```bash
$ npm run qa-fix
```

### Running unit tests

```bash
$ npm run test
```

Running tests from a single package:
```bash
$ npm run test -w @typeberry/trie
```

### Running benchmarks
This command will run all benchmarks from `./benchmarks/` folder

```bash
$ npm start -w @typeberry/benchmark
```

Since each benchmark file is also runnable, it's easy to run just one benchmark, e.g:
```bash
$ npm exec tsx ./benchmarks/math/mul_overflow.ts
```

### Running JSON test vectors

To run JSON test cases coming from the official
[JAM test vectors repository](https://github.com/w3f/jamtestvectors/) you need
to first check out the repository with test cases and then use `test-runner`
to execute them.

```bash
$ git clone https://github.com/w3f/jamtestvectors.git
$ npm run w3f -w @typeberry/test-runner  --  jamtestvectors/**/*.json ../jamtestvectors/erasure_coding/vectors/*
```

Since there are multiple sources of test vectors (and their versions may differ),
all relevant ones can be easily checked out from [our test vectors repository](https://github.com/FluffyLabs/test-vectors).

Obviously it's also possible to run just single test case or part of the test
cases by altering the glob pattern in the path.

#### Selecting PVM Backend

By default, test vectors are run with both PVM backends (built-in and Ananas).
You can select a specific PVM backend using the `--pvm` option:

```bash
# Run tests with built-in PVM only
$ npm run w3f-davxy:0.7.1 -w @typeberry/test-runner -- --pvm builtin

# Run tests with Ananas PVM only
$ npm run w3f-davxy:0.7.1 -w @typeberry/test-runner -- --pvm ananas

# Run tests with both PVMs (default)
$ npm run w3f-davxy:0.7.1 -w @typeberry/test-runner
```

This option is useful for debugging PVM-specific issues or running faster tests
by testing only one implementation at a time.

### Running JSON RPC E2E tests

To run JSON RPC E2E test-vectors [test-vectors](https://github.com/fluffylabs/test-vectors) 
repository needs to be checked out with ref matching our tests. Then to run tests:

```bash
$ npm run test:e2e -w @typeberry/rpc
```

### Adding a new component / package

```bash
$ npm init -w ./packages/core/mycomponent
$ npm init -w ./packages/jam/mycomponent
```

This command will automatically update the `workspaces` field in top-level `package.json`.

## Codestyle

A brief, but evolving description of our codestyle and guideliness is availabe
in [CODESTYLE](./CODESTYLE.md).

## Add Typeberry's remote notes to Gray Paper Reader

1. Open **Gray Paper Reader** and go to **Notes** > **Settings** (⚙️).<br/>
![gpr-source-notes-1](https://github.com/user-attachments/assets/945152f4-a8f1-4167-af86-9c1e41102615)
2. Click **"+ New Source"**.
![gpr-source-notes-2](https://github.com/user-attachments/assets/7356dbe3-fa05-4fcb-99c3-28cb4b9553df)
3. Set **Source Name** to **Typeberry**.
4. Paste the following in **Source URL:**
```
https://fluffylabs.dev/typeberry/links.json
```
5. Select **All Versions**.
![gpr-source-notes-3](https://github.com/user-attachments/assets/877a6494-75fd-4c0c-b531-55af6f676c89)
6. Click **OK**.
```
