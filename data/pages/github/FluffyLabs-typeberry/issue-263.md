---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/263'
title: >-
  Rename `fromCodec` static function to `new` in data model and make constructor
  private.
site: github.com/FluffyLabs/typeberry
created_at: '2025-02-11T16:41:52.000Z'
last_modified: '2025-02-11T16:41:52.000Z'
content_kind: issue
---

# Rename `fromCodec` static function to `new` in data model and make constructor private.

## Issue by @tomusdrw

I've noticed that I prefer the `fromCodec` function when creating new objects over regular constructor. Mostly because by passing a POJO object you have the fields named (avoids mistakes with argument order if the types are the same).

However `fromCodec` looks weird, since it has nothing to do with the codec :)


I'd like to propose the following:

1. Rename `static fromCodec` to `static new` in our data model.
2. Making constructors `private`
3. Changing `codec.Class` to avoid having strict requirement on `fromCodec` method, but rather passing a builder function that defaults to `Constructor.new` if present (afair `codec.object` has something like that already).


## Comment by @DrEverr

Since `new` is reserved and can be troublesome I propose calling this method `create`, or just `from` 
