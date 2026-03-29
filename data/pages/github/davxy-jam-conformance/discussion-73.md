---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/73'
title: '1757423902'
site: github.com/davxy/jam-conformance
created_at: '2025-09-10T21:00:30.000Z'
last_modified: '2025-09-10T21:00:30.000Z'
---

# 1757423902

## Discussion by @bloppan

Hi @davxy , I don't pass this trace because the code hash of the service `3432010466` is `0000000000000000000000000000000000000000000000000000000000000000` [here](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/traces/1757423902/00000152.json#L111C27-L111C93) and it should be `baf736ff7927f6f7dfa744a10a67a48b261ae89bbe5c712f7c1f0ee023776661` instead (I calculated the Blake2b 256 hash of the [preimage blob](https://github.com/davxy/jam-conformance/blob/main/fuzz-reports/0.7.0/traces/1757423902/00000152.json#L95)).

My impl is not accumulating this service because is not able to find the preimage key, which is constructed from the code hash 
`[0; 32]` given in the state key-values. 


## Comment by @davxy

Perhaps that service is a zombie waiting for being ejected?


## Comment by @davxy

i.e. previously called [upgrade](https://graypaper.fluffylabs.dev/#/1c979cb/360504360504?v=0.7.1) with new code hash = encode(ejector_id, 0..0) as required by [eject](https://graypaper.fluffylabs.dev/#/1c979cb/373302373a02?v=0.7.1)


## Comment by @bloppan

Thanks for your response, @davxy , I found an error in my implementation.
