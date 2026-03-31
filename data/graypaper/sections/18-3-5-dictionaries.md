---
type: graypaper_section
title: 3.5 Dictionaries
index: 18
---
A *dictionary* is a possibly partial mapping from some domain into some co-domain in much the same manner as a regular function. Unlike functions however, with dictionaries the total set of pairings are necessarily enumerable, and we represent them in some data structure as the set of all $\kv{key}{value}$ pairs. (In such data-defined mappings, it is common to name the values within the domain a *key* and the values within the co-domain a *value*, hence the naming.)

Thus, we define the formalism $\dictionary{\mathrm{K}}{\mathrm{V}}$ to denote a dictionary which maps from the domain $\mathrm{K}$ to the range $\mathrm{V}$. It is a subset of the power set of pairs $\tuple{K, V}$: $$\dictionary{\mathrm{K}}{\mathrm{V}} \subset \protoset{\tuple{\mathrm{K}, \mathrm{V}}}$$

The subset is caused by a constraint that a dictionary's members must associate at most one unique value for any given key $k$: $$\forall \mathrm{K}, \mathrm{V}, \mathbf{d} \in \dictionary{\mathrm{K}}{\mathrm{V}} : \forall \tup{k, v} \in \mathbf{d} : \exists! v' : \tup{k, v'} \in \mathbf{d}$$

In the context of a dictionary we denote the pairs with a mapping notation: $$\begin{aligned}
  &\dictionary{\mathrm{K}}{\mathrm{V}} \equiv \protoset{\keyvalue{\mathrm{K}}{\mathrm{V}}}\\
  &\mathbf{p} \in \keyvalue{\mathrm{K}}{\mathrm{V}} \Leftrightarrow \exists k \in \mathrm{K}, v \in \mathrm{V}, \mathbf{p} \equiv \kv{k}{v}\end{aligned}$$

This assertion allows us to unambiguously define the subscript and subtraction operator for a dictionary $d$: $$\begin{aligned}
  &\forall \mathrm{K}, \mathrm{V}, \mathbf{d} \in \dictionary{\mathrm{K}}{\mathrm{V}}: \mathbf{d}\subb{k} \equiv \begin{cases}
    v & \text{if}\ \exists k : \kv{k}{v} \in \mathbf{d} \\
    \none & \otherwise
  \end{cases}\\
  &\begin{aligned}
    &\forall \mathrm{K}, \mathrm{V}, \mathbf{d} \in \dictionary{\mathrm{K}}{\mathrm{V}}, \mathbf{s} \subseteq K:\\
    &\quad \mathbf{d} \setminus \mathbf{s} \equiv \set{ \kv{k}{v}: \kv{k}{v} \in \mathbf{d}, k \not\in \mathbf{s} }
  \end{aligned}\end{aligned}$$

Note that when using a subscript, it is an implicit assertion that the key exists in the dictionary. Should the key not exist, the result is undefined and any block which relies on it must be considered invalid.

To denote the active domain (i.e. set of keys) of a dictionary $\mathbf{d} \in \dictionary{K}{V}$, we use $\keys{\mathbf{d}} \subseteq K$ and for the range (i.e. set of values), $\values{\mathbf{d}} \subseteq V$. Formally: $$\begin{aligned}
  \forall \mathrm{K}, \mathrm{V}, \mathbf{d} \in \dictionary{\mathrm{K}}{\mathrm{V}} : \keys{\mathbf{d}} &\equiv \set{\build{k}{\exists v : \kv{k}{v} \in \mathbf{d}}} \\
  \forall \mathrm{K}, \mathrm{V}, \mathbf{d} \in \dictionary{\mathrm{K}}{\mathrm{V}} : \values{\mathbf{d}} &\equiv \set{\build{v}{\exists k : \kv{k}{v} \in \mathbf{d}}}\end{aligned}$$

Note that since the co-domain of $\values{}$ is a set, should different keys with equal values appear in the dictionary, the set will only contain one such value.

Dictionaries may be combined through the union operator $\cup$, which priorities the right-side operand in the case of a key-collision: $$\forall \mathbf{d} \in \mathrm{K}, \mathrm{V}, \tup{\mathbf{d}, \mathbf{e}} \in \dictionary{\mathrm{K}}{\mathrm{V}}^2 : \mathbf{d} \cup \mathbf{e} \equiv (\mathbf{d} \setminus \keys{\mathbf{e}}) \cup \mathbf{e}$$
