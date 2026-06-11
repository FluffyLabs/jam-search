---
type: graypaper_section
title: 3.7 Sequences
index: 20
---
A sequence is a series of elements with particular ordering not dependent on their values. The set of sequences of elements all of which are drawn from some set $T$ is denoted $\sequence{T}$, and it defines a partial mapping $\N \to T$. The set of sequences containing exactly $n$ elements each a member of the set $T$ may be denoted $\sequence[n]{T}$ and accordingly defines a complete mapping $\Nmax{n} \to T$. Similarly, sets of sequences of at most $n$ elements and at least $n$ elements may be denoted $\sequence[:n]{T}$ and $\sequence[n:]{T}$ respectively. Finally, the set of sequences with length in set $N$ may be denoted $\sequence[N]{T}$.

Sequences are subscriptable, thus a specific item at index $i$ within a sequence $\mathbf{s}$ may be denoted $\mathbf{s}\subb{i}$, or where unambiguous, $\mathbf{s}\sub{i}$. A range may be denoted using an ellipsis for example: $\sq{0, 1, 2, 3}\sub{\dots2} = \sq{0, 1}$ and $\sq{0, 1, 2, 3}\sub{1\dots+2} = \sq{1, 2}$. The length of such a sequence may be denoted $\len{\mathbf{s}}$.

We denote modulo subscription as $\cyclic{\mathbf{s}\subb{i}} \equiv \mathbf{s}[\,i \rem \len{\mathbf{s}}\,]$. We denote the final element $x$ of a sequence $\mathbf{s} = \sq{..., x}$ through the function $\text{last}(\mathbf{s}) \equiv x$.
