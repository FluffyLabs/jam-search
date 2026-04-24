---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/36'
title: 'Trie: Create an efficient `Map` which uses `TrieHash` as keys directly'
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-24T10:38:29.000Z'
last_modified: '2024-07-24T10:38:29.000Z'
content_kind: issue
---

# Trie: Create an efficient `Map` which uses `TrieHash` as keys directly

## Issue by @tomusdrw

Introduced in:
https://github.com/FluffyLabs/typeberry/blob/ee5a6f36ae9d1ef1d01927c28833777a355d9efe/packages/trie/nodesDb.ts#L16

Related PR: #29 

JavaScript `Map` object uses `===` comparison to match the keys when querying it. Since we want to use `TrieHash` (which internally is `Bytes<32>`) as keys, we can't really do that unless we internalize all bytes objects (i.e. make sure they have the same references) which does not sound like a good idea initially (although we can measure that :)).

The goal is to implement a `Map` that can have any object as it's keys and use some sort of `Equal` interface (or maybe better `Comparable` to be able to do bin search) to compare them.

If that makes sense we can also have something more specialized towards `Bytes<32>`:
I can imagine splitting the Bytes<32> sequence into chunks of 6 bytes and creating JS `number` types (we need to keep it below SAFE INTEGER (2**53 iirc); alternatively we could use `BigInt` and use 8 bytes). and create a 6-time nested `Map` to store the keys, like that:
`Map<First6bytes, Map<Second6bytes, Map<Third6bytes, Map<Forth6bytes, Map<Fifth6bytes, Map<Last2bytes, Value>...>`

It's worth testing though if that approach is faster than simply having some form of sorted list of keys and doing binary searches.

Obviously to take a good decision about this data structure we need to know exactly how many values we might be storing, but that requires a real-world data (the gut feeling though is: a lot, think millions)


## Comment by @tomusdrw

done in #732 more optimisations can be done on this structure.
