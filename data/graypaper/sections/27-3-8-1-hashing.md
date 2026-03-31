---
type: graypaper_section
title: 3.8.1 Hashing
index: 27
---
$\hash$ denotes the set of 256-bit values equivalent to $\blob[32]$. All hash functions in the present work output to this type and $\zerohash$ is the value equal to $\sq{0}_{32}$. We assume a function $\blake{m \in \blob} \in \hash$ denoting the Blake2b 256-bit hash introduced by [@rfc7693] and a function $\keccak{m \in \blob} \in \hash$ denoting the Keccak 256-bit hash as proposed by [@bertoni2013keccak] and utilized by [@wood2014ethereum].

The inputs of a hash function should be expected to be passed through our serialization codec $\mathcal{E}$ to yield an octet sequence to which the cryptography may be applied. (Note that an octet sequence conveniently yields an identity transform.) We may wish to interpret a sequence of octets as some other kind of value with the assumed decoder function $\decode{x \in \blob}$. In both cases, we may subscript the transformation function with the number of octets we expect the octet sequence term to have. Thus, $r = \mathcal{E}_4(x \in \N)$ would assert $x \in \Nbits{32}$ and $r \in \blob[4]$, whereas $s = \decode[8]{y}$ would assert $y \in \blob[8]$ and $s \in \Nbits{64}$.
