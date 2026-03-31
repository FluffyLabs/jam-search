---
type: graypaper_section
title: A.5.4 Instructions with Arguments of Two Immediates
index: 123
---
$$\begin{aligned}
    \using l_X &= \min(4, \zeta_{\imath+1} \bmod 8) \,,\quad&
    \nu_X &\equiv \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+2}{l_X}}} \\
    \using l_Y &= \min(4, \max(0, \ell - l_X - 1)) \,,\quad&
    \nu_Y &\equiv \sext{l_Y}{\decode[l_Y]{\zeta\subrange{\imath+2+l_X}{l_Y}}}
\end{aligned}$$

  ------------ -- --- ---------------------------------------------------------------------------
  30              1   $\cyclic{{\memory}'}_{\nu_X} = \nu_Y \bmod 2^8$
  (lr)1-4 31      1   $\cyclic{{\memory}'}\subrange{\nu_X}{2} = \encode[2]{\nu_Y \bmod 2^{16}}$
  (lr)1-4 32      1   $\cyclic{{\memory}'}\subrange{\nu_X}{4} = \encode[4]{\nu_Y \bmod 2^{32}}$
  (lr)1-4 33      1   $\cyclic{{\memory}'}\subrange{\nu_X}{8} = \encode[8]{\nu_Y}$
  ------------ -- --- ---------------------------------------------------------------------------
