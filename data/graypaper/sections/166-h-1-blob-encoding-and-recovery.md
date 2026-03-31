---
type: graypaper_section
title: H.1 Blob Encoding and Recovery
index: 166
---
We assume some data blob $\mathbf{d} \in \blob[684k], k \in \N$. This blob is split into a whole number of $k$ pieces, each a sequence of 342 octet pairs. Each piece is erasure-coded using $\fnerasurecode$ as above to give 1,023 octet pairs per piece.

The resulting matrix is grouped by its pair-index and concatenated to form 1,023 *chunks*, each of $k$ octet-pairs. Any 342 of these chunks may then be used to reconstruct the original data $\mathbf{d}$.

Formally we begin by defining two utility functions for splitting some large sequence into a number of equal-sized sub-sequences and for reconstituting such subsequences back into a single large sequence: $$\begin{aligned}
  \forall n \in \N, k \in \N :\ &\text{split}_{n}(\mathbf{d} \in \blob[kn]) \in \sequence[k]{\blob[n]} \equiv \sq{\mathbf{d}\subrange{0}{n}, \mathbf{d}\subrange{n}{n}, \cdots, \mathbf{d}\subrange{(k-1)n}{n}} \\
  \forall n \in \N, k \in \N :\ &\text{join}(\mathbf{c} \in \sequence[k]{\blob[n]}) \in \blob[kn] \equiv \mathbf{c}_0 \concat \mathbf{c}_1 \concat \dots\end{aligned}$$

We define the transposition operator hence: $$
  {}^\text{T}\sq{\sq{\mathbf{x}_{0, 0}, \mathbf{x}_{0, 1}, \mathbf{x}_{0, 2}, \dots}, \sq{\mathbf{x}_{1, 0}, \mathbf{x}_{1, 1}, \dots}, \dots} \equiv \sq{\sq{\mathbf{x}_{0, 0}, \mathbf{x}_{1, 0}, \mathbf{x}_{2, 0}, \dots}, \sq{\mathbf{x}_{0, 1}, \mathbf{x}_{1, 1}, \dots}, \dots}$$

We may then define our erasure-code chunking function which accepts an arbitrary sized data blob whose length divides wholly into 684 octets and results in a sequence of 1,023 smaller blobs: $$
  \fnerasurecode_{k \in \N}\colon\abracegroup{
    \blob[684k] &\to \sequence[1023]{\blob[2k]} \\
    \mathbf{d} &\mapsto \text{join}^\#({}^{\text{T}}\sq{\build{\erasurecode{\mathbf{p}}}{\mathbf{p} \orderedin {}^\text{T}\text{split}_{2}^\#(\text{split}_{2k}(\mathbf{d}))}})
  }$$

The original data may be reconstructed with any 342 of the 1,023 resultant items (along with their indices). If the original 342 items are known then reconstruction is just their concatenation. $$
  \fnecrecover_{k \in \N}\colon\abracegroup{
    \protoset{\tuple{\blob[2k], \Nmax{1023}}}_{342} &\to \blob[684k] \\
    \mathbf{c} &\mapsto \begin{cases}
      \encode{\sq{\build{\mathbf{x}}{\tup{\mathbf{x}, i} \orderedin \sqorderby{i}{\tup{\mathbf{x}, i} \in \mathbf{c}}}}} &\when \set{\build{i}{\tup{\mathbf{x}, i} \in \mathbf{c}}} = \Nmax{342}\\
      \text{join}(\text{join}^\#({}^\text{T}\sq{
        \build{
          \ecrecover{{\set{\build{
           (\text{split}_{2}(\mathbf{x})\sub{p}, i)
          }{
            \tup{\mathbf{x}, i} \in \mathbf{c}
          }}}}
        }{
          p \in \Nmax{k}
        }
      })) &\text{always}\\
    \end{cases}
  }$$

Segment encoding/decoding may be done using the same functions albeit with a constant $k = 6$.
