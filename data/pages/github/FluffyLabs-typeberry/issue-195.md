---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/195'
title: 'Disputes: keep disputes records in HashSet and SortedArray  '
site: github.com/FluffyLabs/typeberry
created_at: '2024-12-02T13:51:44.000Z'
last_modified: '2024-12-02T13:51:44.000Z'
content_kind: issue
---

# Disputes: keep disputes records in HashSet and SortedArray  

## Issue by @mateuszsikora

              We should probably make this a `HashDictionary` as well - we can store both the `SortedArray` and `HashDictionary<WorkReportHash, bool>` as collection to make the lookups here efficient. But that can be left for a future optimisation (would be grateful if you could write this down as a follow up issue).

_Originally posted by @tomusdrw in https://github.com/FluffyLabs/typeberry/pull/168#discussion_r1850938300_
            
