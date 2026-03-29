---
type: page
url: 'https://github.com/w3f/jamtestvectors/pull/2'
title: Added trie test vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-06-24T13:55:46.000Z'
last_modified: '2024-06-24T13:55:46.000Z'
---

# Added trie test vectors

## Pull Request by @arkpar

This is based on python code initially written by @zdave-parity


## Comment by @zdave-parity

Can just drop the `0 <=` here?


## Comment by @zdave-parity

This should be `1 | (len(v) << 2)`? AIUI everything in the spec is lowest-bit first (see 3.7.3).


## Comment by @zdave-parity

This should be `& 0xfe`?


## Comment by @zdave-parity

This should just be 3?


## Comment by @arkpar

Good point


## Comment by @zdave-parity

The spec currently says `0 < len(v) <= 32` but I think it would be simplest for 0-length values to go through the inline-value path, so we should change the spec to match this?


## Comment by @arkpar

Yes, I'll make PR to fix it in the spec


## Comment by @kianenigma

This seems correct in light of https://github.com/w3f/jamtestvectors/issues/6


## Comment by @kianenigma

This is meant to represent `[1, 0] ⌢ bits(E1(∣v∣))`? the first flag bits seem flipped to me. 


## Comment by @arkpar

`bits` function puts the least significant bit first. So the octet (byte) that is formed with `[1, 0] ⌢ bits(E1(∣v∣))` has the least significant bit as 1 and the next bit as 0. 
