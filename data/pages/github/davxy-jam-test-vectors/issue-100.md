---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/100'
title: Missing storage_item in `transfer_for_ejected_service-1.json`
site: github.com/davxy/jam-test-vectors
created_at: '2025-10-08T20:11:29.000Z'
last_modified: '2025-10-08T20:11:29.000Z'
---

# Missing storage_item in `transfer_for_ejected_service-1.json`

## Issue by @emielsebastiaan

Hi @davxy,

Our run of the accumulate testvectors shows you miss an entry in the storage item dict in the posterior state for service_id `0`.
https://github.com/davxy/jam-test-vectors/blob/372204dfba44c5652fbccd974d2da596a2352205/stf/accumulate/tiny/transfer_for_ejected_service-1.json#L376

Test:  `transfer_for_ejected_service-1.json`

Could you double check?



## Comment by @jaymansfield

Didn't notice this vector was even added. It is not listed in the accumulate README (@davxy).


## Comment by @davxy

Whops :-) I'll have a look


## Comment by @davxy

> Didn't notice this vector was even added. It is not listed in the accumulate README ([@davxy](https://github.com/davxy)).

Yeah, I'll add it the readme. i added a couple of interesting cases


## Comment by @emielsebastiaan

I guess we found it because we loop through all the vectors generally and (unintentionally) forget to read the README. 
