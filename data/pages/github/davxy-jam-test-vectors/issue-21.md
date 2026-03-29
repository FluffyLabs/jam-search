---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/21'
title: '[nit] Disputes test case improvement'
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-15T00:39:41.000Z'
last_modified: '2025-02-15T00:39:41.000Z'
---

# [nit] Disputes test case improvement

## Issue by @0trust3r

Hi davxy 👋  

[This test case](https://github.com/davxy/jam-test-vectors/blob/polkajam-vectors/disputes/tiny/progress_with_bad_signatures-2.json#L56) in the Disputes suite also fails the duplicate report hash test (equation 10.9 in the GP). While this is a minor nit, I think it would be good to ensure our test cases are entirely valid outside of the failure condition under test. Happy to open a PR if that's the appropriate route.


## Comment by @davxy

@0trust3r should be fixed by #38 
