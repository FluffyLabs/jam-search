---
type: page
url: 'https://github.com/tomusdrw/anan-as/issues/2'
title: '`@unmanaged` is most likely leaking'
site: github.com/tomusdrw/anan-as
created_at: '2024-11-28T21:08:10.000Z'
last_modified: '2024-11-28T21:08:10.000Z'
content_kind: issue
---

# `@unmanaged` is most likely leaking

## Issue by @tomusdrw

I think I had a wrong understanding of what `@unmanaged` does, so it seems that the code will now be leaking `heap` memory.

Would be best to figure out how to return multiple values in a way that doesn't require heap allocation.


## Comment by @tomusdrw

Most heap allocations removed in #88 ideally we would target `--runtime=stub`, but I guess that would complicate passing-in input programs (the host would need to handle allocation).
