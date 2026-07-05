---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/CODESTYLE.md#L1-L88'
title: CODESTYLE.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 100b93e53c6602e0012ef8ef33c875544146b1303379428424eb1761ced4921c
language: markdown
---
`CODESTYLE.md` (lines 1–88)

```markdown
TODO [ToDr] This is just a stub.

## Naming conventions

1. `*.test.ts` - test files
2. `*.node.ts` - Node runtime specific files.
3. `*.web.ts` - Web Browser runtime specific files.

Files without a special convention must be compatible with both node and web
environment (aka "core" files).

## Repository structure

1. `./bin` - full-featured binaries that are core to typeberry.
2. `./packages/extensions` - optional features of the client.
3. `./packages/core` - re-usable libraries that are JAM-agnostic. May only depend
    on other `core` packages and never `jam`.
4. `./packages/jam` - self-contained parts of the typeberry implementation.
    Think: libraries, but specific to JAM. Always named `@typeberry/<name>`.
5. `./packages/workers` - parts of typeberry that run as a worker. And communicate with
    other components. Use `./packages` for their underlying logic.
6. `./packages/misc` - auxiliary, non-production utilities that don't fit anywhere else.

## NPM workspace

Since we're using NPM workspaces, each workspace (i.e. sub-project/library/package)
should have it's own set of scripts. Avoid polluting the main `package.json` with
scripts to run, instead move the script as close to the package that will be run
as possible.

Below some pre-defined scripts and their expected behaviour:
1. `test` - obligatory script to run tests from a package. Usuall the command is
    exactly the same for all of the packages.
2. `start` - optional script to execute the package. Note that it's not limited
    only to `./bin` packages.
3. `build` - if package can be built into a ESM and later potentially
    published to NPM registry that should be the command which produces the final
    JS file in `./dist` directory.

## Avoid constructor overloading

Constructor overloading can be pretty misleading. To avoid confusion about how the
object is created we should be using `static` builder methods.

The constructor can (or even must!) be there anyway, but should not have any logic,
rather should just assign a bunch of fields. It should also be private.

The rest should stay in the build methods. Naming should follow Rust convention,
with builder method names like: `Bytes.fromString` or `Bytes.withLength`, etc.

## Avoid dependencies

Any external dependencies need to be chosen carefuly to avoid supply chain attacks.
It's better to re-write just what you need than to bring in an entire package.

However be careful with building your own framework/lib. Think of the limit
of where you want your homegrown thing to get. State the limit in the
documentation or make sure to act in a review, when the class/util goes beyond
it and in such case consider bringing in an external library.

The cost of having a half-baked frankenstein is worse than bringing in a good
& estabilished library. Make sure to choose carefuly however, check the
dependencies of the library itself and prefer speed & simplicity and no to
little dependencies over functionality.

## Avoid allocations & data copying

While it's nearly impossible to avoid all allocations in TypeScript,
we might try to limit allocations of large objects
and re-use the memory as much as possible.

The goal is to avoid stop-the-world GC pauses.

Wherever possible prefer `ArrayBuffer` and it's views over regular numeric arrays.

Try to also think if some operations can be defered to a later time, especially
if you don't know if they are going to be called anyway.
 
Avoid copying large chunks of memory (i.e. `Uint8Array`s) to some other arrays.
Prefer returning subarrays from a larger allocated chunk and creating view objects.
Note there is `subarray` function that should be preferred over `slice`.

# Opaque types and naming

1. Prefer using `Opaque` types, like `U32/U16/U8` to represent fixed-size numbers.
2. Cast using `as` ONLY when there is no other option, since over time the `as`
   cast might be easily broken.
3. When you have a function that converts between one type to another use `ensure`
```
