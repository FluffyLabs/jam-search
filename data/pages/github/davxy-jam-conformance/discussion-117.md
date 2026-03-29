---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/117'
title: 1763371498 - designate updated by designate service
site: github.com/davxy/jam-conformance
created_at: '2025-11-17T14:24:15.000Z'
last_modified: '2025-11-17T14:24:15.000Z'
---

# 1763371498 - designate updated by designate service

## Discussion by @clearloop

From the trace there is only 1 successful bless call but it is called by the designate service (designate=1852356513, bless=0), however the trace expects the privileges get updated by its result: designate (1852356513 -> 0)

---

same in the trace `1763371072`, I remember there were similar problems in the traces of the previous round as well but for drawn validators


## Comment by @jaymansfield

The introduction of R in eq12.20 fixed this and allows the designate server to update the validators now. Are you using this?


## Comment by @clearloop

Thanks! my impl for this is indeed outdated! now we can match these traces!
