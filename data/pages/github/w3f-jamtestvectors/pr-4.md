---
type: page
url: 'https://github.com/w3f/jamtestvectors/pull/4'
title: erasure coding test vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-06-24T15:10:17.000Z'
last_modified: '2024-06-24T15:10:17.000Z'
---

# erasure coding test vectors

## Pull Request by @cheme

This is test vector build from https://github.com/paritytech/erasure-coding/pull/15.
See `TODO` section of `README` for a few unknown.


## Comment by @sourabhniyogi

Hi @cheme!   We are seeing differences between JAM's graypaper Appendix H and your test vectors / Parity's implementation and have some questions below

1. We compiled the differences here:

|                               | JAM graypaper | Parity implementation (serialized) | Parity implementation (encode/decode) |
|-------------------------------|---------------|-------------------------------------|----------------------------------------|
| Shard Size                    | 2 bytes       | **12 bytes** ([src](https://github.com/paritytech/erasure-coding/blob/6c22e28a7402cfc75381e430483defe8189df486/tools/test_vectors/src/main.rs#L106))             | **192 bytes** ([src](https://github.com/paritytech/erasure-coding/blob/6c22e28a7402cfc75381e430483defe8189df486/src/subshard.rs#L314))               |
| K (original data)             | 342 shards    | 341.3333 shards (≈ 342)             | 342 shards                             |
| Original Data Size (Shard Size * K) | 684 bytes      | **4096 bytes**                         | **65664 bytes**                        |
| N (codewords)                 | 1026 shards   | 1026 shards                         | 1026 shards                            |

As the table shows, the "shard" was originally defined as "two octets" in Appendix H, which is equivalent to two bytes. However, the Parity implementation uses a different size, possibly due to the algorithm and package limitations.  The "K (original data)" and "N (codewords)" under both Parity's Implementation columns do not follow the definitions provided in the original paper. Instead, they likely refer to the number of original data shards and encoded data shards, respectively.    Can you explain this discrepancy?


2. Same Source, Same Limitations:  Both [ordian/reed-solomon-simd](https://github.com/ordian/reed-solomon-simd) (Rust, used in this repo) and AndersTrklauspost/reedsolomon (Go) are based on the [catid/leopard](https://github.com/catid/leopard) (C++) repository, which indeed uses algorithm proposed in the paper referenced by GP.  But these repos DO NOT include error detection and correction and specifically the parameters K and N (K:N) should each be a power of 2 (2^r) .... which is NOT what the GP has.

It seems the [catid/leopard](https://github.com/catid/leopard) repository uses a "shard" trick to handle this limitation. Therefore, for ordian/reed-solomon-simd (Rust) and [AndersTrklauspost/reedsolomon](https://github.com/klauspost/reedsolomon), are limited by the requirement that "shard size must be a multiple of 64 bytes. (see documentation)" instead of what the GP k:n parameters are, which are _not_ multiples of 64.  Can you explain this discrepancy?  What are we missing?

3. Also, FWIW, we have also verified this limitation with Yunghsiang S. Han, one of the original authors of the algorithm.   To natively overcome the "power of 2" limitation (without the "shard" trick), they proposed a successor algorithm: [Fast Encoding and Decoding Algorithms for Arbitrary (n,k) Reed-Solomon Codes Over 𝐹_{2^m}.](https://ieeexplore.ieee.org/document/8955804)    We have not yet found an implementation of this new algorithm and are wondering if its important to "modernize" to the above in GP or address the discrepancy above properly.  Let us know your thoughts on this!


Solved -- see below.



## Comment by @sourabhniyogi

For JAM Erasure Coding, the first actual test case everyone should use is: 
 https://gist.github.com/gavofyork/4cde92327cd91eff3e2ab91d316cb83a
The current version GP references Lin, Chung, and Han (2014) but this will be removed in favor of:
 D. G. Cantor, "On arithmetical algorithms over finite fields", Journal of Combinatorial Theory, Series A, vol. 50, no. 2, pp. 285-300, 1989.
compactly summarized as "Systematic Reed Solomon Finite-Field Erasure Codec, GF(2^16), Cantor basis 2"
The test vectors in the PR have 12-byte chunks and break up data into 4096-byte pieces, which is NOT compatible with the GP.  The GP calls for 2-byte chunks and 4104-byte pieces in Appendix H.

The Parity Rust library is sufficient to decode the first test case above:
 https://github.com/paritytech/erasure-coding/blob/main/src/lib.rs
Below is a test_reconstruct_from_json Rust test
 https://gist.github.com/sourabhniyogi/f448e213134c814d652d2eccf086bf53
you can add around here: 
 https://github.com/paritytech/erasure-coding/blob/main/src/lib.rs#L252
```
# cargo test test_reconstruct_from_json  -- --nocapture 
    Finished test [optimized + debuginfo] target(s) in 0.05s
     Running unittests src/lib.rs (/root/go/src/github.com/colorfulnotion/jam/erasurecoding/target/debug/deps/erasure_coding-d358172e1392b91c)
running 1 test
Reconstructed successfully! YAY
test tests::test_reconstruct_from_json ... ok
```
The test uses the last 342 2-byte chunks to reconstruct the first 684 2-byte chunks (684+342=1026),  and checks that the first 342 chunks match the original data.




## Comment by @cheme

Thanks (I see this conversation a bit late), the test vectors here are using a previous formulation, but I think it is the same (will check that next week, also will switch from base64 to hex). 
I encode 6 point at a time but it is the same 2 byte point I think (eg on the vector for 684 content size we see that there is a single point in the shards (remaning content is padding)).
I only keep 4096 as the 8 next byte are 0 paddings, but do not have to be indeed, but for the binary tree the blocks are 4096 so I probably did not write those 8 padding bytes in the vector.
The thing is that when checking a content we check a 4096 byte block in a binary tree proof (page proof), so code was initially written around this size (6 points). May make sense to rewrite it for 1 point only to match more closely the description, but I think the paper reffer to 6 points (12 bytes) at different places so maybe just a 1 point primitives is needed here.



## Comment by @sourabhniyogi

> Thanks (I see this conversation a bit late), the test vectors here are using a previous formulation, but I think it is the same (will check that next week, also will switch from base64 to hex). I encode 6 point at a time but it is the same 2 byte point I think (eg on the vector for 684 content size we see that there is a single point in the shards (remaning content is padding)). I only keep 4096 as the 8 next byte are 0 paddings, but do not have to be indeed, but for the binary tree the blocks are 4096 so I probably did not write those 8 padding bytes in the vector. The thing is that when checking a content we check a 4096 byte block in a binary tree proof (page proof), so code was initially written around this size (6 points). May make sense to rewrite it for 1 point only to match more closely the description, but I think the paper reffer to 6 points (12 bytes) at different places so maybe just a 1 point primitives is needed here.

I understand how the 6 points x 2 bytes/point=12 bytes needs clarification.  Probably 14.4's "Since the data for segment chunks is so small at 12 bytes, ..." needs some explanation.  Are there other references to 12 bytes you can identify?   

"W_S x W_C = 4104" is specified (684x6=342x32=4104=1026x4) in section 14 and I believe its non-negotiable.  If you wish to debate for 4096 because of page proofs, please make the case?


## Comment by @tomusdrw

@cheme do you mind adding `.json` extension to all the files within `./vectors` directory? That would help with syntax highlighting and editor support :)


## Comment by @cheme

:+1: note that for all binary tree there miss the $node describe in gp (not sure what it is and what it's meant for), probably will have to update at some point.


## Comment by @deadline314

Hi @cheme , I have some questions regarding the paged-proof. In the JAM's graypaper, it’s written that the `prefix(node)`^`left_hash`^`right_hash` are concatenated. However, in your paged-proof, I noticed that you used update(left) and update(right) to combine the two hashes.

I’m not sure if your method is intended to calculate the concatenation of the left and right node hashes, but in blake2b_simd, the update() function doesn’t seem to concatenate different inputs but instead processes data according to the data stream. Below is a comparison between using update() and concatenation.

**Combine:**
```
fn combine(left: Hash, right: Hash) -> Hash {
    let mut hasher = InnerHasher::new();

    hasher.update(left.0.as_slice());
    hasher.update(right.0.as_slice());

    let inner_hash: InnerHash = hasher.finalize();

    inner_hash.into()
}
```
**Concatenate:**
```
// Calculate the hash value of each chunk
let hash1 = hash_fn(&chunks[0]);
let hash2 = hash_fn(&chunks[1]);

// Combine the two hash values into a new vector
let mut combined_hashes = Vec::new();
combined_hashes.extend_from_slice(hash1.as_bytes());
combined_hashes.extend_from_slice(hash2.as_bytes());

// Rehash the combined hash values
let final_hash = hash_fn(&combined_hashes);
```


## Comment by @cheme

> I have some questions regarding the paged-proof. In the JAM's graypaper, it’s written that the prefix(node)^left_hash^right_hash are concatenated. However, in your paged-proof, I noticed that you used update(left) and update(right) to combine the two hashes.

yes as mentioned in readme this part is missing, I think in this case it is not a full prefix(node) but $leaf or $node. I was not too sure how what it was, ends up likely just b"leaf" or b"node" hardcoded (I feel like it is not strongly needed, likely here for hygiene).

Code producing this is likely to be removed/replaced , so probably in this PR only one that are ok are "ec_"* (not too sure the full work package ec is still correct with latest gp changes).

>  concatenation of the left and right node hashes,
 
yes I guess correct approach is concatenation with the additional b"leaf" and b"node" (I prefer multiple update but if appending b"leaf" b"node" concat will likely be similar).


## Comment by @gavofyork

Closing as stale.
