---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/30'
title: jam-types 0.1.8 ordering bug
site: github.com/w3f/jamtestvectors
created_at: '2024-12-19T08:57:00.000Z'
last_modified: '2024-12-19T08:57:00.000Z'
content_kind: issue
---

# jam-types 0.1.8 ordering bug

## Issue by @gilescope

In jam types 0.1.8, it's defined in this order:
```rust
#[derive(Copy, Clone, Encode, Decode, Debug, Eq, PartialEq)]
pub struct OpaqueValKeyset {
	/// The opaque Ed25519 public key.
	pub ed25519: OpaqueEd25519Public,
	/// The opaque Bandersnatch public key.
	pub bandersnatch: OpaqueBandersnatchPublic,
	/// The opaque BLS public key.
	pub bls: OpaqueBlsPublic,
	/// The opaque metadata.
	pub metadata: OpaqueValidatorMetadata,
}
```
but in https://github.com/w3f/jamtestvectors/blob/dc20cbce7d855974aa64301a4d952e22f277010f/safrole/tiny/enact-epoch-change-with-no-tickets-1.json#L17 and in the scale the bandersnatch comes first. The gray paper clearly states bandersnatch is first (6.9) so this seems a bug in jam types.

I would raise it there, but there seems no public repo associated with https://crates.io/crates/jam-types ? I raise it here as this is where people will notice the inconsistency.


## Comment by @davxy

@gilescope should be fixed now. I can't close issues here
