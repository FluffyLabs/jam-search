---
type: page
url: 'https://github.com/FluffyLabs/jam-testing/issues/54'
title: 'Demo fuzz failure: graymatter → pyjamaz (full)'
site: github.com/FluffyLabs/jam-testing
created_at: '2026-05-08T21:30:34.000Z'
last_modified: '2026-05-08T21:30:34.000Z'
content_kind: issue
---

# Demo fuzz failure: graymatter → pyjamaz (full)

## Issue by @github-actions[bot]

cc @emielsebastiaan

The demo graymatter fuzz source test against **pyjamaz** with spec **full** failed.

**Run:** https://github.com/FluffyLabs/jam-testing/actions/runs/25575466237

Please investigate and close this issue once resolved.


## Comment by @emielsebastiaan

We'll be looking into this shortly. 🙏🏻 


## Comment by @tomusdrw

@emielsebastiaan AFAICT it is consistently failing with:
```
[graymatter] 
GrayMatter has encountered an unrecoverable error and crashed.

  Error: Fuzzer failed: {:error, :eacces}
```
I guess either pyjamaz sets some weird permissions to the socket or it might be some server/docker misconfiguration, so please let me know if you'd like to test something.


## Comment by @emielsebastiaan

Yes thx probably Monday. 
