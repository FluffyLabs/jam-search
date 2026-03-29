---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/34'
title: Reports not using the GP defined order
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-04T08:47:44.000Z'
last_modified: '2025-04-04T08:47:44.000Z'
---

# Reports not using the GP defined order

## Issue by @boymaas

Goodday @davxy, I noticed that the order of the core stats

<img width="595" alt="Image" src="https://github.com/user-attachments/assets/4fc0dd9e-1817-49fc-bed4-7e11d841ac62" />

differs from:

https://github.com/davxy/jam-test-vectors/blob/40589baacb7d654c4d83aecfe2327677d3ea9996/jam-types-asn/jam-types.asn#L268-L287

Which order should we use?






## Comment by @davxy

Ty for reporting. Looks like `ServiceActivityRecord` is wrong as well?


## Comment by @boymaas

Now looking at it, yes indeed. It seems that in the graypaper exports follows import and extrinsic count and size are reversed vs the `jam-types.asn`.
