---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/105'
title: fuzzy_trace ...008 (and possibly others) do wrongly some service statistics
site: github.com/davxy/jam-test-vectors
created_at: '2025-10-27T16:41:05.000Z'
last_modified: '2025-10-27T16:41:05.000Z'
---

# fuzzy_trace ...008 (and possibly others) do wrongly some service statistics

## Issue by @vekexasia

In the fuzzy test-case ending with 008 (but i see some similar behavior in 9 others) i see the test expect accumulation statistics also for service 1809622564. 

This service is not included in R* so it should not be included in the service statistics. Related to: 
- https://github.com/davxy/jam-test-vectors/issues/101#issue-3498864449
- https://github.com/davxy/jam-test-vectors/pull/102#issuecomment-3387046802  

In my code R* contains only `0`, block extrinsics have some guarantees but only service 0 and service 1809622648. and no preimages. so it should not be in **s** inside 13.13


## Comment by @vekexasia

wrote in pr closing
