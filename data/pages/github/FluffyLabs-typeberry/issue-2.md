---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/2'
title: Benchmarking
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-04T05:16:47.000Z'
last_modified: '2024-07-04T05:16:47.000Z'
content_kind: issue
---

# Benchmarking

## Issue by @tomusdrw

We need a set-up to introduce macro & micro-benchmarks to the code we are writing.

- [ ] micro benchmarks
- [ ] "macro" benchmarks

Micro-benchmarks should be running locally, but it also makes sense to run them periodically on the CI to make sure the results are still the same in future versions of nodejs (i.e. we make a micro-benchmark and then create an assertion that one is faster than another).

Second kind of benchmarks are ones that are more rough-grained, where we might be importing a set of say 100 blocks. These kind of benchmarks should be run on every PR (or after the PR is merged) to make sure we don't have significant performance regressions.

Proposed package.
https://www.npmjs.com/package/benny
