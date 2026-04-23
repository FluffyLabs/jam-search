---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/24'
title: '`1754982087/00000005` is not using compact encoding for generating service ids'
site: github.com/davxy/jam-conformance
created_at: '2025-08-20T07:05:14.000Z'
last_modified: '2025-08-20T07:05:14.000Z'
content_kind: discussion
---

# `1754982087/00000005` is not using compact encoding for generating service ids

## Discussion by @clearloop

We can pass `00000006` from the [trace][trace] but not `00000005`

`00000005` is not using compact encoding for generating the initial service id, and yes, we can pass `00000005` if we disable the compact encoding for generating service ids, but it will break all of other tests related to host call `new`, as this is discussed in https://github.com/davxy/jam-conformance/issues/16#issuecomment-3190838048, I believe the trace should get retired

[trace]: https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.6.7/traces/1754982087


## Comment by @davxy

Perhaps we should retire this
Edit: done
