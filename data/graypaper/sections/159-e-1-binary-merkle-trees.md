---
type: graypaper_section
title: E.1 Binary Merkle Trees
index: 159
---
The Merkle tree is a cryptographic data structure yielding a hash commitment to a specific sequence of values. It provides $O(N)$ computation and $O(\log(N))$ proof size for inclusion. This *well-balanced* formulation ensures that the maximum depth of any leaf is minimal and that the number of leaves at that depth is also minimal.

The underlying function for our Merkle trees is the *node* function $N$, which accepts some sequence of blobs of some length $n$ and provides either such a blob back or a hash: $$N\colon\abracegroup{
    \tuple{\sequence{\blob[n]}, \blob \to \hash} &\to \blob[n] \cup \hash \\
    \tup{\mathbf{v}, H} &\mapsto \begin{cases}
      \zerohash &\when \len{\mathbf{v}} = 0 \\
      \mathbf{v}_0 &\when \len{\mathbf{v}} = 1 \\
      H(\token{\$node} \concat N(\mathbf{v}_{\dots\ceil{\nicefrac{\len{\mathbf{v}}}{2}}}, H) \concat N(\mathbf{v}_{\ceil{\nicefrac{\len{\mathbf{v}}}{2}}\dots}, H)) &\otherwise
    \end{cases}
  }$$

The astute reader will realize that if our $\blob[n]$ happens to be equivalent $\hash$ then this function will always evaluate into $\hash$. That said, for it to be secure care must be taken to ensure there is no possibility of preimage collision. For this purpose we include the hash prefix $\token{\$node}$ to minimize the chance of this; simply ensure any items are hashed with a different prefix and the system can be considered secure.

We also define the *trace* function $T$, which returns each opposite node from top to bottom as the tree is navigated to arrive at some leaf corresponding to the item of a given index into the sequence. It is useful in creating justifications of data inclusion. $$T\colon\abracegroup{
    \tuple{\sequence{\blob[n]}, \Nmax{\len{\mathbf{v}}}, \blob \to \hash}\ &\to \sequence{\blob[n] \cup \hash}\\
    \tup{\mathbf{v}, i, H} &\mapsto \begin{cases}
     \sq{N(P^\bot(\mathbf{v}, i), H)} \concat T(P^\top(\mathbf{v}, i), i - P_I(\mathbf{v}, i), H) &\when \len{\mathbf{v}} > 1\\
      \sq{} &\otherwise\\
      \multicolumn{2}{l}{
        \begin{aligned}
          \quad \where P^s(\mathbf{v}, i) &\equiv \begin{cases}
            \mathbf{v}_{\dots\ceil{\nicefrac{\len{\mathbf{v}}}{2}}} &\when (i < \ceil{\nicefrac{\len{\mathbf{v}}}{2}}) = s\\
            \mathbf{v}_{\ceil{\nicefrac{\len{\mathbf{v}}}{2}}\dots} &\otherwise
          \end{cases}\[4pt]
          \quad \also P_I(\mathbf{v}, i) &\equiv \begin{cases}
            0 &\when i < \ceil{\nicefrac{\len{\mathbf{v}}}{2}} \\
            \ceil{\nicefrac{\len{\mathbf{v}}}{2}} &\otherwise
          \end{cases}\\
        \end{aligned}
      }
    \end{cases}\\
  }$$

From this we define our other Merklization functions.
