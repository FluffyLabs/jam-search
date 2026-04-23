---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/93'
title: Wrong order Statistics attributes
site: github.com/davxy/jam-test-vectors
created_at: '2025-08-25T14:54:52.000Z'
last_modified: '2025-08-25T14:54:52.000Z'
content_kind: issue
---

# Wrong order Statistics attributes

## Issue by @emielsebastiaan

There seems to be a wrong order in the ASN for Statistics attributes.
This (serialization) order was changed in 0.7.0.

## CoreActivityRecord
https://github.com/davxy/jam-test-vectors/blob/536eb7c715fd4d38bda32581dc2fa6ffeecfce7c/lib/jam-types.asn#L470

Source of change: https://github.com/gavofyork/graypaper/compare/v0.6.7...v0.7.0#diff-a048dfe274d2605e8ab2cc8d34563e8d5f41b50fe16907604a1fa14ad22286b4R83-R86

Correct order as per [GP-0.7.0-eq:13.6](https://graypaper.fluffylabs.dev/#/38c4e62/198302198302?v=0.7.0)
```
    ...
    imports         U16,
    -- Number of segments exported to DA during block processing
    extrinsic-count U16,
    -- Serialized work bundle size written to DA.
    extrinsic-size  U32,
    -- Total number of extrinsics for reported work.
    exports         U16,
    -- Total size of extrinsics for reported work.
    ...
```

## ServiceActivityRecord
https://github.com/davxy/jam-test-vectors/blob/536eb7c715fd4d38bda32581dc2fa6ffeecfce7c/lib/jam-types.asn#L494

Source of change: https://github.com/gavofyork/graypaper/compare/v0.6.7...v0.7.0#diff-a048dfe274d2605e8ab2cc8d34563e8d5f41b50fe16907604a1fa14ad22286b4R95-R98

Correct order as per [GP-0.7.0-eq:13.7](https://graypaper.fluffylabs.dev/#/38c4e62/19f70219f702?v=0.7.0)
```
    ...
    imports               U32,
    -- Number of segments exported into the DL
    extrinsic-count       U32,
    -- Number of work-items accumulated
    extrinsic-size        U32,
    -- Total number of extrinsics used
    exports               U32,
    -- Total size of extrinsics used
    ...
```

Definitions/semantics of `x` and `e` can be found in [GP-0.7.0-eq:11.6](https://graypaper.fluffylabs.dev/#/38c4e62/142200142200?v=0.7.0).
Graypaper 0.7.0 is consistent with the use of the attributes. My conclusion is that the order in the Statistics ASN parts need to be changed.


## Comment by @davxy

Good catch. You're right.
I can’t see any valid reason for this reshuffling.  
It doesn’t even show up explicitly in the [change list](https://github.com/gavofyork/graypaper/releases/tag/v0.7.0), but is buried in the macroification changes. So it seems almost accidental.  
In any case, we’ll need to fix it.



## Comment by @emielsebastiaan

Yes that is eq:13.7. 
Second header in this issue should have been ServiceActivityRecord


## Comment by @davxy

@emielsebastiaan can you review? 
https://github.com/davxy/jam-test-vectors/pull/94



## Comment by @emielsebastiaan

> [@emielsebastiaan](https://github.com/emielsebastiaan) can you review? [#94](https://github.com/davxy/jam-test-vectors/pull/94)
Looks good; https://github.com/davxy/jam-test-vectors/pull/94#pullrequestreview-3154341556
