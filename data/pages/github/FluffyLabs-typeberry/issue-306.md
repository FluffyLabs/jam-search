---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/306'
title: Codec API Redesign
site: github.com/FluffyLabs/typeberry
created_at: '2025-03-29T14:00:37.000Z'
last_modified: '2025-03-29T14:00:37.000Z'
content_kind: issue
---

# Codec API Redesign

## Issue by @tomusdrw

As seen in #299, having verification in the codec (#253) does not fit nicely into the current design. The codec (i.e. Encoder/Decoder, descriptors, etc) is currently designed around simplicity of use, so we use exceptions to trigger expected, but invalid behaviour (such as validation errors).

To have richer error types (also coming from validation), the API would be best rewritten using `Result` type, so that we can distinguish and handle different error types.


## Comment by @tomusdrw

Another possibility of refactor is to remove the `Views` from the core codec package. While useful, they introduce a bit of complexity to the internals, complicate the typings, etc.
Note that it would be completely okay to just separate the `View` stuff, not remove it completely. I.e. we could build a wrapper library that contains the same descriptors as the original one enriched with the view types.

The reason it's tangled together currently is to avoid duplication when specifying complex nested objects, e.g.:
```typescript
class Block {
  static Codec = codec.Class(Block, { header: Header.Codec, extrinsic: Extrinsic.Codec });
 ...
}
class Header {
  static Codec = codec.Class(Header, { timeSlot: TimeSlot, ... });
  ...
}
```
So it's possible to access `Block.Codec.View` or `Block.Codec` whatever is needed, and further down I can access `const timeSlot = blockView.header.view().timeSlot.materialize()` for instance (i.e. at any level I can materialize).

If views are only used sparingly and we are fine with a little duplication we could have separate definitions for views and materialized objects, like so:
```typescript
// that's a completely separate class from `Block`.
class BlockView {
  static Codec = codec.Class(BlockView, { header: HeaderView.Codec, extrinsic: Extrinsic.Codec });
  ...
}
class HeaderView {
  static Codec = codec.Class(HeaderView, { timeSlot: TimeSlot, ... });
  ...
}
```
That would simplify the code even further, since the same core-codec library could be used for both. We would just extract a bit of helper structs (like `SequenceView`).
Materializing the view would be easy as well, since views store the underlying `source` bytes, so we could just decode them. We might potentially use a bit of caching gains, but the simplicity of the code might be worth it.



## Comment by @tomusdrw

Additional object of codec API refactoring is to get rid of `context` object. Currently selecting right codec depending on some contextual parameter is pretty hacky and does not cover all cases. For instance `name` in `codec.select` is not depending on context (but it should!).

Instead we should rather allow `static Codec = ` to be a function that returns a particular codec depending on the input parameter. For performance reasons the returned values could also be cached.
