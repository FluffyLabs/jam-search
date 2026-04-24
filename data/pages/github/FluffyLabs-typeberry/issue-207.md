---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/207'
title: PVM - open problems.
site: github.com/FluffyLabs/typeberry
created_at: '2024-12-17T14:57:41.000Z'
last_modified: '2024-12-17T14:57:41.000Z'
content_kind: issue
---

# PVM - open problems.

## Issue by @tomusdrw

1. [ ] How to read extra bytes passed to instruction. Imagine that the mask specifies that there is an instruction at index `i` and the next instruction is say at `i + 16` - we should probably cap the length of immediate to be at most `4`.
2. [ ] Can these extra bytes just exist in the program? Say we have instruction taking one immediate but having 10 extra bytes following in the code, we will read only 4 of them and the 6 remaining will just be skipped. IS that okay or should rather such programs be treated as invalid?
3. [ ] In case we have instruction and it does not have enough bytes to decode the arguments, should we subtract one extra gas value (just like we do in case of a page fault)?
4. [ ] What if we reached `0` gas exactly at the end of the program and we are about to invoke the "Virtual Trap". Should such program end with OOG (because w can't subtract 1 from gas) or rather `PANIC` because we execute the trap anyway?
5. [ ] sbrk allocates requested amount of memory and returns the first index of "newly available" memory. However we allocate the entire page even if one byte is requested. What should two subsequent 1-byte SBRK requests return? The first one will return `0`, but does the second one return `1` or rather `4096`?
6. [x] decoding arguments if there is not enough bytes (see https://github.com/tomusdrw/anan-as/pull/21)
