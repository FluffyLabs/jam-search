---
type: graypaper_section
title: H.1 Blob Encoding and Recovery
index: 168
---
We assume $v \in \valcount$ validators and some data blob $\mathbf{d} \in \blob[2k \cdot \fnecoriginalshards(v)], k \in \N$. This blob is split into a whole number of $k$ pieces, each a sequence of $\fnecoriginalshards(v)$ octet pairs. Each piece is erasure-coded using $\fnerasurecode{v}{}$ as above to give $v$ octet pairs per piece.

The resulting matrix is grouped by its pair-index and concatenated to form $v$ *chunks*, each of $k$ octet-pairs. Any $\fnecoriginalshards(v)$ of these chunks may then be used to reconstruct the original data $\mathbf{d}$.

Formally we begin by defining two utility functions for splitting some large sequence into a number of equal-sized sub-sequences and for reconstituting such subsequences back into a single large sequence: $$\begin{aligned}
  \forall n \in \N, k \in \N :\ &\text{split}_{n}(\mathbf{d} \in \blob[kn]) \in \sequence[k]{\blob[n]} \equiv \sq{\mathbf{d}\subrange{0}{n}, \mathbf{d}\subrange{n}{n}, \cdots, \mathbf{d}\subrange{(k-1)n}{n}} \\
  \forall n \in \N, k \in \N :\ &\text{join}(\mathbf{c} \in \sequence[k]{\blob[n]}) \in \blob[kn] \equiv \mathbf{c}_0 \concat \mathbf{c}_1 \concat \dots\end{aligned}$$

We define the transposition operator hence: $$
  {}^\text{T}\sq{\sq{\mathbf{x}_{0, 0}, \mathbf{x}_{0, 1}, \mathbf{x}_{0, 2}, \dots}, \sq{\mathbf{x}_{1, 0}, \mathbf{x}_{1, 1}, \dots}, \dots} \equiv \sq{\sq{\mathbf{x}_{0, 0}, \mathbf{x}_{1, 0}, \mathbf{x}_{2, 0}, \dots}, \sq{\mathbf{x}_{0, 1}, \mathbf{x}_{1, 1}, \dots}, \dots}$$

We may then define our erasure-code chunking function which accepts an arbitrary sized data blob whose length divides wholly into $2 \cdot \fnecoriginalshards(v)$ octets and results in a sequence of $v$ smaller blobs: $$
  \fnerasurecode{v \in \valcount}{k \in \N}\colon\abracegroup{
    \blob[2k \cdot \fnecoriginalshards(v)] &\to \sequence[v]{\blob[2k]} \\
    \mathbf{d} &\mapsto \text{join}^\#\left({}^{\text{T}}\sq{\build{\erasurecode{v}{}{\mathbf{p}}}{\mathbf{p} \orderedin {}^\text{T}\text{split}_{2}^\#(\text{split}_{2k}(\mathbf{d}))}}\right)
  }$$

The original data may be reconstructed with any $\fnecoriginalshards(v)$ of the $v$ resultant items (along with their indices). If the original $\fnecoriginalshards(v)$ items are known then reconstruction is just their concatenation. $$
  \fnecrecover{v \in \valcount}{k \in \N}\colon\abracegroup{
    \protoset{\tuple{\blob[2k], \Nmax{v}}}_{\fnecoriginalshards(v)} &\to \blob[2k \cdot \fnecoriginalshards(v)] \\
    \mathbf{c} &\mapsto \begin{cases}
      \encode{\sq{\build{\mathbf{x}}{\tup{\mathbf{x}, i} \orderedin \sqorderby{i}{\tup{\mathbf{x}, i} \in \mathbf{c}}}}} &\when \set{\build{i}{\tup{\mathbf{x}, i} \in \mathbf{c}}} = \Nmax{\fnecoriginalshards(v)}\\
      \text{join}(\text{join}^\#({}^\text{T}\sq{
        \build{
          \ecrecover{v}{}{{\set{\build{
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

Segment encoding/decoding may be done using the same functions albeit with a fixed $k = \nicefrac{\Csegmentsize}{2 \cdot \fnecoriginalshards(v)}$. Note that the definition of $\fnecoriginalshards$ ensures this is always an integer, i.e. no padding is required.
