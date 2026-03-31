---
type: graypaper_section
title: 3.7.3 Boolean values
index: 23
---
$\bitstring[s]$ denotes the set of Boolean strings of length $s$, thus $\bitstring[s] = \sequence[s]{\bool}$. When dealing with Boolean values we may assume an implicit equivalence mapping to a bit whereby $\top = 1$ and $\bot = 0$, thus $\bitstring[\Box] = \sequence[\Box]{\N_2}$. We use the function $\text{bits}(\blob) \in \bitstring$ to denote the sequence of bits, ordered with the most significant first, which represent the octet sequence $\blob$, thus $\text{bits}(\sq{160, 0}) = \sq{1, 0, 1, 0, 0, \dots}$.

The unary-not operator applies to both boolean values and sequences of boolean values, thus $\neg \top = \bot$ and $\neg \sq{\top, \bot} = \sq{\bot, \top}$.
