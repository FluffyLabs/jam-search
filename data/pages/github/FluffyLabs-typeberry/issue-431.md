---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/431'
title: Clean up old values from the DB
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-12T12:58:07.000Z'
last_modified: '2025-06-12T12:58:07.000Z'
content_kind: issue
---

# Clean up old values from the DB

## Issue by @tomusdrw

Follow up on #419 
Related #430 

We store larger values separately, but we never remove them. We should be either ref-counting the values (i.e. in how many state-leaf collections it's being referenced) and remove when it reaches 0 or we could simply store the last state that uses that value if we prune all states before finality (i.e not being able to re-execute some older blocks)


## Comment by @tomusdrw

Related #1000 and #931 
