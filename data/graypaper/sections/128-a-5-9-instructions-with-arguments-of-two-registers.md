---
type: graypaper_section
title: A.5.9 Instructions with Arguments of Two Registers
index: 128
---
$$\begin{aligned}
  \using r_D &= \min(12, (\zeta_{\imath+1}) \bmod 16) \,,\quad&
  {\registers}_D &\equiv {\registers}_{r_D} \,,\quad
  {\registers}'_D \equiv {\registers}'_{r_D} \\
  \using r_A &= \min(12, \ffrac{\zeta_{\imath+1}}{16}) \,,\quad&
  {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
  {\registers}'_A \equiv {\registers}'_{r_A} \\
\end{aligned}$$

  ------------- -- -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  100              ${\registers}'_D = {\registers}_A$
  (lr)1-3 101      $\displaystyle{\registers}'_D = \sum_{i = 0}^{63}\fnoctetstobits_{8}({\registers}_A)\sub{i}$
  (lr)1-3 102      $\displaystyle{\registers}'_D = \sum_{i = 0}^{31}\fnoctetstobits_{4}({\registers}_A \bmod 2^{32})\sub{i}$
  (lr)1-3 103      $\displaystyle{\registers}'_D = \max(n \in \Nmax{65})\ \where \sum_{i = 0}^{i < n} \overleftarrow{\fnoctetstobits}_{8}({\registers}_A)\sub{i} = 0$
  (lr)1-3 104      $\displaystyle{\registers}'_D = \max(n \in \Nmax{33})\ \where \sum_{i = 0}^{i < n} \overleftarrow{\fnoctetstobits}_{4}({\registers}_A \bmod 2^{32})\sub{i} = 0$
  (lr)1-3 105      $\displaystyle{\registers}'_D = \max(n \in \Nmax{65})\ \where \sum_{i = 0}^{i < n} \fnoctetstobits_{8}({\registers}_A)\sub{i} = 0$
  (lr)1-3 106      $\displaystyle{\registers}'_D = \max(n \in \Nmax{33})\ \where \sum_{i = 0}^{i < n} \fnoctetstobits_{4}({\registers}_A \bmod 2^{32})\sub{i} = 0$
  (lr)1-3 107      ${\registers}'_D = \unsigned{\signedn{1}{{\registers}_A \bmod 2^8}}$
  (lr)1-3 108      ${\registers}'_D = \unsigned{\signedn{2}{{\registers}_A \bmod 2^{16}}}$
  (lr)1-3 109      ${\registers}'_D = {\registers}_A \bmod 2^{16}$
  (lr)1-3 110      $\forall i \in \N_8 : \encode[8]{{\registers}'_D}\sub{i} = \encode[8]{{\registers}_A}_{7-i}$
  ------------- -- -----------------------------------------------------------------------------------------------------------------------------------------------------------------
