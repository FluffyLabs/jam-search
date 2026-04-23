---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/72'
title: 'Run official test on CI '
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-06T16:46:52.000Z'
last_modified: '2024-08-06T16:46:52.000Z'
content_kind: issue
---

# Run official test on CI 

## Issue by @mateuszsikora

It would be nice to start running the official tests (available [here](https://github.com/w3f/jamtestvectors)) on our CI. Unfortunately most of the tests are not merged yet but I think it can be useful to have possibility to run tests from a few repositories (it will be easy to add new test suites when they appear as PRs).

AC:
- all tests are executed on CI (from the official repository and PRs that are opened there)
- it is possible to define which test suites are able to block merging a PR in our repo (for example PVM tests should block merging, but safrole shouldn't)  
