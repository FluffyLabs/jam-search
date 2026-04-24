---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/44'
title: Networking Streams (JAMSNP)
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-28T17:00:36.000Z'
last_modified: '2024-07-28T17:00:36.000Z'
content_kind: issue
---

# Networking Streams (JAMSNP)

## Issue by @tomusdrw

Introduce some initial version of networking based on:
https://github.com/zdave-parity/jam-np/blob/main/simple.md
(or any updated networking documentation)

Protocols
- [x] UP 0: Block announcement (#142)
- [x] CE 128: Block request (#169)
- [x] CE 129: State request (#149)
- [x] CE 131/132: Safrole ticket distribution (#208)
- [x] CE 133: Work-package submission (#156)
- [x] CE 134: Work-package sharing (#227)
- [ ] CE 135: Work-report distribution
- [ ] CE 136: Work-report request
- [ ] CE 137: Shard distribution
- [ ] CE 138: Audit shard request
- [ ] CE 139/140: Segment shard request
- [ ] CE 141: Assurance distribution
- [ ] CE 142: Preimage announcement
- [ ] CE 143: Preimage request
- [ ] CE 144: Audit announcement
- [ ] CE 145: Judgement publication


## Comment by @tomusdrw

Partially addressed in #156 #149 #142 


## Comment by @skoszuta

CE 128 Implemented in #169


## Comment by @skoszuta

Beginning implementation of protocols 131/132
