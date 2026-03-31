---
type: graypaper_section
title: 3.7.1 Construction
index: 21
---
We may wish to define a sequence in terms of incremental subscripts of other values: $\sq{\mathbf{x}_0, \mathbf{x}_1, \dots }\sub{\dots n}$ denotes a sequence of $n$ values beginning $\mathbf{x}_0$ continuing up to $\mathbf{x}_{n-1}$. Furthermore, we may also wish to define a sequence as elements each of which are a function of their index $i$; in this case we denote $\sq{\build{f(i)}{i \orderedin \Nmax{n}}} \equiv \sq{f(0), f(1), \dots, f(n - 1)}$. Thus, when the ordering of elements matters we use $\orderedin$ rather than the unordered notation $\in$. The latter may also be written in short form $\sq{f(i \orderedin \Nmax{n})}$. This applies to any set which has an unambiguous ordering, particularly sequences, thus $\sq{\build{i^2}{i \orderedin \sq{1, 2, 3}}} = \sq{1, 4, 9}$. Multiple sequences may be combined, thus $\sq{\build{i \cdot j}{i \orderedin \sq{1, 2, 3}, j \orderedin \sq{2, 3, 4}}} = \sq{2, 6, 12}$.

As with sets, we use explicit notation $f^{\#}$ to denote a function mapping over all items of a sequence.

Sequences may be constructed from sets or other sequences whose order should be ignored through sequence ordering notation $\sqorderby{f(i)}{i \in X}$, which is defined to result in the set or sequence of its argument except that all elements $i$ are placed in ascending order of the corresponding value $f(i)$.

The key component may be elided in which case it is assumed to be ordered by the elements directly; i.e. $\order{i \in X} \equiv \sqorderby{i}{i \in X}$. $\sqorderuniqby{i}{i \in X}$ does the same, but excludes any duplicate values of $i$. E.g. assuming $\mathbf{s} = \sq{1, 3, 2, 3}$, then $\sqorderuniqby{i}{i \in \mathbf{s}} = \sq{1, 2, 3}$ and $\sqorderby{-i}{i \in \mathbf{s}} = \sq{3, 3, 2, 1}$.

Sets may be constructed from sequences with the regular set construction syntax, e.g. assuming $\mathbf{s} = \sq{1, 2, 3, 1}$, then $\set{\build{a}{a \in \mathbf{s}}}$ would be equivalent to $\set{1, 2, 3}$.

Sequences of values which themselves have a defined ordering have an implied ordering akin to a regular dictionary, thus $\sq{1, 2, 3} < \sq{1, 2, 4}$ and $\sq{1, 2, 3} < \sq{1, 2, 3, 1}$.
