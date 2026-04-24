---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/64'
title: >-
  The invocation arguments for is-authorized do not appear to conform to GP
  0.6.5.
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-29T12:48:51.000Z'
last_modified: '2025-05-29T12:48:51.000Z'
content_kind: issue
---

# The invocation arguments for is-authorized do not appear to conform to GP 0.6.5.

## Issue by @arjanz

When we wanted to use the `dev-spec.json` exported from `polkajam` as genesis, we ran into some issues with the is-authorized invocation (B.1).

After some trial and error we found that the arguments supplied to the is-authorized invocation seems to be in a different format than GP 0.6.5 specifies.

We would expect serialization of the WorkPackage and core\_index as Varint:

<img width="69" alt="Image" src="https://github.com/user-attachments/assets/b284b61e-3c07-4ed2-91c8-fe6d78820aa4" />

But this always results in a panic. However, when we change the arguments and add a serialised `Vec<u8>` in front containing the auth params en modify the core\_index from `VarInt` to a `u16`, the is-authorized invocation is successful. The signature in the jam-null-authorizer service code also hints this structure:

```rust
impl jam_pvm_common::Authorizer for Authorizer {
	fn is_authorized(param: AuthParam, package: WorkPackage, core_index: CoreIndex) -> AuthOutput {
		info!(
			"Null Authorizer, [{core_index}], {} gas, {param} param, {} token",
			gas(),
			package.authorization
		);
		if package.authorization.0 != param.0 {
			panic!("Authorization failed")
		}
		let m = String::from_utf8_lossy(&package.authorization);
		alloc::format!("Auth=<{m}>").as_bytes().to_vec().into()
	}
}
```

Is our assumption correct that the is-authorized arguments of `polkajam` currently deviates from GP 0.6.5?


## Comment by @davxy

You're right, this is not compliant. Thank you for reporting.
In version 0.6.6, the authorizer params are changed to be only the core index, and the package can be fetched via the revised `fetch` host call, so we’ll leave implementation unchanged.

Compliant vectors will be included for v0.6.6 release
