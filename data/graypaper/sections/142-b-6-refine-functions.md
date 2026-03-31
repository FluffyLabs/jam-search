---
type: graypaper_section
title: B.6 Refine Functions
index: 142
---
These assume some refine context pair $\tup{\mathbf{m}, \mathbf{e}} \in \tuple{\dictionary{\N}{\pvmguest}, \sequence{\segment}}$, which are both initially empty. Other than the gas-counter which is explicitly defined, elements of PVM state are each assumed to remain unchanged by the host-call unless explicitly specified. $$\begin{aligned}
  \gascounter' &\equiv \gascounter - g\\
  \tup{\execst', \registers', \memory'} &\equiv \begin{cases}
    \tup{\oog, \registers, \memory} &\when \gascounter < g\\
    \tup{\blacktriangleright, \registers, \memory} \text{ except as indicated below} &\otherwise
  \end{cases}\end{aligned}$$

  ------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            
  **Identifier**            
  **Gas usage**             
  (lr)1-1(lr)2-2            
  `historical_lookup` = 6   
  $g = 10$                  $\begin{aligned}
                                \using \mathbf{a} &= \begin{cases}
                                  \mathbf{d}\subb{s} &\when \registers_7 = 2^{64} - 1 \wedge s \in \keys{\mathbf{d}} \\
                                  \mathbf{d}[\registers_7] &\when \registers_7 \in \keys{\mathbf{d}} \\
                                  \none &\otherwise
                                \end{cases} \\
                                \using \sq{h, o} &= \registers\subrange{8}{2} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \error &\when \Nrange{h}{32} \not\subseteq \readable{\memory} \\
                                  \none &\otherwhen \mathbf{a} = \none \\
                                  \histlookup(\mathbf{a}, t, \memory\subrange{h}{32}) &\otherwise \\
                                \end{cases} \\
                                \using f &= \min(\registers_{10}, \len{\mathbf{v}}) \\
                                \using l &= \min(\registers_{11}, \len{\mathbf{v}} - f) \\
                                \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                  \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                \end{cases}
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `export` = 7              
  $g = 10$                  $\begin{aligned}
                                \using p &= \registers_7 \\
                                \using z &= \min(\registers_8, \Csegmentsize) \\
                                \using \mathbf{x} &= \begin{cases}
                                  \zeropad{\Csegmentsize}{{\memory}\subrange{p}{z}} &\when \Nrange{p}{z} \subseteq \readable[\memory]\\
                                  \error &\otherwise
                                \end{cases}\\
                                \tup{\execst', \registers'_7, \mathbf{e}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{e}} &\when \mathbf{x} = \error \\
                                  \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{e}} &\otherwhen \segoff+\len{\mathbf{e}} \ge \Cmaxpackageexports \\
                                  \tup{\blacktriangleright, \segoff + \len{\mathbf{e}}, \mathbf{e} \append \mathbf{x}} &\otherwise
                                \end{cases}
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `machine` = 8             
  $g = 10$                  $\begin{aligned}
                                \using \sq{p_O, p_Z, i} &= \registers\subrange{7}{3} \\
                                \using \mathbf{p} &= \begin{cases}
                                  \memory\subrange{p_O}{p_Z} &\when \Nrange{p_O}{p_Z} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using n &= \min(n \in \N, n \not\in \keys{\mathbf{m}}) \\
                                \using \mathbf{u} &= \tup{\is{\ramNvalue}{[0, 0, \dots]},\is{\ramNaccess}{[\none, \none, \dots]}} \\
                                \tup{\execst', \registers'_7, \mathbf{m}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{m}} &\when \mathbf{p} = \error \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{m}} &\otherwhen \text{deblob}(\mathbf{p}) = \error \\
                                  \tup{\blacktriangleright, n, \mathbf{m} \cup \set{\kv{n}{\tup{\mathbf{p}, \mathbf{u}, i}}} } &\otherwise \\
                                \end{cases} \\
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `peek` = 9                
  $g = 10$                  $\begin{aligned}
                                \using \sq{n, o, s, z} &= \registers\subrange{7}{4} \\
                                \tup{\execst', \registers'_7, {\memory}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, {\memory}} &\when \Nrange{o}{z} \not\subseteq \writable[\memory] \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, {\memory}} &\otherwhen n \not\in \keys{\mathbf{m}} \\
                                  \tup{\blacktriangleright, \mathtt{OOB}, {\memory}} &\otherwhen \Nrange{s}{z} \not\subseteq \readable{\mathbf{m}\subb{n}_\pgNram} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, {\memory}'} &\otherwise \\
                                  \multicolumn{2}{l}{\where {\memory}' = {\memory}\exc {\memory}\subrange{o}{z} = (\mathbf{m}\subb{n}_\pgNram)\subrange{s}{z}}
                                \end{cases} \\
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `poke` = 10               
  $g = 10$                  $\begin{aligned}
                                \using \sq{n, s, o, z} &= \registers\subrange{7}{4} \\
                                \tup{\execst', \registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{m}} &\when \Nrange{s}{z} \not\subseteq \readable[\memory] \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{m}} &\otherwhen n \not\in \keys{\mathbf{m}} \\
                                  \tup{\blacktriangleright, \mathtt{OOB}, \mathbf{m}} &\otherwhen \Nrange{o}{z} \not\subseteq \writable{\mathbf{m}\subb{n}_\pgNram} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{m}'}  &\otherwise \\
                                  \multicolumn{2}{l}{\where \mathbf{m}' = \mathbf{m} \exc (\mathbf{m}'\subb{n}_\pgNram)\subrange{o}{z} = {\memory}\subrange{s}{z}}
                                \end{cases} \\
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `pages` = 11              
  $g = 10$                  $\begin{aligned}
                                \using \sq{n, p, c, r} &= \registers\subrange{7}{4} \\
                                \using \mathbf{u} &= \begin{cases}
                                  \mathbf{m}\subb{n}_\pgNram &\when n \in \keys{\mathbf{m}} \\
                                  \error &\otherwise\\
                                \end{cases} \\
                                \using \mathbf{u}' &= \mathbf{u} \exc \begin{cases}
                                  (\mathbf{u}'_\ramNvalue)_{p\Cpvmpagesize\dots+c\Cpvmpagesize} = \begin{cases}
                                   \sq{0, 0, \dots} &\when r < 3 \\
                                    (\mathbf{u}_\ramNvalue)_{p\Cpvmpagesize\dots+c\Cpvmpagesize} &\otherwise
                                  \end{cases} \\
                                  (\mathbf{u}'_\ramNaccess)\subrange{p}{c} = \begin{cases}
                                   \sq{\none, \none, \dots} &\when r = 0 \\
                                   \sq{\mathrm{R}, \mathrm{R}, \dots} &\when r = 1 \vee r = 3 \\
                                   \sq{\mathrm{W}, \mathrm{W}, \dots} &\when r = 2 \vee r = 4 \\
                                  \end{cases}
                                \end{cases}\\
                                \tup{\registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{m}} &\when \mathbf{u} = \error \\
                                  \tup{\mathtt{HUH}, \mathbf{m}} &\otherwhen r > 4 \vee p < 16 \vee p+c \ge \nicefrac{2^{32}}{\Cpvmpagesize} \\
                                  \tup{\mathtt{HUH}, \mathbf{m}} &\otherwhen r > 2 \wedge (\mathbf{u}_\ramNaccess)\subrange{p}{c} \ni \none \\
                                  \tup{\mathtt{OK}, \mathbf{m}'} &\otherwise\,,\ \where \mathbf{m}' = \mathbf{m} \exc \mathbf{m}'\subb{n}_\pgNram = \mathbf{u}' \\
                                \end{cases} \\
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `invoke` = 12             
  $g = 10$                  $\begin{aligned}
                                \using \sq{n, o} &= \registers_{7, 8} \\
                                \using \tup{g, \mathbf{w}} &= \begin{cases}
                                  \tup{g, \mathbf{w}}: \encode[8]{g} \concat \encode[8]{\mathbf{w}} = {\memory}\subrange{o}{112} &\when \Nrange{o}{112} \subseteq \writable{{\memory}} \\
                                  %\tup{\decode[8]{\memr\subrange{o}{8}}, \sq{\build{\decode[4]{\memr\subrange{o+8+8x}{8}}}{x \orderedin \Nmax{13}}}} &\when \Nrange{o}{60} \subset \writable_\mem} \\
                                  \tup{\error, \error} &\otherwise
                                \end{cases} \\
                                \using \tup{c, i', g', \mathbf{w}', \mathbf{u}'} &= \Psi(\mathbf{m}\subb{n}_\pgNcode, \mathbf{m}\subb{n}_\pgNpc, g, \mathbf{w}, \mathbf{m}\subb{n}_\pgNram)\\
                                \using {\memory}^* &= {\memory}\exc {\memory}^*\subrange{o}{112} = \encode[8]{g'} \concat \encode[8]{\mathbf{w}'}\\
                                \using \mathbf{m}^* &= \mathbf{m} \exc \begin{cases}
                                  \mathbf{m}^*\subb{n}_\pgNram = \mathbf{u}'\\
                                  \mathbf{m}^*\subb{n}_\pgNpc = \begin{cases}
                                    i' + \text{skip}(\imath') + 1 &\when c \in \set{ \host } \times \pvmreg\\
                                    i' &\otherwise
                                  \end{cases}
                                \end{cases}\\
                                \tup{\execst', \registers'_7, \registers'_8, {\memory}', \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \registers_8, {\memory}, \mathbf{m}} &\when g = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \registers_8, {\memory}, \mathbf{m}} &\otherwhen n \not\in \mathbf{m} \\
                                  \tup{\blacktriangleright, \mathtt{HOST}, h, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \host \times h \\
                                  \tup{\blacktriangleright, \mathtt{FAULT}, x, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \fault \times x \\
                                  \tup{\blacktriangleright, \mathtt{OOG}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \oog \\
                                  \tup{\blacktriangleright, \mathtt{PANIC}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \panic \\
                                  \tup{\blacktriangleright, \mathtt{HALT}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \halt \\
                                \end{cases} \\
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `expunge` = 13            
  $g = 10$                  $\begin{aligned}
                                \using n &= \registers_7 \\
                                \tup{\registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{m}} &\when n \not\in \keys{\mathbf{m}} \\
                                  \tup{\mathbf{m}\subb{n}_\pgNpc, \mathbf{m} \setminus n} &\otherwise \\
                                \end{cases} \\
                              \end{aligned}$
  ------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
