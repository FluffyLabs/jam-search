---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/624'
title: Retire state-machine
site: github.com/FluffyLabs/typeberry
created_at: '2025-09-15T10:15:30.000Z'
last_modified: '2025-09-15T10:15:30.000Z'
content_kind: issue
---

# Retire state-machine

## Issue by @tomusdrw

Objectives:
1. Allow initializing the client without workers. That will allow using `InMemoryDb` instead of `LMDB`.
2. Simplify bootstraping of workers (too much overhead now, for no obvious gains).
3. Simplify communication between workers and allow direct communication. Data should be sent as jam-codec without much code overhead to manually encoded/decode. Views should be preferred to avoid copying - the underlying buffers should be transferred between workers. In case there is no workers, data should be sent directly.
