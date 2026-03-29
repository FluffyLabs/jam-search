---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/13'
title: Strict encoding of k
site: github.com/w3f/jamtestvectors
created_at: '2024-09-12T07:26:00.000Z'
last_modified: '2024-09-12T07:26:00.000Z'
---

# Strict encoding of k

## Issue by @emielsebastiaan

When looking at PVM testvectors, I assume `k` is a fixed length bitsequence (length defined by `|c|=|k|`). I believe the remaining bits are all filled with 1s rather than 0s.

Example is the ADD instruction. https://github.com/w3f/jamtestvectors/blob/a2b18702aac7d15b9f51cd1ffcf0be95f987b2f7/pvm/programs/inst_add.json#L29

Value `[T,F,F]` is currently `249` or `0xF9` (1-filled) and should be `1` or `0x01` (0-filled).
IMO if we are strict about decoding these vectors should be fixed.

This also implies that the only PVM testvectors that are currently valid are the ones where |c| is accidentally a multiple of 8.


## Comment by @koute

Should be fixed now.
