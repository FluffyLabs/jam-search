---
type: graypaper_section
title: A.5.6 Instructions with Arguments of One Register & One Immediate
index: 125
---
$$\begin{aligned}
    \using r_A &= \min(12, \zeta_{\imath+1} \bmod 16) \,,\quad&
    {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
    {\registers}'_A \equiv {\registers}'_{r_A} \\
    \using l_X &= \min(4, \max(0, \ell - 1)) \,,\quad&
    \nu_X &\equiv \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+2}{l_X}}}
\end{aligned}$$

  ------------ -- --- ------------------------------------------------------------------------------------
  50              1   $\token{djump}(({\registers}_A + \nu_X) \bmod 2^{32})$
  (lr)1-4 51      1   ${\registers}'_A = \nu_X$
  (lr)1-4 52      1   ${\registers}'_A = \cyclic{{\memory}}_{\nu_X}$
  (lr)1-4 53      1   ${\registers}'_A = \sext{1}{\cyclic{{\memory}}_{\nu_X}}$
  (lr)1-4 54      1   ${\registers}'_A = \decode[2]{\cyclic{{\memory}}\subrange{\nu_X}{2}}$
  (lr)1-4 55      1   ${\registers}'_A = \sext{2}{\decode[2]{\cyclic{{\memory}}\subrange{\nu_X}{2}}}$
  (lr)1-4 56      1   ${\registers}'_A = \decode[4]{\cyclic{{\memory}}\subrange{\nu_X}{4}}$
  (lr)1-4 57      1   ${\registers}'_A = \sext{4}{\decode[4]{\cyclic{{\memory}}\subrange{\nu_X}{4}}}$
  (lr)1-4 58      1   ${\registers}'_A = \decode[8]{\cyclic{{\memory}}\subrange{\nu_X}{8}}$
  (lr)1-4 59      1   $\cyclic{{\memory}'}_{\nu_X} = {\registers}_A \bmod 2^8$
  (lr)1-4 60      1   $\cyclic{{\memory}'}\subrange{\nu_X}{2} = \encode[2]{{\registers}_A \bmod 2^{16}}$
  (lr)1-4 61      1   $\cyclic{{\memory}'}\subrange{\nu_X}{4} = \encode[4]{{\registers}_A \bmod 2^{32}}$
  (lr)1-4 62      1   $\cyclic{{\memory}'}\subrange{\nu_X}{8} = \encode[8]{{\registers}_A}$
  ------------ -- --- ------------------------------------------------------------------------------------
