---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/50'
title: Accumulation vectors statistics issue
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-07T17:45:09.000Z'
last_modified: '2025-05-07T17:45:09.000Z'
---

# Accumulation vectors statistics issue

## Issue by @jaymansfield

In enqueue_and_unlock_chain-4 for example there are 5 work reports but the post-state service statistics is expecting an accumulation count of 7 instead of 5. It seems to be adding on to the pre-state value of 2 rather then starting fresh.

According to the GP core and service stats are only tracked on a per-block basis and not cumulative over an epoch.


## Comment by @davxy

Indeed, stats were not resetted. Thank you for reporting
