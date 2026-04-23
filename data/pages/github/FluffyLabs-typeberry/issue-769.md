---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/769'
title: '`ed25519` test vectors'
site: github.com/FluffyLabs/typeberry
created_at: '2025-11-10T20:59:54.000Z'
last_modified: '2025-11-10T20:59:54.000Z'
content_kind: issue
---

# `ed25519` test vectors

## Issue by @tomusdrw

https://github.com/davxy/jam-conformance/pull/112

Since we are using `ed25519-dalek` most likely we will need to switch the underlying ed25519 implementation in https://github.com/FluffyLabs/typeberry-native


## Comment by @tomusdrw

We've already switched the implementation in `typeberry-native` however we still should run these test vectors to make sure we're fully complaiant: https://github.com/davxy/jam-conformance/pull/112/files#diff-19ba0c4d21c5bf2df439f996c6b02cc7f976a1000fe9b6c7ec263a9aa21d6643
