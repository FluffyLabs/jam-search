---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/59'
title: Storage Encoding is not using hash of values
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-23T09:52:00.000Z'
last_modified: '2025-05-23T09:52:00.000Z'
content_kind: issue
---

# Storage Encoding is not using hash of values

## Issue by @danicuki

take for example:
```
            {
                "key": "0x00ff00ff00ff00ff1dc4a8ed313ffd8e3a4a2b5de0c498ffe7592bf446a44b",
                "value": "0xf50ffdd7c723bbb331119be626ec88b842681a66d0e836b2a65687ab9c4c2862"
            },
```

The hash of value would be `0xced6becc363e0996e65f731c159f1464363d5c88824f466796ab8c0a1fbc9012`, so the partial key for this storage could not `1dc4a8ed313ffd8e3a4a2b5de0c498ffe7592bf446a44b`

Aren't we supposed to use the hash of the value as key for storage items?




## Comment by @danicuki

https://github.com/davxy/jam-test-vectors/blob/traces/traces/reports-l0/00000007.json


## Comment by @davxy

(just in case) **This is not a preimage. This is a storage value.**
**In general** - service storage value has no relationship with key (again, in general).

**HOWEVER** - since we are lazy :))) - for these vectors the service key is set equal to the value, but this is just a choice for these tests. E.g. the service do calls like `write(key="foo", value="foo")`.

In this particular case the write is invoked with
- `service_key=0xf50ffdd7c723bbb331119be626ec88b842681a66d0e836b2a65687ab9c4c2862`
-  `value=0xf50ffdd7c723bbb331119be626ec88b842681a66d0e836b2a65687ab9c4c2862`

The service key is then transformed into the state key by first computing $k$ as specified in the write host call:

![Image](https://github.com/user-attachments/assets/44ec03fc-d4b3-40d2-bbf6-b98889ba4c84)

```
s = service_id
hash_in = encode(s) ++ service_key = 0x00000000 ++ 0xf50ffdd7c723bbb331119be626ec88b842681a66d0e836b2a65687ab9c4c2862;
k = blake2b-256(hash_in) = 0x1dc4a8ed313ffd8e3a4a2b5de0c498ffe7592bf446a44bd74fa3cbd03896f6ea
```

Then $k$ is used to build the state key as per expression D.2: $C(s, E_4(2^{32} - 1) ++ k_0..k_28)$, which yields

```
0x00ff00ff00ff00ff1dc4a8ed313ffd8e3a4a2b5de0c498ffe7592bf446a44b
```
