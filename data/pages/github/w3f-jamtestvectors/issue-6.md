---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/6'
title: '[Safrole] Tests use truncated BLAKE2b-512'
site: github.com/w3f/jamtestvectors
created_at: '2024-06-29T22:22:35.000Z'
last_modified: '2024-06-29T22:22:35.000Z'
---

# [Safrole] Tests use truncated BLAKE2b-512

## Issue by @ggwpez

The updated entropy accumulator is calculated by `BLAKE2b256(accumulator ++ vrf)` as per GP:  

![Screenshot 2024-06-30 at 00 14 49](https://github.com/w3f/jamtestvectors/assets/10380170/acf32bfa-6704-405b-9a33-faa886e09416)
![Screenshot 2024-06-30 at 00 15 08](https://github.com/w3f/jamtestvectors/assets/10380170/98b0ac6a-1316-4819-a85c-6f8ea175d900)

Using the following inputs:  
- Accumulator `0x2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c` from [here](https://github.com/w3f/jamtestvectors/blob/fa8699f94b2769cee5d05472072e6a5f839a57ed/safrole/enact-epoch-change-with-no-tickets-1.json#L10)  
- VRF `0xb2053e5a0852b9a5673f340d1cffe49f63f451e3b8b1e3b8d6c6ae731c888af1` from [here](https://github.com/w3f/jamtestvectors/blob/master/safrole/enact-epoch-change-with-no-tickets-1.json#L4)
- Concatenated  `0x2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904cb2053e5a0852b9a5673f340d1cffe49f63f451e3b8b1e3b8d6c6ae731c888af1`

Computing the Blake2b-256 hash of the concatenation yields:
`0xb137ecb42ed3fe7df0281a459acd05e486bea724205cfdddc0b30efa0086c52f`

as opposed to what is stated ↯:
`0x9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644` from [here](https://github.com/w3f/jamtestvectors/blob/fa8699f94b2769cee5d05472072e6a5f839a57ed/safrole/enact-epoch-change-with-no-tickets-1.json#L195) 

However, using Blake2b-512 and truncating it to 32 bytes does yield the stated output. Which leads me to the assumption that the 512 variant was used instead of the proper 256 variant.

Rust test for demonstration purpose:  
```rust
#[test]
fn hash_works() {
    let acc = array_bytes::hex2bytes("2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c").unwrap();
    let vrf = array_bytes::hex2bytes("b2053e5a0852b9a5673f340d1cffe49f63f451e3b8b1e3b8d6c6ae731c888af1").unwrap();
    
    let concat = vec![acc, vrf].concat();
    
    let correct = sp_core::blake2_256(&concat);
    assert_eq!(array_bytes::bytes2hex("", correct), "b137ecb42ed3fe7df0281a459acd05e486bea724205cfdddc0b30efa0086c52f");
    
    let incorrect = &sp_core::blake2_512(&concat)[..32];
    assert_eq!(array_bytes::bytes2hex("", incorrect), "9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644");
}
```
