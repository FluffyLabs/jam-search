---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/164'
title: 769559762_4234 / 00007689
site: github.com/davxy/jam-conformance
created_at: '2026-01-30T21:13:56.000Z'
last_modified: '2026-01-30T21:13:56.000Z'
content_kind: discussion
---

# 769559762_4234 / 00007689

## Discussion by @jaymansfield

This is regarding the trace under pyjamaz [here](https://github.com/w3f/jam-conformance/tree/pyjamaz_m1/fuzz-reports/0.7.2/traces/1769559762_4234).

It looks like every implementation handled it the same way and resulted in the same state root, but the trace is suggesting the block should have been rejected (post state is showing as 0x000..000).

I can't seem to find any reason why the block wouldn't be valid.


## Comment by @dakk

I confirm jampy has the same issue, the block seems valid to me


## Comment by @emielsebastiaan

Same for us indeed. The block should be valid.
Thank you for your reports @jaymansfield and @dakk :)


## Comment by @davxy

@jaymansfield @crackthecode016  @dakk @emielsebastiaan 
This trace appears to have been generated with an outdated version of the fuzzer. The current version fails to import it, so I suggest retiring this trace.

@PieWol  
The same applies to jamzig `1770288023_1035` and `1770288023_6356`.

