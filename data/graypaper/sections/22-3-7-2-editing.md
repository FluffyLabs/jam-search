---
type: graypaper_section
title: 3.7.2 Editing
index: 22
---
We define the sequence concatenation operator $\concat$ such that $\sq{\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{y}_0, \mathbf{y}_1, \dots} \equiv \mathbf{x} \concat \mathbf{y}$. For sequences of sequences, we define a unary concatenate-all operator: $\concatall{\mathbf{x}}\equiv\mathbf{x}_0 \concat \mathbf{x}_1 \concat \dots$. Further, we denote element concatenation as $x \append i \equiv x \concat \sq{i}$. We denote the sequence made up of the first $n$ elements of sequence $\mathbf{s}$ to be ${\overrightarrow{\mathbf{s}}}^n \equiv \sq{\mathbf{s}_0, \mathbf{s}_1, \dots, \mathbf{s}_{n-1}}$, and only the final elements as ${\overleftarrow{\mathbf{s}}}^n$.

We define ${}^\text{T}\mathbf{x}$ as the transposition of the sequence-of-sequences $\mathbf{x}$, fully defined in equation [eq:transpose]. We may also apply this to sequences-of-tuples to yield a tuple of sequences.

We denote sequence subtraction with a slight modification of the set subtraction operator; specifically, some sequence $\mathbf{s}$ excepting the left-most element equal to $v$ would be denoted $\mathbf{s}\seqminusl\set{v}$.
