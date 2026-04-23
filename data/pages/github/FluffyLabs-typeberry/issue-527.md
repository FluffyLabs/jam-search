---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/527'
title: Optimize announcement sending
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-03T08:05:34.000Z'
last_modified: '2025-08-03T08:05:34.000Z'
content_kind: issue
---

# Optimize announcement sending

## Issue by @tomusdrw

As mentioned [in #452](https://github.com/FluffyLabs/typeberry/pull/452/files#diff-9f18692e272c61b0c03e352a0f06c7ec2633a9eaecd9e470f4930a1075f5ccc4R218-R220) we currently gossip announcements to all connected peers, which is pretty redundant.

Instead we should only send the announcement to peers that don't know about that block yet. Since we already track (in `SyncAux`) what's the best block the peer has, we can check if it's better or worse (or on a different fork?) than the block we are announcing.


Secondly, we can consider sending the block announcement before we fully import the block (run full STF). That's the intended behaviour that's described in GP.
