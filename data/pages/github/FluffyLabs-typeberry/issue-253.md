---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/253'
title: Codec verification
site: github.com/FluffyLabs/typeberry
created_at: '2025-01-31T06:24:02.000Z'
last_modified: '2025-01-31T06:24:02.000Z'
content_kind: issue
---

# Codec verification

## Issue by @tomusdrw

We want to be able to add restrictions to the codec during verification.

for instance:
- [ ] some collections should have size bounded by some value ([example](https://github.com/FluffyLabs/typeberry/blob/447d5c45c0ca8e438d9eb04ac19104a4dc642086/packages/block/tickets.ts#L76-L79))
- [ ] collections should be ordered by something ([example](https://github.com/FluffyLabs/typeberry/blob/main/packages/block/gaurantees.ts#L54))
- [ ] Numeric values should be smaller than some value from chain spec (e.g. `validator index`; in general all opaque types need this kind of validation instead of `asOpaque` conversion).


Ideally verification should be done at the earliest stage possible, for instance if there is too many values in the collection we should rather avoid decoding the items at all.

Note that validation might depend on the decoding context (i.e. chain spec).

Unless we identify other kinds of validations required, some ideas for the current ones:
1. A descriptor for `KnownSize/FixedSize` arrays, which instead of going for `sequenceVarLen` right away get's the length first and then checks it.
2. Additional `OrderedArray` with it's own descriptor that can check if elements are in order.
3. Alternatively we can allow passing `SequenceValidator` to the `Decoder.sequence*Len` with methods like `SequenceValidator.validateLength(len)` and `SequenceValidator.validateNextItem(prev, next)`


## Comment by @tomusdrw

Move codec collection-utils to the same package as well:
https://github.com/FluffyLabs/typeberry/pull/298/files#diff-3ba2aa14f314765432e4219398b36d9f7428bc6028f062a9848054b68ff8ad0cR25


## Comment by @tomusdrw

Codec sequences need an option to specify the expected size (instead of relying on the global sequence length) to avoid the issue here:
https://github.com/FluffyLabs/typeberry/pull/298/files#diff-e81b890cf342d16898dc47782ad736a1efc825c03c1d009eec349c01f606cb2aR84

We set max size to 10MB, yet the size computed from adding overly big estimates for the sequences ends up much higher (for instance `600 (epoch length) * 64 (typical var-len sequence) * 64 (typical var-len sequence) * 32 (hash size) ~ 78MB(!)`)
