---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/715'
title: GP 0.7.2 support
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-13T08:22:20.000Z'
last_modified: '2025-10-13T08:22:20.000Z'
content_kind: issue
---

# GP 0.7.2 support

## Issue by @tomusdrw

Changes: https://github.com/gavofyork/graypaper/compare/v0.7.1...v0.7.2

Non exhaustive list:

- [x] PVM Invocations: Assign registers 9 and 10 to f and l in info host call by @davxy in https://github.com/gavofyork/graypaper/pull/480
- [x] Serialization: Correct bit sequence encoding range by @0xjunha in https://github.com/gavofyork/graypaper/pull/481
- [x] Statistics: Fix accumulation stats by @zdave-parity in https://github.com/gavofyork/graypaper/pull/484
- [x] PVM Invocations: Simplify fetch case 8 by @zdave-parity in https://github.com/gavofyork/graypaper/pull/486
- [x] Accumulation: Order θ before assign to new state by @qiweiii in https://github.com/gavofyork/graypaper/pull/477
- [x] PVM Invocations: Adds explicit OOG check for each invocation mutator default case by @ascrivener in https://github.com/gavofyork/graypaper/pull/482
- [x] PVM Invocations: Correct gas charge for transfer host call failures by @0xjunha in https://github.com/gavofyork/graypaper/pull/488
- [x] WPs&WRs: Fix up the WP size limits by @gavofyork in https://github.com/gavofyork/graypaper/pull/493


## Comment by @mateuszsikora

> Accumulation: Order θ before assign to new state by @qiweiii in https://github.com/gavofyork/graypaper/pull/477

it is already implemented 


## Comment by @DrEverr

implemented #657 
---
> PVM Invocations: Assign registers 9 and 10 to f and l in info host call by @davxy in https://github.com/gavofyork/graypaper/pull/480

implemented #678 
---
> PVM Invocations: Correct gas charge for transfer host call failures by @0xjunha in https://github.com/gavofyork/graypaper/pull/488

implemented #718 
---
> WPs&WRs: Fix up the WP size limits by @gavofyork in https://github.com/gavofyork/graypaper/pull/493

implemented #717 
---
> Statistics: Fix accumulation stats by @zdave-parity in https://github.com/gavofyork/graypaper/pull/484

this is irrelevant at this stage of our implementation. bcs we only return `null` in `fetch-externalities.ts` for `authorizer()` (which this pr is about)
---
> PVM Invocations: Simplify fetch case 8 by @zdave-parity in https://github.com/gavofyork/graypaper/pull/486


