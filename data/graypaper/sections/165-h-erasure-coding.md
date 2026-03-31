---
type: graypaper_section
title: H Erasure Coding
index: 165
---
The foundation of the data-availability and distribution system of JAM is a systematic Reed-Solomon erasure coding function in GF($2^{16}$) of rate 342:1023, the same transform as done by the algorithm of [@lin2014novel]. We use a little-endian $\blob[2]$ form of the 16-bit GF points with a functional equivalence given by $\fnencode[2]$. From this we may assume the encoding function $\fnerasurecode: \sequence[342]{\blob[2]} \to \sequence[1023]{\blob[2]}$ and the recovery function $\fnecrecover: \protoset{\tuple{\blob[2], \Nmax{1023}}}_{342} \to \sequence[342]{\blob[2]}$. Encoding is done by extrapolating a data blob of size 684 octets (provided in $\fnerasurecode$ here as 342 octet pairs) into 1,023 octet pairs. Recovery is done by collecting together any distinct 342 octet pairs, together with their indices, and transforming this into the original sequence of 342 octet pairs.

Practically speaking, this allows for the efficient encoding and recovery of data whose size is a multiple of 684 octets. Data whose length is not divisible by 684 must be padded (we pad with zeroes). We use this erasure-coding in two contexts within the JAM protocol; one where we encode variable sized (but typically very large) data blobs for the Audit DA and block-distribution system, and the other where we encode much smaller fixed-size data *segments* for the Import DA system.

For the Import DA system, we deal with an input size of 4,104 octets resulting in data-parallelism of order six. We may attain a greater degree of data parallelism if encoding or recovering more than one segment at a time though for recovery, we may be restricted to requiring each segment to be formed from the same set of indices (depending on the specific algorithm).
