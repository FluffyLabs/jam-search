---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/374'
title: Fix problem with circular deps in host calls
site: github.com/FluffyLabs/typeberry
created_at: '2025-05-13T10:10:32.000Z'
last_modified: '2025-05-13T10:10:32.000Z'
content_kind: issue
---

# Fix problem with circular deps in host calls

## Issue by @mateuszsikora

<img width="1391" alt="Image" src="https://github.com/user-attachments/assets/65be0a7a-3706-4e15-ae66-2a5a2ab7d620" />

TODO: 
- create an interface to remove deps to `HostCallsManager`  from `HostCalls`
- `HostCallsManager` should be moved to jam-host-calls



## Comment by @tomusdrw

`pvm-host-calls` can then be moved to `core`
