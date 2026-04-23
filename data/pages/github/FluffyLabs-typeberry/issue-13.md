---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/13'
title: PVM improvements
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-15T20:40:57.000Z'
last_modified: '2024-07-15T20:40:57.000Z'
content_kind: issue
---

# PVM improvements

## Issue by @mateuszsikora

- ~~implementation of `isInstruction` function is naive and can be a bottleneck (looking for a next `1` in byte array)~~
<img width="532" alt="Screenshot 2024-07-15 at 22 40 43" src="https://github.com/user-attachments/assets/9aa09da4-f17f-48ef-82c8-3df9fc2e719d">

Resolved in https://github.com/FluffyLabs/typeberry/pull/62


- implementation of memory uses array of 4 items `UInt8Array`. Possibly it can be better to allocate one flat array:
<img width="446" alt="Screenshot 2024-07-30 at 22 03 00" src="https://github.com/user-attachments/assets/f76673b8-150c-44da-b96c-2ca18a850629">

- `mulLowerUnsigned` (math-utils) has a condition that can be improved. related discussion: https://github.com/FluffyLabs/typeberry/pull/85#discussion_r1721738961


## Comment by @tomusdrw

Using `BigInt` might be slow, https://stackoverflow.com/questions/57903332/why-is-jss-bigint-98-slower-than-normal-numbers

We might be better of using two `number` types (which gives us 2*53 bits of precision). Needs benchmarking (see #2).


## Comment by @tomusdrw

@mateuszsikora I think this can be closed now after #90 landed, no?


## Comment by @tomusdrw

Closing, since I don't see anything not addressed.
