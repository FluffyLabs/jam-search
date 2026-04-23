---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/37'
title: 'Bytes: Improve bytes parsing'
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-24T10:41:22.000Z'
last_modified: '2024-07-24T10:41:22.000Z'
content_kind: issue
---

# Bytes: Improve bytes parsing

## Issue by @tomusdrw

Introduced in: https://github.com/FluffyLabs/typeberry/blob/ee5a6f36ae9d1ef1d01927c28833777a355d9efe/packages/bytes.ts#L40

Related PR: #29 

Currently we parse each hex string by prepending `0x` in front of it and passing it to `Number` constructor since we want to reject everything that isn't a valid hex string (`parseInt('0gibberish', 16) === 0` - JS, duh).
Most likely this isn't very fast, it's probably better to simply take every nibble and create a switch statement that returns a correct number based on the `0..f` input.

There is another todo in the file about hex encoder which based on a reverse of such map could be easily tackled at the same time.
