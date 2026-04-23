---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/19'
title: test runner improvements
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-18T22:06:38.000Z'
last_modified: '2024-07-18T22:06:38.000Z'
content_kind: issue
---

# test runner improvements

## Issue by @mateuszsikora

The current configuration of `node:test` is starting to be painful:
- ~~tests are executed sequentially and it takes time~~
- ~~it is impossible to run test connected with changed files~~
- ~~all test suites have their own summary (no global summary)~~
- it is impossible to re-run only failed tests 
- ~~no "watch" mode~~
- ~~unnecessary async-awaits in sync tests~~ - it is not fixed yet but I have PoC on my branch

We need to investigate whether those problems can be resolved in `node:test` and fix them (preferred solution) or replace `node:test` with something else 


## Comment by @tomusdrw

@mateuszsikora can you clarify which things still are there to be addressed after #23 landed?


## Comment by @mateuszsikora

so everything is done except `it is impossible to re-run only failed tests` but I can live with it
