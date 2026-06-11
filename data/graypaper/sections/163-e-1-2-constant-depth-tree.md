---
type: graypaper_section
title: E.1.2 Constant-Depth Tree
index: 163
---
We define the constant-depth binary Merkle function as $\fnmerklizecd$. We define two corresponding functions for working with subtree pages, $\fnmerklejustsubpath{x}$ and $\fnmerklesubtreepage{x}$. The latter provides a single page of leaves, themselves hashed, prefixed data. The former provides the Merkle path to a single page. Both assume size-aligned pages of size $2^x$ and accept page indices. $$\begin{aligned}
  
  \fnmerklizecd&\colon \abracegroup{
    \tuple{\sequence{\blob}, \blob \to \hash} &\to \hash\\
    \tup{\mathbf{v}, H} &\mapsto N(C(\mathbf{v}, H), H)
  }\\
  
  \fnmerklejustsubpath{x}&\colon \abracegroup{
    \tuple{\sequence{\blob}, \Nmax{\len{\mathbf{v}}}, \blob \to \hash} &\to \sequence{\hash}\\
    \tup{\mathbf{v}, i, H} &\mapsto T(C(\mathbf{v}, H), 2^xi, H)_{\dots\max(0, \ceil{\log_2(\max(1, \len{\mathbf{v}})) - x})}
  }\\
  
  \fnmerklesubtreepage{x}&\colon \abracegroup{
    \tuple{\sequence{\blob}, \Nmax{\len{\mathbf{v}}}, \blob \to \hash} &\to \sequence{\hash}\\
    \tup{\mathbf{v}, i, H} &\mapsto \sq{\build{H(\token{\$leaf} \concat l)}{l \orderedin \mathbf{v}_{2^xi \dots \min(2^xi+2^x, \len{\mathbf{v}})}}}
  }\end{aligned}$$

For the latter justification $\fnmerklejustsubpath{x}$ to be acceptable, we must assume the target observer also knows not merely the value of the item at the given index, but also all other leaves within its $2^x$ size subtree, given by $\fnmerklesubtreepage{x}$.

As above, we may assume a default value for $H$ of Blake 2b.

For justifications and Merkle root calculations, a constancy preprocessor function $C$ is applied which hashes all data items with a fixed prefix "leaf" and then pads the overall size to the next power of two with the zero hash $\zerohash$: $$C\colon\abracegroup{
    \tuple{\sequence{\blob}, \blob \to \hash} &\to \sequence{\hash}\\
    \tup{\mathbf{v}, H} &\mapsto \mathbf{v}' \ \where \abracegroup[\;]{
      \len{\mathbf{v}'} &= 2^{\ceil{\log_2(\max(1, \len{\mathbf{v}}))}}\\
      \mathbf{v}'\sub{i} &= \begin{cases}
        H(\token{\$leaf} \concat \mathbf{v}\sub{i}) &\when i < \len{\mathbf{v}}\\
        \zerohash &\otherwise \\
      \end{cases}
    }
  }$$
