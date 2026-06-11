---
type: graypaper_section
title: D.2.1 Node Encoding and Trie Identification
index: 159
---
We identify (sub-)tries as the hash of their root node, with one exception: empty (sub-)tries are identified as the zero-hash, $\zerohash$.

Nodes are fixed in size at 512 bit (64 bytes). Each node is either a branch or a leaf. The first bit discriminate between these two types.

In the case of a branch, the remaining 511 bits are split between the two child node hashes, using the last 255 bits of the 0-bit (left) sub-trie identity and the full 256 bits of the 1-bit (right) sub-trie identity.

Leaf nodes are further subdivided into embedded-value leaves and regular leaves. The second bit of the node discriminates between these.

In the case of an embedded-value leaf, the remaining 6 bits of the first byte are used to store the embedded value size. The following 31 bytes are dedicated to the state key. The last 32 bytes are defined as the value, filling with zeroes if its length is less than 32 bytes.

In the case of a regular leaf, the remaining 6 bits of the first byte are zeroed. The following 31 bytes store the state key. The last 32 bytes store the hash of the value.

Formally, we define the encoding functions $B$ and $L$: $$\begin{aligned}
  B&\colon\abracegroup{
    \tuple{\hash, \hash} &\to \bitstring[512]\\
    \tup{l, r} &\mapsto \sq{0} \concat \text{bits}(l)\interval{1}{} \concat \text{bits}(r)
  }\\
  L&\colon\abracegroup{
    \tuple{\blob[31], \blob} &\to \bitstring[512]\\
    \tup{k, v} &\mapsto \begin{cases}
      \sq{1, 0} \concat \text{bits}(\encode[1]{\len{v}})\interval{2}{} \concat \text{bits}(k) \concat \text{bits}(v) \concat \sq{0, 0, \dots} &\when \len{v} \le 32\\
      \sq{1, 1, 0, 0, 0, 0, 0, 0} \concat \text{bits}(k) \concat \text{bits}(\blake{v}) &\otherwise
    \end{cases}
  }\end{aligned}$$

We may then define the basic Merklization function $\fnmerklizestate$ as: $$\begin{aligned}
  \merklizestate{\thestate} &\equiv M(\set{\build{\kv{\text{bits}(k)}{\tup{k, v}}}{\kv{k}{v} \in T(\thestate) }})\\
  M(d: \dictionary{\bitstring}{\tuple{\blob[31], \blob}}) &\equiv \begin{cases}
    \zerohash &\when \len{d} = 0\\
    \blake{\text{bits}^{-1}(L(k, v))} &\when \values{d} = \set{ \tup{k, v} }\\
    \blake{\text{bits}^{-1}(B(M(l), M(r)))} &\otherwise\\
    \multicolumn{2}{l}{\quad\where \forall b, p: \kv{b}{p} \in d \Leftrightarrow \kv{b\interval{1}{}}{p} \in \begin{cases}
      l &\when b_0 = 0 \\
      r &\when b_0 = 1
    \end{cases}
  }\end{cases}\end{aligned}$$
