---
type: graypaper_section
title: H.3 The Generator Polynomial
index: 170
---
To erasure code a message of $d = \fnecoriginalshards(v)$ words into $v$ code words, we represent each message as a field element as described in previous section and we interpolate the polynomial $p(y)$ of maximum $d - 1$ degree which satisfies the following equalities: $$\begin{array}{l}
     p (\tilde{0}) = \widetilde{m_0}\\
     p (\tilde{1}) = \widetilde{m_1}\\
     \vdots\\
     p (\widetilde{d-1}) = \widetilde{m_{d-1}}
   \end{array}$$

After finding $p(y)$ with such properties, we evaluate $p$ at the following points: $$\begin{array}{l}
     \widetilde{r_d} : = p (\widetilde{d})\\
     \widetilde{r_{d+1}} : = p (\widetilde{d+1})\\
     \vdots\\
     \widetilde{r_{v-1}} : = p (\widetilde{v-1})
   \end{array}$$

We then distribute the message words and the extra code words among the validators according to their corresponding indices.
