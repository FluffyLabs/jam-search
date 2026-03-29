---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/88'
title: '1757862207: Accumulation Output Order'
site: github.com/davxy/jam-conformance
created_at: '2025-09-16T11:17:49.000Z'
last_modified: '2025-09-16T11:17:49.000Z'
---

# 1757862207: Accumulation Output Order

## Discussion by @danicuki

Case `1757862207` fails here because of accumulation output order. 

Yours service `219901531` comes before `2374888106`
Ours service `2374888106` comes before `219901531` 

In the GP B is a sequence `B ≡ {[N_S, H]}`
In ∆∗ b is a sequence
But in ∆+ there is `b∗ ∪ b` which seems to be wrong. 

Anyway, we seem to be following the work report order, so don't understand why you changed the order of outputs, since 2374888106 comes first. Any idea?


## Comment by @qiweiii

https://github.com/gavofyork/graypaper/pull/477

i had a PR related to this


## Comment by @danicuki

But on `0.7.2` seems that order is not there anymore:
<img width="225" height="97" alt="Screenshot 2025-09-16 at 15 05 20" src="https://github.com/user-attachments/assets/51729aa7-f33a-4560-9fe5-ab9e040a1041" />

