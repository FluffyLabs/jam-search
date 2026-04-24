---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/340'
title: Blockchain commit publisher log ends at Sep 23 2024
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-22T10:11:18.000Z'
last_modified: '2025-04-22T10:11:18.000Z'
content_kind: issue
---

# Blockchain commit publisher log ends at Sep 23 2024

## Issue by @skoszuta

Take a look at the blockchain logger. It looks like passing the log between workflow runs doesn't work correctly.

https://github.com/FluffyLabs/typeberry/actions/runs/14587444878/job/40915396373

`Previous log not found. Starting a new one.`


## Comment by @DrEverr

Problem started exactly between
`2024-09-23 12:30:18 (UTC)`
and
`2024-09-23 18:18:54 (UTC)`
