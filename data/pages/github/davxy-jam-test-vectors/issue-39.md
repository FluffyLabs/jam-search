---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/39'
title: Statistics test vector with preimage data does not lead to services stats
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-10T12:19:25.000Z'
last_modified: '2025-04-10T12:19:25.000Z'
content_kind: issue
---

# Statistics test vector with preimage data does not lead to services stats

## Issue by @arjanz

Hi @davxy, 

Shouldn't the preimages present in:

https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/statistics/tiny/stats_with_some_extrinsic-1.json#L16-L28

lead to services statistics for service 0?

<img width="458" alt="Image" src="https://github.com/user-attachments/assets/26bcf152-48a3-4be6-967c-ad3f379e0a64" />



## Comment by @harshil-chainscore

facing the same issue 

![Image](https://github.com/user-attachments/assets/c177f1b7-f720-4764-9edb-2623cac6dd18)


## Comment by @davxy

@arjanz @harshil-chainscore see https://github.com/davxy/jam-test-vectors/pull/54

In particular: https://github.com/davxy/jam-test-vectors/blob/master/stf/statistics/README.md#validators-statistics

