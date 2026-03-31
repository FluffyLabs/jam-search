---
type: graypaper_section
title: H.3 The Generator Polynomial
index: 168
---
To erasure code a message of 342 words into 1023 code words, we represent each message as a field element as described in previous section and we interpolate the polynomial $p(y)$ of maximum 341 degree which satisfies the following equalities: $$\begin{array}{l}
     p (\tilde{0}) = \widetilde{m_0}\\
     p (\tilde{1}) = \widetilde{m_1}\\
     \vdots\\
     p (\widetilde{341}) = \widetilde{m_{341}}
   \end{array}$$

After finding $p(y)$ with such properties, we evaluate $p$ at the following points: $$\begin{array}{l}
     \widetilde{r_{342}} : = p (\widetilde{342})\\
     \widetilde{r_{343}} : = p (\widetilde{343})\\
     \vdots\\
     \widetilde{r_{1022}} : = p (\widetilde{1022})
   \end{array}$$

We then distribute the message words and the extra code words among the validators according to their corresponding indices.
