---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/README.md#L1-L28'
title: benchmarks/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 74dfd392ff53d56105d5c920a4af17ec9384af2e9b7f82691a23d2652ce793ce
language: markdown
---
`benchmarks/README.md` (lines 1–28)

```markdown
# Typeberry benchmarks

To run a new benchmark just create a new directory here and add some `.ts`
files with the bechmark code.
See other files as examples.

# Running

```
$ npm start -w @typeberry/benchmark
```

The top-level `start` command of `@typeberry/benchmark` package will run all
benchmarks in this folder, and create results in `<benchmark-name>/output` directory.

# Maintaining performance

If a JSON file `<benchmark-name>/expected/<file>.json` exists, the benchmark
runner will additionally compare the results of execution with the expected
results. The format of the file is the same as the `output` JSON file.

If the exact results are not that important, and we only care about the
`fastest` case. It's possible to set `results` to a `null` value in the `expected`
file.

The summary of execution of the benchmarks is created in
`./dist/benchmarks/results.json` and `./dist/benchmarks/results.txt` files. When
benchmarks are running on Github, the latter will be posted as a comment to the PR.
```
