---
type: graypaper_section
title: A.5.7 Instructions with Arguments of One Register & Two Immediates
index: 126
---
$$\begin{aligned}
    \using r_A &= \min(12, \zeta_{\imath+1} \bmod 16) \,,\quad&
    {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
    {\registers}'_A \equiv {\registers}'_{r_A} \\
    \using l_X &= \min(4, \ffrac{\zeta_{\imath+1}}{16} \bmod 8) \,,\quad&
    \nu_X &= \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+2}{l_X}}} \\
    \using l_Y &= \min(4, \max(0, \ell - l_X - 1)) \,,\quad&
    \nu_Y &= \sext{l_Y}{\decode[l_Y]{\zeta\subrange{\imath+2+l_X}{l_Y}}}
\end{aligned}$$

  ------------ -- --- --------------------------------------------------------------------------------------------
  70              1   $\cyclic{{\memory}'}_{{\registers}_A + \nu_X} = \nu_Y \bmod 2^8$
  (lr)1-4 71      1   $\cyclic{{\memory}'}\subrange{{\registers}_A + \nu_X}{2} = \encode[2]{\nu_Y \bmod 2^{16}}$
  (lr)1-4 72      1   $\cyclic{{\memory}'}\subrange{{\registers}_A + \nu_X}{4} = \encode[4]{\nu_Y \bmod 2^{32}}$
  (lr)1-4 73      1   $\cyclic{{\memory}'}\subrange{{\registers}_A + \nu_X}{8} = \encode[8]{\nu_Y}$
  ------------ -- --- --------------------------------------------------------------------------------------------
