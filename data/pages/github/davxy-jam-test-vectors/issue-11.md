---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/11'
title: >-
  Different semantic for services in `preimages` and `accumulation` and
  `reports`
site: github.com/davxy/jam-test-vectors
created_at: '2025-01-06T18:36:14.000Z'
last_modified: '2025-01-06T18:36:14.000Z'
content_kind: issue
---

# Different semantic for services in `preimages` and `accumulation` and `reports`

## Issue by @danicuki

Is it possible to have the same structure for services in `preimages` and `accumulation` and `reports` vectors?

Sometimes you use ` "data": {  "service": {` and sometimes you use  `"info": {` for the same thing.

Preimages:
```
            {
                "id": 3,
                "info": {
                    "preimages": [
                        {
                            "hash": "0x7a71eb4834e36bcea488abf607e408569bd27cab1ca9c6075f4a4cf64d0a6048",
                            "blob": "0x31237cdb79ae1dfa7ffb87cde7ea8a80352d300ee5ac758a6cddd19d671925ec973d6a912166c954916057eb6a07d3e8bf"
                        }
                    ],
                    "history": [
                        {
                            "key": {
                                "hash": "0x6989ea1c2d5d81e7ef17b32e23d56e5ec90d9d48e19c634e14dd630dd5dd2ce1",
                                "length": 18
                            },
                            "value": []
                        },
                        {
                            "key": {
                                "hash": "0x7a71eb4834e36bcea488abf607e408569bd27cab1ca9c6075f4a4cf64d0a6048",
                                "length": 49
                            },
                            "value": [
                                37,
                                40
                            ]
                        }
                    ]
                }
            }

```

Reports:
```
            {
                "id": 42,
                "info": {
                    "code_hash": "0x6470fd21983eae8d706f1edd5e2dc5afe095980f8fb7bd4ebfd33550d8730246",
                    "balance": 20219,
                    "min_item_gas": 10,
                    "min_memo_gas": 10,
                    "bytes": 19999,
                    "items": 2
                }
            }
```

Accumulation:
```
            {
                "id": 1729,
                "data": {
                    "service": {
                        "code_hash": "0xbe465e91e4d2e5da545c6c53b9c392e891da9a658992feb7d366871d8d6805e6",
                        "balance": 13587,
                        "min_item_gas": 10,
                        "min_memo_gas": 10,
                        "bytes": 13367,
                        "items": 2
                    },
                    "code_image": "0xbc070000000000000020002f686f6d652f64617678792f2e636172676f2f6769742f636865636b6f757..."
         }
```
