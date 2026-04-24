---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/95'
title: Clarification on STF assurances test vectors (v0.7.0)
site: github.com/davxy/jam-test-vectors
created_at: '2025-08-28T19:15:18.000Z'
last_modified: '2025-08-28T19:15:18.000Z'
content_kind: issue
---

# Clarification on STF assurances test vectors (v0.7.0)

## Issue by @yu2C

I'm curious about some issues of the jam-test-vector/stf/assurances (v0.7.0)
From [README](https://github.com/davxy/jam-test-vectors/blob/master/stf/assurances/README.md):

the "[assurances_for_stale_report-1](https://github.com/davxy/jam-test-vectors/blob/master/stf/assurances/tiny/assurances_for_stale_report-1.json)" pins red dot (which implies error code exists), but in the file, there's no error code but has ok with reports (which implies green dot)

Why "[no_assurances_with_stale_report-1](https://github.com/davxy/jam-test-vectors/blob/master/stf/assurances/tiny/no_assurances_with_stale_report-1.json)" doesn't have output? (we don't output timeout reports?)

Stale work report assignment is removed (but not returned in the output).


## Comment by @davxy

> the "[assurances_for_stale_report-1](https://github.com/davxy/jam-test-vectors/blob/master/stf/assurances/tiny/assurances_for_stale_report-1.json)" pins red dot (which implies error code exists), but in the file, there's no error code but has ok with reports (which implies green dot)

Good catch, should be green indeed. I'll fix it. Thank you

> Why "[no_assurances_with_stale_report-1](https://github.com/davxy/jam-test-vectors/blob/master/stf/assurances/tiny/no_assurances_with_stale_report-1.json)" doesn't have output? (we don't output timeout reports?)

We output only available reports 


## Comment by @davxy

https://github.com/davxy/jam-test-vectors/commit/8cba69496f496c56ec9d3dc250e83df147e81203
