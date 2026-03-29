---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/66'
title: '1757063641'
site: github.com/davxy/jam-conformance
created_at: '2025-09-06T06:09:05.000Z'
last_modified: '2025-09-06T06:09:05.000Z'
---

# 1757063641

## Discussion by @ascrivener

The tickets marker "attempt" values in the header have issues: 

1. They are out of the valid bound. They should be < N = 3 (for tiny):

<img width="426" height="57" alt="Screenshot 2025-09-06 at 1 59 43 PM" src="https://github.com/user-attachments/assets/28f10496-f357-4a68-a116-64e0640840ff" />

https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/traces/1757063641/00000180.json#L101

2. Encoded incorrectly.

Inspecting the hex I see 201 is encoded to hex as 0xC9, which is the trivial natural number encoding. But, GP says to encode them using the general natural number serialization, which would give 0x80C9.

<img width="532" height="43" alt="Screenshot 2025-09-06 at 1 56 44 PM" src="https://github.com/user-attachments/assets/3b082e7b-95a1-4fa9-b3ae-de58a16b7936" />




## Comment by @vekexasia

I think this is exactly why the block should fail to apply. I did notice the bounds as well 


## Comment by @ascrivener

That might be the case, but the bigger issue is that it's not encoded properly. In fact this issue was already brought up (https://github.com/davxy/jam-conformance/issues/12#issuecomment-3196523728) and @davxy confirmed it was an oversight


## Comment by @davxy

If is not encoded properly is an invalid block anyway. Isn't it?


## Comment by @davxy

But perhaps you mean that the encoding doesn't correspond to the value reported in the json. Is that the issue?


## Comment by @ascrivener

The encoding is using the trivial integer encoding (little endian), not the general one. This means the test vector is syntactically incorrect. My understanding is that all test vectors should be at least syntactically correct, and that the fuzzer won’t e.g. randomly decide to encode using general integer incoding instead of little endian, or vice versa. Or provide garbage noise as test vectors, for example


## Comment by @ascrivener

There has also yet to be a single test vector where the ticket attempt # is correctly encoded using the general integer encoding function. Leading me to believe that whatever is generating these vectors is assuming the trivial encoding is correct


## Comment by @davxy

Alright. I fixed it in polkajam. Now ticket attempt will be encoded as compact (regardless of the value).
I'm going to retire this vector . Ty again


## Comment by @davxy

Retired


## Comment by @ascrivener

It seems this wasn't yet retired, can you confirm @davxy ?
