---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/52'
title: Wrong encoded or inconsistent data structure
site: github.com/w3f/jamtestvectors
created_at: '2025-07-01T12:29:53.000Z'
last_modified: '2025-07-01T12:29:53.000Z'
---

# Wrong encoded or inconsistent data structure

## Issue by @xDimon

Some dispute-tests have fail at decode bin-file:

Field `core-index` of `WorkReport` has type [`CoreIndex` aka U16](https://github.com/davxy/jam-test-vectors/blob/255997c5a03896dbe0ea26a4735796c71c3b1356/jam-types-asn/jam-types.asn#L363) (fixed-length integer), but encoded as JAM-Compact-Integer (variable-length integer) in .bin files (1-2 bytes).

Field `auth-gas-used` of `WorkReport` has type [`Gas` aka U64](https://github.com/davxy/jam-test-vectors/blob/255997c5a03896dbe0ea26a4735796c71c3b1356/jam-types-asn/jam-types.asn#L95) (fixed-length integer), but encoded as zero-byte (I guess all of its fields have encoded as JAM-Compact-Integer) in .bin files.

Field `refine-load` of `WorkResult` has type [`RefineLoad` aka `(Gas,U16,U16,U32,U16)`](https://github.com/davxy/jam-test-vectors/blob/255997c5a03896dbe0ea26a4735796c71c3b1356/jam-types-asn/jam-types.asn#L302-L313), but encoded as five zero-bytes (I guess all of its fields have encoded as JAM-Compact-Integer).

Please, check encoding of that structure if it mistaken, or describe this types decodings as JAM-Compact-Integer.


## Comment by @davxy

I have not double-checked every field, but IIRC all the mentioned ones,
according to the GP, must be encoded as compact. The ASN.1 file defines
the syntax, not the encoding format (i.e., it cannot express whether a
field should use compact encoding). I should probably add a comment about
this in the ASN.1 file.


## Comment by @davxy

@xDimon pls close the issue if is sorted. I can't close issues in this repo
