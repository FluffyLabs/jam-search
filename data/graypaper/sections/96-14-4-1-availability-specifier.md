---
type: graypaper_section
title: 14.4.1 Availability Specifier
index: 96
---
We define the availability specifier function $A$, which creates an availability specifier from the package hash, an octet sequence of the audit-friendly work-package bundle, the sequence of exported segments, and the size of the assuring validator set: $$\!\!\!
  A\colon\abracegroup[\,]{
    \tuple{\hash, \blob, \sequence{\segment}, \valcount} &\to \avspec\\
    \tup{\asNpackagehash, \mathbf{b},\,\mathbf{s}, \asNerasureshards} &\mapsto \tup{
      \asNpackagehash,\,
      \is{\asNbundlelen}{\len{\mathbf{b}}},\,
      \asNerasureroot,\,
      \asNerasureshards,\,
      \is{\asNsegroot}{\merklizecd{\mathbf{s}}},\,
      \is{\asNsegcount}{\len{\mathbf{s}}}
    }
  }\!\!\!\!\!$$ $$\begin{aligned}
  \where \asNerasureroot &= \merklizewb{
    \sq{\build{\concatall{\mathbf{x}}}{\mathbf{x} \orderedin \transpose \sq{\mathbf{b}^\clubsuit, \mathbf{s}^\clubsuit}}}
  }\\
  \also \mathbf{b}^\clubsuit &= \blakemany{\erasurecode{\asNerasureshards}{\ceil{\nicefrac{\len{\mathbf{b}}}{z}}}{\zeropad{z}{\mathbf{b}}}}\\
  \also \mathbf{s}^\clubsuit &= \merklizewbmany{\transpose\erasurecodemany{\asNerasureshards}{\nicefrac{\Csegmentsize}{z}}{\mathbf{s} \concat P(\mathbf{s})}}\\
  \also z &= 2 \cdot \fnecoriginalshards(\asNerasureshards)\end{aligned}$$

The paged-proofs function $P$, defined earlier in equation [eq:pagedproofs], accepts a sequence of segments and returns a sequence of paged-proofs sufficient to justify the correctness of every segment. There are exactly $\ceil{\nicefrac{1}{64}}$ paged-proof segments as the number of yielded segments, each composed of a page of 64 hashes of segments, together with a Merkle proof from the root to the subtree-root which includes those 64 segments.

The functions $\fnmerklizecd$ and $\fnmerklizewb$ are the fixed-depth and simple binary Merkle root functions, defined in equations [eq:constantdepthmerkleroot] and [eq:simplemerkleroot]. The functions $\fnerasurecode{}{}$ and $\fnecoriginalshards$ are the erasure-coding and original-chunk-count functions, defined in appendix 31.

And $\fnzeropad{}$ is the zero-padding function to take an octet array to some multiple of $n$ in length: $$
  \fnzeropad{n \in \Nclamp{1}{}}\colon\abracegroup{
    \blob &\to \blob[k \cdot n]\\
    \mathbf{x} &\mapsto \mathbf{x} \concat \sq{0, 0, \dots}\interval{((\len{x} + n - 1) \bmod n) + 1}{n}
  }$$

Validators are incentivized to distribute each newly erasure-coded data chunk to the relevant validator, since they are not paid for guaranteeing unless a work-report is considered to be *available* by a super-majority of validators. Given our work-package $\mathbf{p}$, we should therefore send the corresponding work-package bundle chunk and exported segments chunks to each validator, together with proofs such that each validator can justify completeness according to the work-report's *erasure-root*. In the case of a coming epoch change, they may also maximize expected reward by distributing to the new validator set. Note that as erasure-coding depends on the size of the assuring validator set, distribution to two validator sets of different sizes necessitates performing erasure-coding twice and production of two distinct work-reports, only one of which may be reported on-chain.

We will see this function utilized in the next sections, for guaranteeing, auditing and judging.
