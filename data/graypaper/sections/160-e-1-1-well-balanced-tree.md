---
type: graypaper_section
title: E.1.1 Well-Balanced Tree
index: 160
---
We define the well-balanced binary Merkle function as $\fnmerklizewb$: $$\fnmerklizewb\colon \abracegroup{
      
      \tuple{\sequence{\blob}, \blob \to \hash} &\to \hash \\
      \tup{\mathbf{v}, H} &\mapsto \begin{cases}
        H(\mathbf{v}_0) &\when \len{\mathbf{v}} = 1 \\
        N(\mathbf{v}, H) &\otherwise
      \end{cases} \\
    }$$

This is suitable for creating proofs on data which is not much greater than 32 octets in length since it avoids hashing each item in the sequence. For sequences with larger data items, it is better to hash them beforehand to ensure proof-size is minimal since each proof will generally contain a data item.

Note: In the case that no hash function argument $H$ is supplied, we may assume Blake 2b.
