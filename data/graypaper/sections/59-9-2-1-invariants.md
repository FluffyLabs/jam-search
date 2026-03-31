---
type: graypaper_section
title: 9.2.1 Invariants
index: 59
---
The state of the lookup system naturally satisfies a number of invariants. Firstly, any preimage value must correspond to its hash, equation [eq:preimageconstraints]. Secondly, a preimage value being in state implies that its hash and length pair has some associated status, also in equation [eq:preimageconstraints]. Formally: $$
  \forall \mathbf{a} \in \serviceaccount, \kv{h}{\mathbf{d}} \in \mathbf{a}_\saNpreimages \Rightarrow
    h = \blake{\mathbf{d}}\wedge
    \tup{h , \len{\mathbf{d}}} \in \keys{\mathbf{a}_\saNrequests}$$
