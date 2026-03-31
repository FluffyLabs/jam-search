---
type: graypaper_section
title: 3.2 Functions and Operators
index: 15
---
We define the precedes relation to indicate that one term is defined in terms of another. E.g. $y \prec x$ indicates that $y$ may be defined purely in terms of $x$: $$\begin{aligned}

  y \prec x \Longleftrightarrow \exists f: y = f(x)\end{aligned}$$

The substitute-if-nothing function $\fnsubifnone$ is equivalent to the first argument which is not $\none$, or $\none$ if no such argument exists: $$\begin{aligned}

  \subifnone{a_0, \dots a\sub{n}} \equiv a\sub{x} : (a\sub{x} \ne \none \vee x = n), \bigwedge_{i=0}^{x-1} a\sub{i} = \none\end{aligned}$$ Thus, e.g. $\subifnone{\none, 1, \none, 2} = 1$ and $\subifnone{\none, \none} = \none$.
