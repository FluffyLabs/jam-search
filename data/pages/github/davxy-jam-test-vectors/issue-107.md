---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/107'
title: consistence between testvectors format in `stf/preimages` and `stf/accumulate`
site: github.com/davxy/jam-test-vectors
created_at: '2025-11-05T17:39:22.000Z'
last_modified: '2025-11-05T17:39:22.000Z'
content_kind: issue
---

# consistence between testvectors format in `stf/preimages` and `stf/accumulate`

## Issue by @celadari

I recommend use the same format for fields naming between`stf/preimages` and `stf/accumulate`

At the moment,

For `stf/preimages` , in `preimages.asn` we have
```asn
Account ::= SEQUENCE {
    -- [a_p] Preimages blobs.
    preimages SEQUENCE OF PreimagesMapEntry,
    -- [a_l] Preimages lookup metadata.
    lookup-meta SEQUENCE OF LookupMetaMapEntry
}
```
For `stf/accumulate` , in `accumulate.asn` we have
```asn
Account ::= SEQUENCE {
    -- [a_c, a_b, a_g, a_m, a_o, a_i] Service metadata.
    service ServiceInfo,
    -- [a_s] Service storage.
    storage SEQUENCE OF StorageMapEntry,
    -- [a_p] Preimages blobs.
    preimages-blob SEQUENCE OF PreimagesMapEntry,
    -- [a_l] Preimages status.
    preimages-status SEQUENCE OF PreimagesStatusMapEntry
}
```

fields are not the same in name but also in types (LookupMetaMapEntry different than PreimagesStatusMapEntry)

Desired result:
- Would be nice to either use `preimages` and `lookup-meta` for both OR `preimages-blob` and `preimages-status` for both
- also homogenize LookupMetaMapEntry and PreimagesStatusMapEntry
- perhaps move some definitions like PreimagesMapEntry and PreimagesStatusMapEntry to `lib/jam-types.asn`
