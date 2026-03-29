---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/9'
title: preimage not needed fix
site: github.com/davxy/jam-test-vectors
created_at: '2024-12-28T15:58:48.000Z'
last_modified: '2024-12-28T15:58:48.000Z'
---

# preimage not needed fix

## Issue by @danicuki

 I was testing the preimages vector and it looks like "preimage_not_needed-1.json" should not raise error.
You set history value as [], which is what is expected. value in history should have at least something inside to be considered "not needed". Am I missing something?
pre_state on preimage_not_needed-1.json

```
                    "history": [
                        {
                            "key": {
                                "hash": "0x6989ea1c2d5d81e7ef17b32e23d56e5ec90d9d48e19c634e14dd630dd5dd2ce1",
                                "length": 18
                            },
                            "value": []
                        }
                    ]
```
should be:

```
                    "history": [
                        {
                            "key": {
                                "hash": "0x6989ea1c2d5d81e7ef17b32e23d56e5ec90d9d48e19c634e14dd630dd5dd2ce1",
                                "length": 18
                            },
                            "value": [42]
                        }
                    ]
```


## Comment by @davxy

Preimage not needed is raised because one of the provided blobs was not solicited (i.e. lookup meta has an entry only for one of the images). Please re-open if this doesn't help or reflect your expectations.

Also, FYI I've recently updated the preimages vectors with some more checks (ordering)


## Comment by @danicuki

Could you point the GP formula you are referring in this case, please?


## Comment by @davxy

GP 0.6.1 - eq.12.30 requires that $d[s]_l[(h, l]) = []$, which means that the preimage of $h$ with length $l$ has been solicited. When not solicited  $d[s]_l[(h, l]) = \emptyset$,

See also description above the equations:

> The data must have been solicited by a service but not yet provided in the prior state

