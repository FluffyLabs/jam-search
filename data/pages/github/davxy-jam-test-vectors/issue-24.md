---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/24'
title: 'Disputes: bad_signature-2 test vector also has other errors.'
site: github.com/davxy/jam-test-vectors
created_at: '2025-02-17T15:35:59.000Z'
last_modified: '2025-02-17T15:35:59.000Z'
---

# Disputes: bad_signature-2 test vector also has other errors.

## Issue by @decentration

I have passed 25/26 conformance tests from /disputes. 

the one left is the [bad_signatures-2](https://github.com/davxy/jam-test-vectors/blob/95b73caf4e285b6dd6c59a0f380a02620962dadc/disputes/tiny/progress_with_bad_signatures-2.json) and it appears that there are other errors too not just "bad_signature", such as "culprits_not_sorted_unque", and "already_judged".

is this accidental, or does the test also check to enforce signature checks before the other checks? 

I am assuming its an accident because sorting checks are quicker than sig verification and should be done first.

can you confirm? cheers. 




## Comment by @davxy

I confirm, this needs to be fixed. 
Closing as duplicate of https://github.com/davxy/jam-test-vectors/issues/21
