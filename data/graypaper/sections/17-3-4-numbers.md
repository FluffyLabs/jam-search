---
type: graypaper_section
title: 3.4 Numbers
index: 17
---
$\N$ denotes the set of naturals including zero whereas $\Nmax{n}$ implies a restriction on that set to values less than $n$. Formally, $\N = \set{0, 1, \dots}$ and $\Nmax{n} = \set{\build{x}{x \in \N, x < n}}$.

$\Z$ denotes the set of integers. We denote $\Z\interval{a}{b}$ to be the set of integers within the interval $[a, b)$. Formally, $\Z\interval{a}{b} = \set{\build{x}{x \in \Z, a \le x < b}}$. E.g. $\Z\interval{2}{5} = \set{2, 3, 4}$. We denote the offset/length form of this set as $\Z\subrange{a}{b}$, a short form of $\Z\interval{a}{a+b}$.

It can sometimes be useful to represent lengths of sequences and yet limit their size, especially when dealing with sequences of octets which must be stored practically. Typically, these lengths can be defined as the set $\Nbits{32}$. To improve clarity, we denote $\bloblength$ as the set of lengths of octet sequences and is equivalent to $\Nbits{32}$.

We denote the $\rem$ operator as the modulo operator, e.g. $5 \rem 3 = 2$. Furthermore, we may occasionally express a division result as a quotient and remainder with the separator $\remainder$, e.g. $5 \div 3 = 1 \remainder 2$.
