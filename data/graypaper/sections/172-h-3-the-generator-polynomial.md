---
type: graypaper_section
title: H.3 The Generator Polynomial
index: 172
---
To erasure code $d = \fnecoriginalshards(v)$ message words into $v$ code words, let $d' = 2^{\ceil{\log_2 d}}$ and $v' = v + d' - d$. We index the code words by indices in $I$ as defined: $$I \equiv \Z\interval{0}{d} \cup \Z\interval{d'}{v'}$$ and deliver the code word at index $i \in I$ to validator $f(i)$, where: $$f(i) \equiv \begin{cases} i & i < d \\ i - (d' - d) & i \geq d' \end{cases}$$

Each index $i \in \Z\interval{0}{v'}$ is represented by the field element: $$\tilde{i} = \sum^{15}_{j = 0} i\sub{j} v\sub{j}$$ where $i = i_{15} \ldots i_0$ is the binary representation of $i$.

We represent each message word as a field element as described in the previous section and interpolate the polynomial $p(y)$ of maximum degree $d' - 1$ satisfying: $$\begin{array}{l}
     p (\tilde{0}) = \widetilde{m_0}\\
     p (\tilde{1}) = \widetilde{m_1}\\
     \vdots\\
     p (\widetilde{d-1}) = \widetilde{m_{d-1}}\\
     p (\tilde{\imath}) = 0 \quad \forall i \in \Z\interval{d}{d'}
   \end{array}$$

After finding $p(y)$, we evaluate it at the remaining indices in $I$, namely $i \in \Z\interval{d'}{v'}$. The code word at index $i \in I$ is $p(\tilde{i})$ and is delivered to validator $f(i)$.

Note that the code is systematic, i.e. $p(\tilde{i})$ is equal to $\widetilde{m_i}$ for $i < d$.
