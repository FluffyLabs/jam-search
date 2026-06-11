---
type: graypaper_section
title: A.10 Gas Cost Tables
index: 137
---
For some of the instructions their cost depends on whether the destination register overlaps with any of the source registers:

$$\mathfrak{P}\colon \abracegroup{
    (\N, \N, \blob, \bitstring, \pvmreg) &\to \N\\
    (a, b, \mathbf{c}, \mathbf{k}, \imath) &\mapsto \begin{cases}
      a &\when \check{s}(\mathbf{c}, \mathbf{k}, \imath) \cap \check{r}(\mathbf{c}, \mathbf{k}, \imath) \neq \emptyset \\
      b &\otherwise
    \end{cases}
  }$$

For non-immediate shift and rotate instructions only the first source register matters:

$$\mathfrak{P}_{S}\colon \abracegrouptwo{
    (\N, \N, \blob, \bitstring, \pvmreg) &\to \N\\
    (a, b, \mathbf{c}, \mathbf{k}, \imath) &\mapsto \begin{cases}
      a &\when {\registers}_A = {\registers}_D \\
      b &\otherwise
    \end{cases}\\
  }{
    \[0.2pt]
    &\where (\mathbf{c}, \mathbf{k}, \imath) \mapsto ({\registers}_A, {\registers}_D) \text{ according to \ref{sec:programdecoding} and \ref{sec:instructiontables}} \\
  }$$

The cost of memory accesses is defined as follows:

$$\mathfrak{m} \equiv 25$$

The cost of a branch depends on whether any of its targets (either the jump target or the implicit fallthrough) point to an instruction byte which is equal to the opcode for the or the instruction; formally:

$$\mathfrak{b}\colon \abracegrouptwo{
    (\blob, \pvmreg) &\to \N\\
    (\mathbf{c}, \imath) &\mapsto \begin{cases}
      1 &\when \{ \zeta_{\imath + 1 + \text{skip}(\imath)}, \zeta_{\imath_{\text{target}}} \} \cap \{ \token{unlikely}, \token{trap} \} \neq \emptyset \\
      20 &\otherwise
    \end{cases}
  }{
    \[0.2pt]
    \where &\mathbf{c} \mapsto \zeta\text{ according to \ref{eq:instructions}}\\
      &\imath_{\text{target}} \text{ is the target of the branch according to \ref{sec:instructiontables}}
  }$$

In the following table the $\mathbf{c}$, $\mathbf{k}$, and $\imath$ arguments are omitted for clarity.

  --------- ---------------- -------------------------- --- --- --- --- ---
            0                1                          0   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}(1, 2)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   1                1                          1   0   0   0   0
  (lr)1-8   2                1                          2   0   0   0   0
  (lr)1-8   2                1                          2   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}_{S}(2, 3)$   1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}_{S}(2, 3)$   1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}_{S}(2, 3)$   1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}_{S}(2, 3)$   1   0   0   0   0
  (lr)1-8   1                $\mathfrak{P}_{S}(2, 3)$   1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}_{S}(3, 4)$   1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}_{S}(3, 4)$   1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}_{S}(3, 4)$   1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}_{S}(3, 4)$   1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}_{S}(3, 4)$   1   0   0   0   0
  (lr)1-8   1                3                          1   0   0   0   0
  (lr)1-8   1                3                          1   0   0   0   0
  (lr)1-8   1                3                          1   0   0   0   0
  (lr)1-8   1                3                          1   0   0   0   0
  (lr)1-8   2                4                          1   0   0   0   0
  (lr)1-8   2                4                          1   0   0   0   0
  (lr)1-8   2                4                          1   0   0   0   0
  (lr)1-8   2                4                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   3                3                          1   0   0   0   0
  (lr)1-8   2                2                          1   0   0   0   0
  (lr)1-8   2                2                          1   0   0   0   0
  (lr)1-8   2                3                          1   0   0   0   0
  (lr)1-8   2                3                          1   0   0   0   0
  (lr)1-8   3                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   3                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   3                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   3                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   $\mathfrak{m}$   1                          1   1   0   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   25               1                          1   0   1   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   $\mathfrak{b}$   1                          1   0   0   0   0
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   60               4                          1   0   0   0   1
  (lr)1-8   2                3                          1   0   0   0   0
  (lr)1-8   2                3                          1   0   0   0   0
  (lr)1-8   2                $\mathfrak{P}(2, 3)$       1   0   0   0   0
  (lr)1-8   2                3                          1   0   0   0   0
  (lr)1-8   3                4                          1   0   0   0   0
  (lr)1-8   1                1                          0   0   0   0   0
  (lr)1-8   1                2                          0   0   0   0   0
  (lr)1-8   3                $\mathfrak{P}(1, 2)$       1   0   0   1   0
  (lr)1-8   4                $\mathfrak{P}(2, 3)$       1   0   0   1   0
  (lr)1-8   3                $\mathfrak{P}(1, 2)$       1   0   0   1   0
  (lr)1-8   4                $\mathfrak{P}(2, 3)$       1   0   0   1   0
  (lr)1-8   4                4                          1   0   0   1   0
  (lr)1-8   4                4                          1   0   0   1   0
  (lr)1-8   6                4                          1   0   0   1   0
  (lr)1-8   2                1                          0   0   0   0   0
  (lr)1-8   2                1                          0   0   0   0   0
  (lr)1-8   40               1                          0   0   0   0   0
  (lr)1-8   15               1                          0   0   0   0   0
  (lr)1-8   15               1                          0   0   0   0   0
  (lr)1-8   22               1                          0   0   0   0   0
  (lr)1-8   22               1                          0   0   0   0   0
  (lr)1-8   100              4                          1   0   0   0   0
  --------- ---------------- -------------------------- --- --- --- --- ---
