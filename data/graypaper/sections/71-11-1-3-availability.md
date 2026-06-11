---
type: graypaper_section
title: 11.1.3 Availability
index: 71
---
We define the set of *availability specifications*, $\avspec$, as the tuple of the work-package's hash $\asNpackagehash$, an auditable work bundle length $\asNbundlelen$ (see section 14.4.1 for more clarity on what this is), together with an erasure-root $\asNerasureroot$, the total number of erasure-coded chunks $\asNerasureshards$, a segment-root $\asNsegroot$ and segment-count $\asNsegcount$. Work-reports include this availability specification in order to ensure the original work-package is able to be correctly reconstructed and the purported ramifications audited. Formally: $$\begin{aligned}
  
  \avspec &\equiv \tuple{
    \isa{\asNpackagehash}{\hash}\,,\;
    \isa{\asNbundlelen}{\bloblength}\,,\;
    \isa{\asNerasureroot}{\hash}\,,\;
    \isa{\asNerasureshards}{\valcount}\,,\;
    \isa{\asNsegroot}{\hash}\,,\;
    \isa{\asNsegcount}{\N}
  }\end{aligned}$$

The *erasure-root* ($\asNerasureroot$) is the root of a binary Merkle tree whose leaves are the $\asNerasureshards$ chunks produced by erasure-coding the work-package bundle and exported segments. As one chunk is distributed to each assurer, the number of chunks must equal the size of the assuring validator set. The erasure-root functions as a commitment to all data required for the auditing of the report and for use by later work-packages should they need to retrieve any data yielded. It is thus used by assurers to verify the correctness of data they have been sent by guarantors, and it is later verified as correct by auditors. It is discussed fully in section 14.

The *segment-root* ($\asNsegroot$) is the root of a constant-depth, left-biased and zero-hash-padded binary Merkle tree committing to the hashes of each of the exported segments of each work-item. These are used by guarantors to verify the correctness of any reconstructed segments they are called upon to import for evaluation of some later work-package. It is also discussed in section 14.
