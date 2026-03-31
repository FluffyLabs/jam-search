---
type: graypaper_section
title: 3.6 Tuples
index: 19
---
Tuples are groups of values where each item may belong to a different set. They are denoted with parentheses, e.g. the tuple $t$ of the naturals $3$ and $5$ is denoted $t = \tup{3, 5}$, and it exists in the set of natural pairs sometimes denoted $\N \times \N$, but denoted in the present work as $\tuple{\N, \N}$.

We have frequent need to refer to a specific item within a tuple value and as such find it convenient to declare a name for each item. E.g. we may denote a tuple with two named natural components $a$ and $b$ as $T = \tuple{\isa{a}{\N},\,\isa{b}{\N}}$. We would denote an item $t \in T$ through subscripting its name, thus for some $t = \tup{\is{a}{3},\,\is{b}{5}}$, $t_{a} = 3$ and $t_{b} = 5$.
