---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/488'
title: Add tryParse to Bytes and BytesBlob that returns Result
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-17T06:54:13.000Z'
last_modified: '2025-07-17T06:54:13.000Z'
content_kind: issue
---

# Add tryParse to Bytes and BytesBlob that returns Result

## Issue by @DrEverr

With entrance of `Result` type to typeberry. It would be good if we update our `BytesBlob` classes to return this type.


## Comment by @tomusdrw

Changing the existing methods will take a lot of useless effort of handling all places where the exception is fine. We should rather introduce `tryParse*` methods that return `Result` and only use them when we have actual user input.


## Comment by @DrEverr

and this `tryParse` should be complex solution that accepts both with & without `0x` prefix


## Comment by @tomusdrw

> and this `tryParse` should be complex solution that accepts both with & without `0x` prefix

why:) ?


## Comment by @DrEverr

I think it will make it easier to use, more unified/clean code and it's not hard to do, to check if something starts with `0x` and use correct method inside to parse is further.


## Comment by @tomusdrw

The question is do we really need it at that particular part of the code. IMHO the core data structures should be designed in such a way that prevents the errors. Explicitness is one way of making sure there is less errors, because it forces you to understand what kind of data you have, instead of accepting any kind of input data and hoping for the best.

While for any user-input data we should allow flexibility and try to make it as user friendly as we can, I think that the core structures should rather prioritise explicitness, hence I'd be more for:
```ts
tryParseBlob("0xdeadbeef") -> Bytes (or exception) // currently `parseBlob`
parseBlob("0xdeadbeef") -> Result<Bytes, Error>
```

To avoid adding `*NoPrefix` methods, we could consider passing optional `type ParseOptions = { prefix?: 'required' | 'forbidden' | 'maybe' }`, but the defaults should always be strict and developer needs to opt-in for leniency.



## Comment by @tomusdrw

Not planned for now.
