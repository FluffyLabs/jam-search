---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/143'
title: 'Codec: Implement verification during decoding.'
site: github.com/FluffyLabs/typeberry
created_at: '2024-10-17T06:42:36.000Z'
last_modified: '2024-10-17T06:42:36.000Z'
content_kind: issue
---

# Codec: Implement verification during decoding.

## Issue by @tomusdrw

There are some cases during decoding which require some collections or numbers to be within some specified range.

We should introduce a way to easily verify length of such collections (and convert them to `KnowSize/FixedSize`) and for the numbers.

All of these places should have a `TODO` note next to them.


## Comment by @tomusdrw

#253 has more details added, so closing.
