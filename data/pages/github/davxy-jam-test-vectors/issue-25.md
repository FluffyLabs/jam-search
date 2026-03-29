---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/25'
title: 'bandersnatch::Public::deserialize_compressed Fails to Deserialize Test Vector'
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-26T09:04:54.000Z'
last_modified: '2025-02-26T09:04:54.000Z'
---

# bandersnatch::Public::deserialize_compressed Fails to Deserialize Test Vector

## Issue by @Terryhung

I am trying to deserialize the following compressed public key using `bandersnatch::Public::deserialize_compressed`:
```
0x1ecc3686b60ee3b84b6c7d321d70d5c06e9dac63a4d0a79d731b17c0d04d030d
```
This data is from the test vector in:
https://github.com/davxy/jam-test-vectors/blob/01e036c66727b8d6d058d5ad15c2eeec37d1d1f4/safrole/tiny/enact-epoch-change-with-padding-1.json#L149

However, the deserialization fails with `InvalidData`.

We are using:
```
ark-ec-vrfs = { git = "https://github.com/davxy/ark-ec-vrfs.git", rev="d90e180", features = ["ring", "bandersnatch"] }
```


## Comment by @davxy

As reported in the [README](https://github.com/davxy/jam-test-vectors/blob/01e036c66727b8d6d058d5ad15c2eeec37d1d1f4/safrole/README.md), the vector contains one invalid key

> One of the keys is just invalid (i.e. it can't be decoded into a valid Bandersnatch point).

You need to replace the invalid point with the padding point (use RingContext::padding_point() method)
