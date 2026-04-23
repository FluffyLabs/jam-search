---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/182'
title: Serialization order of fields in recent_history (beta) does not match GP 0.7.2
site: github.com/davxy/jam-conformance
created_at: '2026-03-25T08:30:45.000Z'
last_modified: '2026-03-25T08:30:45.000Z'
content_kind: discussion
---

# Serialization order of fields in recent_history (beta) does not match GP 0.7.2

## Discussion by @sierkov

GP 0.7.2 (7.2) defines the second and third fields of block history items (```beta_H```) as ```state_root``` and ```beefy_root```, in that order.
<img width="834" height="55" alt="image" src="https://github.com/user-attachments/assets/3d19772d-abcb-4472-88d1-1ca79128cce4" />

However, all currently published GP 0.7.2 traces and test vectors expect the opposite ordering: ```beefy_root``` second and ```state_root``` third.

For example, ```BlockInfo``` in [jam-types.asn lines 424-433](https://github.com/davxy/jam-test-vectors/blob/master/lib/jam-types.asn) is defined as:
```
BlockInfo ::= SEQUENCE {
    -- Hash of the block header
    header-hash    HeaderHash,
    -- Merkle Mountain Range root
    beefy-root     OpaqueHash,
    -- Posterior state root
    state-root     StateRoot,
    -- Work packages reported in this block
    reported       SEQUENCE OF ReportedWorkPackage
}
```

I believe the ```beefy_root```, ```state_root``` ordering was used in GP 0.6.7, and that the order changed in GP 0.7.0.



## Comment by @zdave-parity

Serialization order is defined in appendices C and D. Latest GP says b before s AFAICT:

<img width="578" height="45" alt="image" src="https://github.com/user-attachments/assets/51bb74ac-94ca-42c9-849e-71ab9b25f4b7" />

I don't know why the fields are listed the other way around elsewhere, perhaps that should be changed. It is only the order shown in appendix D.1 that matters though.


## Comment by @sierkov

@zdave-parity Thank you, understood. I'm closing this discussion then.

Let me know if you'd like me to open a separate issue for the inconsistency between (7.2) and C(3) in (D.1).
