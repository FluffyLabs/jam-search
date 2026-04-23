---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/786'
title: Parallel accumulation
site: github.com/FluffyLabs/typeberry
created_at: '2025-11-17T10:18:13.000Z'
last_modified: '2025-11-17T10:18:13.000Z'
content_kind: issue
---

# Parallel accumulation

## Issue by @tomusdrw

Execute accumulation for multiple services in parallel. Make sure to measure results. We might want to have some smart heuristic to decide whether it makes sense to run the accumulation in parallel or not.

Requires:
- [x] Parallel accumulation and state-merging (already done by @mateuszsikora in #758)
- [ ] Refactor PVM instance manager:
       1. Should be it's own package instead of being in host calls
       2. the goal is to avoid depending on specific PVM implementations in all packages (they should be just using `pvm-interface`)
       3. Should probably make sure that it has enough instances at hand
       4. Consider adding Service-dedicated instances instead of fully re-usable set (i.e. we get some info about services that we should have instances ready to be executed for - that way we can already initialize them with proper service code and just await `args`).
       
 - [ ] Create PVM instance(s) that runs in a worker thread (use `@typeberry/concurrent` package)
       1. For proper parallelization PVM needs to be running in it's own thread (doesn't matter whether it's builtin or ananas).
 
