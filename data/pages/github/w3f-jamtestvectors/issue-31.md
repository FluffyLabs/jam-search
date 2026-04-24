---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/31'
title: BitSequence Encoding Mismatch with Test Vectors
site: github.com/w3f/jamtestvectors
created_at: '2025-01-12T12:09:28.000Z'
last_modified: '2025-01-12T12:09:28.000Z'
content_kind: issue
---

# BitSequence Encoding Mismatch with Test Vectors

## Issue by @prasad-kumkar

Found a small discrepancy in how we encode bit sequences compared to the JAM protocol spec (C.1.5). Our BitSequenceCodec is encoding `0x01` (`[False, True]`) as `0x02` while the test vectors expect `0x01`.

## Data

```
[
	{
		"anchor": "0x0cffbf67aae50aeed3c6f8f0d9bf7d854ffd87cef8358cbbaa587a9e3bd1a776",
		"bitfield": "0x01",
		"validator_index": 0,
		"signature": "0x2d8ec7b235be3b3cbe9be3d5ff36f082942102d64a0dc5953709a95cca55b58b1af297f534d464264be77477b547f3c596b947edbca33f6631f1aa188d25a38b"
	},
	{
		"anchor": "0x2398ce69c3585e1b1b574a5a7185a2a086350abd4606d15aace8b4610b494772",
		"bitfield": "0x01",
		"validator_index": 1,
		"signature": "0xdda7a577f150ee83afedc9d3b50a4f00fcf21248e6f73097abcc4bb634f854aedc53769838d294b09c0184fb0e66f09bae8cc243f842a6cc401488591e9ffdb1"
	}
]
```

## Current vs Expected
Current output:
```python
[False, True] -> 0x02
```

```
0*2**0 + 1*2**1 = 2
```

Expected in test vector:
```python
[False, True] -> 0x01
```
<img width="1495" alt="Screenshot 2025-01-12 at 5 29 38 PM" src="https://github.com/user-attachments/assets/bfa5dbe4-93cf-4e21-8d55-f819d7484323" />

## Impact
This affects the assurances extrinsic encoding tests, where we see mismatches at a few points in the encoded output.

## Root Cause
The bit packing order in our implementation seems to be slightly different from what's specified in C.1.5:

> We instead pack the bits into octets in order of least significant to most significant

<img width="795" alt="image" src="https://github.com/user-attachments/assets/2b0f2ce7-53a7-46d0-b07e-e202dadfe11d" />


## Next Steps
Happy to help review and update the bit packing logic in BitSequenceCodec to align with the spec. Let me know if you'd like me to propose a specific fix!


## Comment by @xlc

where do you find `[False, True] -> 0x01` in the test vector?


## Comment by @prasad-kumkar

@xlc I assumed `"bitfield": "0x01"` would be a bitsequence [0,1] i.e [False, True] for 2 core configuration 
https://graypaper.fluffylabs.dev/#/5b732de/145b00147600


## Comment by @xlc

Convert hex `0x01` to binary is `0x00000001` and convert that to bit string is `1, 0, 0, 0, 0, 0, 0, 0`


## Comment by @prasad-kumkar

Ah its a hexstring, that makes much more sense. Thank you @xlc 
