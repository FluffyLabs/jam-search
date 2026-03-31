---
type: graypaper_section
title: E.2 Merkle Mountain Ranges and Belts
index: 162
---
The Merkle Mountain Range (MMR) is an append-only cryptographic data structure which yields a commitment to a sequence of values. Appending to an MMR and proof of inclusion of some item within it are both $O(\log(N))$ in time and space for the size of the set.

We define a Merkle Mountain Range as being within the set $\sequence{\optional{\hash}}$, a sequence of peaks, each peak the root of a Merkle tree containing $2^i$ items where $i$ is the index in the sequence. Since we support set sizes which are not always powers-of-two-minus-one, some peaks may be empty, $\none$ rather than a Merkle root.

Since the sequence of hashes is somewhat unwieldy as a commitment, Merkle Mountain Ranges are themselves generally hashed before being published. Hashing them removes the possibility of further appending so the range itself is kept on the system which needs to generate future proofs.

We define the MMB append function $\fnmmrappend$ as: $$\begin{aligned}
    
    \fnmmrappend&\colon\deffunc{
      \tuple{\sequence{\optional{\hash}}, \hash, \blob\to\hash} &\to \sequence{\optional{\hash}}\\
      \tup{\mathbf{r}, l, H} &\mapsto P(\mathbf{r}, l, 0, H)
    }\\
    \where P&\colon\deffunc{
      \tuple{\sequence{\optional{\hash}}, \hash, \N, \blob\to\hash} &\to \sequence{\optional{\hash}}\\
      \tup{\mathbf{r}, l, n, H} &\mapsto \begin{cases}
        \mathbf{r} \append l &\when n \ge \len{\mathbf{r}}\\
        R(\mathbf{r}, n, l) &\when n < \len{\mathbf{r}} \wedge \mathbf{r}\sub{n} = \none\\
        P(R(\mathbf{r}, n, \none), H(\mathbf{r}\sub{n} \concat l), n + 1, H) &\otherwise
      \end{cases}
    }\\
    \also R&\colon\deffunc{
      \tuple{\sequence{T}, \N, T} &\to \sequence{T}\\
      \tup{\mathbf{s}, i, v} &\mapsto \mathbf{s}'\ \where \mathbf{s}' = \mathbf{s} \exc \mathbf{s}'\sub{i} = v
    }
  \end{aligned}$$

We define the MMR encoding function as $\fnmmrencode$: $$\fnmmrencode\colon\deffunc{
    \sequence{\optional{\hash}} &\to \blob \\
    \mathbf{b} &\mapsto \encode{\var{\sq{\build{\maybe{x}}{x \orderedin \mathbf{b}}}}}
  }$$

We define the MMR super-peak function as $\fnmmrsuperpeak$: $$\fnmmrsuperpeak\colon\deffunc{
    \sequence{\optional{\hash}} &\to \hash \\
    \mathbf{b} &\mapsto \begin{cases}
      \zerohash &\when \len{\mathbf{h}} = 0\\
      \mathbf{h}_0 &\when \len{\mathbf{h}} = 1\\
      \keccak{\token{\$peak} \concat \mmrsuperpeak{\mathbf{h}_{\dots\len{\mathbf{h}}-1}} \concat \mathbf{h}_{\len{\mathbf{h}}-1}} &\otherwise \\
      \multicolumn{2}{l}{\where \mathbf{h} = \sq{\build{h}{h \orderedin \mathbf{b}, h \ne \none}}}
    \end{cases}
  }$$
