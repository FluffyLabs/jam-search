---
type: graypaper_section
title: 14.3.1 Exporting
index: 94
---
Any of a work-package's work-items may *export* segments and a *segments-root* is placed in the work-report committing to these, ordered according to the work-item which is exporting. It is formed as the root of a constant-depth binary Merkle tree as defined in equation [eq:constantdepthmerkleroot].

Guarantors are required to erasure-code and distribute two data sets: one blob, the auditable *bundle* containing the encoded work-package, extrinsic data and self-justifying imported segments which is placed in the short-term Audit DA store; and a second set of exported-segments data together with the *Paged-Proofs* metadata. Items in the first store are short-lived; assurers are expected to keep them only until finality of the block in which the availability of the work-result's work-package is assured. Items in the second, meanwhile, are long-lived and expected to be kept for a minimum of 28 days (672 complete epochs) following the reporting of the work-report. This latter store is referred to as the *Distributed, Decentralized, Data Lake* or D$^3$L owing to its large size.

We define the paged-proofs function $P$ which accepts a series of exported segments $\mathbf{s}$ and defines some series of additional segments placed into the D$^3$L via erasure-coding and distribution. The function evaluates to pages of hashes, together with subtree proofs, such that justifications of correctness based on a segments-root may be made from it: $$
  \!\!P\colon\abracegroup{
    \sequence{\segment} \to \,&\sequence{\segment} \\
    \mathbf{s} \mapsto \,&\sq{\build{
      \zeropad{l}{\encode{
        \var{\merklejustsubpath{6}{\mathbf{s}, i}},
        \var{\merklesubtreepage{6}{\mathbf{s}, i}}
      }}
    }{
      i \orderedin \Nmax{\ceil{\nicefrac{\len{\mathbf{s}}}{64}}}
    }} \\
    & \where l = \Csegmentsize
  }\!\!\!\!$$
