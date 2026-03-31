---
type: graypaper_section
title: 11.1.3 Availability
index: 71
---
We define the set of *availability specifications*, $\avspec$, as the tuple of the work-package's hash $\asNpackagehash$, an auditable work bundle length $\asNbundlelen$ (see section 14.4.1 for more clarity on what this is), together with an erasure-root $\asNerasureroot$, a segment-root $\asNsegroot$ and segment-count $\asNsegcount$. Work-results include this availability specification in order to ensure they are able to correctly reconstruct and audit the purported ramifications of any reported work-package. Formally: $$\begin{aligned}
  
  \avspec &\equiv \tuple{
    \isa{\asNpackagehash}{\hash}\,,\;
    \isa{\asNbundlelen}{\bloblength}\,,\;
    \isa{\asNerasureroot}{\hash}\,,\;
    \isa{\asNsegroot}{\hash}\,,\;
    \isa{\asNsegcount}{\N}
  }\end{aligned}$$

The *erasure-root* ($\asNerasureroot$) is the root of a binary Merkle tree which functions as a commitment to all data required for the auditing of the report and for use by later work-packages should they need to retrieve any data yielded. It is thus used by assurers to verify the correctness of data they have been sent by guarantors, and it is later verified as correct by auditors. It is discussed fully in section 14.

The *segment-root* ($\asNsegroot$) is the root of a constant-depth, left-biased and zero-hash-padded binary Merkle tree committing to the hashes of each of the exported segments of each work-item. These are used by guarantors to verify the correctness of any reconstructed segments they are called upon to import for evaluation of some later work-package. It is also discussed in section 14.
