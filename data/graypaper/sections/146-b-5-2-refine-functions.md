---
type: graypaper_section
title: B.5.2 Refine Functions
index: 146
---
These assume some refine context triple $\tup{\mathbf{m}, \pvmNmoduleNmap, \mathbf{e}} \in \tuple{\dictionary{\N}{\pvmNinstance}, \dictionary{\N}{\pvmNmodule}, \sequence{\segment}}$, which are all initially empty. $$\context \equiv \tup{\mathbf{m}, \pvmNmoduleNmap, \mathbf{e}}\ ,\qquad \context' \equiv \tup{\mathbf{m}', \pvmNmoduleNmap', \mathbf{e}'}$$

  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            
  **Identifier**            
  **Gas usage (**$g$**)**   
  (lr)1-1(lr)2-2            
  `historical_lookup` = 7   $\begin{aligned}
                                \using \mathbf{a} &= \begin{cases}
                                  \mathbf{d}\subb{s} &\when \registers_7 = 2^{64} - 1 \\
                                  \mathbf{d}[\registers_7] &\otherwise
                                \end{cases} \\
                                \using \sq{h, o} &= \registers\subrange{8}{2} \\
                                \using z &= \registers_{11} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \error &\when \Nrange{h}{32} \not\subseteq \readable{\memory} \\
                                  \none &\otherwhen \mathbf{a} = \none \\
                                  \histlookup(\mathbf{a}, t, \memory\subrange{h}{32}) &\otherwise \\
                                \end{cases} \\
                                \using f &= \min(\registers_{10}, \len{\mathbf{v}}) \\
                                \using l &= \min(z, \len{\mathbf{v}} - f) \\
                                \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                  \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasHconst + \fnmemgas(\CgasHlinear, z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `export` = 8              $\begin{aligned}
                                \using p &= \registers_7 \\
                                \using z &= \min(\registers_8, \Csegmentsize) \\
                                \using \mathbf{x} &= \begin{cases}
                                  \zeropad{\Csegmentsize}{{\memory}\subrange{p}{z}} &\when \Nrange{p}{z} \subseteq \readable{\memory}\\
                                  \error &\otherwise
                                \end{cases}\\
                                \tup{\execst', \registers'_7, \mathbf{e}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{e}} &\when \mathbf{x} = \error \\
                                  \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{e}} &\otherwhen \segoff+\len{\mathbf{e}} \ge \Cmaxpackageexports \\
                                  \tup{\blacktriangleright, \segoff + \len{\mathbf{e}}, \mathbf{e} \append \mathbf{x}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasE
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `compile` = 9             $\begin{aligned}
                                \using \sq{m, p, l, f, i} &= \registers\subrange{7}{5} \\
                                \using \mathbf{a} &= \begin{cases}
                                  \mathbf{d}\subb{s} &\when i = 2^{64} - 1 \\
                                  \mathbf{d}\subb{i} &\otherwise
                                \end{cases} \\
                                \using \mathbf{p} &= \begin{cases}
                                  \memory\subrange{p}{l} &\when m = 0 \wedge \Nrange{p}{l} \subseteq \readable{\memory} \\
                                  \error &\otherwhen m = 0 \vee (m = 1 \wedge \Nrange{p}{32} \not\subseteq \readable{\memory}) \\
                                  \mathbf{h}\subrange{f^*}{l^*} &\otherwhen m = 1 \wedge \mathbf{a} \ne \none \wedge \mathbf{h} \ne \none \\
                                  \multicolumn{2}{l}{\where \mathbf{h} = \histlookup(\mathbf{a}, t, \memory\subrange{p}{32}),\ f^* = \min(f, \len{\mathbf{h}}),\ l^* = \min(l, \len{\mathbf{h}} - f^*)} \\
                                  \none &\otherwise
                                \end{cases} \\
                                \using \mathbf{H} &= \keys{\pvmNmoduleNmap} \cup \set{\mathbf{m}\subb{n}_\pgNhandle : n \in \keys{\mathbf{m}}} \\
                                \using k &= \min(n \in \N : n \not\in \mathbf{H}) \\
                                \tup{\execst', \registers'_7, \pvmNmoduleNmap'} &\equiv \begin{cases}
                                  \tup{\blacktriangleright, \mathtt{FULL}, \pvmNmoduleNmap} &\when \len{\mathbf{H}} \ge 128 \\
                                  \tup{\panic, \registers_7, \pvmNmoduleNmap} &\otherwhen \mathbf{p} = \error \\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \pvmNmoduleNmap} &\otherwhen m = 1 \wedge \mathbf{p} = \none \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \pvmNmoduleNmap} &\otherwhen \mathbf{p} = \none \vee \text{deblob}(\mathbf{p}, 0) = \error \\
                                  \tup{\blacktriangleright, k, \pvmNmoduleNmap \cup \set{\kv{k}{\mathbf{p}}} } &\otherwise \\
                                \end{cases} \\
                                g &\equiv \begin{cases}
                                  \CgasGammamemconst + \fnmemgas(\CgasGammamemlinear, l) &\when m = 0 \\
                                  \CgasGammadbconst + \fnmemgas(\CgasGammadblinear, l) &\when m = 1 \\
                                  \CgasGammamemconst &\otherwise
                                \end{cases}
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `machine` = 10            $\begin{aligned}
                                \using \sq{h, i} &= \registers\subrange{7}{2} \\
                                \using n &= \min(n \in \N : n \not\in \keys{\mathbf{m}}) \\
                                \using \mathbf{u} &= \tup{\is{\ramNvalue}{[0, 0, \dots]},\is{\ramNaccess}{[\none, \none, \dots]}} \\
                                \tup{\execst', \registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{m}} &\when \len{\mathbf{m}} \ge 63 \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{m}} &\otherwhen h \not\in \keys{\pvmNmoduleNmap} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{m}} &\otherwhen \text{deblob}(\pvmNmoduleNmap\subb{h}, i) = \error \\
                                  \tup{\blacktriangleright, n, \mathbf{m} \cup \set{\kv{n}{\tup{\pvmNmoduleNmap\subb{h}, \mathbf{u}, i, \bot, h}}} } &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasM
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `peek` = 11               $\begin{aligned}
                                \using \sq{n, o, s, z} &= \registers\subrange{7}{4} \\
                                \tup{\execst', \registers'_7, {\memory}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, {\memory}} &\when \Nrange{o}{z} \not\subseteq \writable{\memory} \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, {\memory}} &\otherwhen n \not\in \keys{\mathbf{m}} \\
                                  \tup{\blacktriangleright, \mathtt{OOB}, {\memory}} &\otherwhen \Nrange{s}{z} \not\subseteq \readable{\mathbf{m}\subb{n}_\pgNram} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, {\memory}'} &\otherwise \\
                                  \multicolumn{2}{l}{\where {\memory}' = {\memory}\exc {\memory}\subrange{o}{z} = (\mathbf{m}\subb{n}_\pgNram)\subrange{s}{z}}
                                \end{cases} \\
                                g &\equiv \CgasPconst + \fnmemgas(\CgasPlinear, z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `poke` = 12               $\begin{aligned}
                                \using \sq{n, s, o, z} &= \registers\subrange{7}{4} \\
                                \tup{\execst', \registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{m}} &\when \Nrange{s}{z} \not\subseteq \readable{\memory} \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{m}} &\otherwhen n \not\in \keys{\mathbf{m}} \\
                                  \tup{\blacktriangleright, \mathtt{OOB}, \mathbf{m}} &\otherwhen \Nrange{o}{z} \not\subseteq \writable{\mathbf{m}\subb{n}_\pgNram} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{m}'}  &\otherwise \\
                                  \multicolumn{2}{l}{\where \mathbf{m}' = \mathbf{m} \exc (\mathbf{m}'\subb{n}_\pgNram)\subrange{o}{z} = {\memory}\subrange{s}{z}}
                                \end{cases} \\
                                g &\equiv \CgasOconst + \fnmemgas(\CgasOlinear, z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `pages` = 13              $\begin{aligned}
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
                                    \sq{\mathrm{R}, \mathrm{R}, \dots} &\when r \in \set{1, 3} \\
                                    \sq{\mathrm{W}, \mathrm{W}, \dots} &\when r \in \set{2, 4} \\
                                  \end{cases}
                                \end{cases}\\
                                \tup{\registers'_7, \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{m}} &\when \mathbf{u} = \error \\
                                  \tup{\mathtt{HUH}, \mathbf{m}} &\otherwhen r > 4 \vee p < 16 \vee p+c \ge \nicefrac{2^{32}}{\Cpvmpagesize} \\
                                  \tup{\mathtt{HUH}, \mathbf{m}} &\otherwhen r > 2 \wedge (\mathbf{u}_\ramNaccess)\subrange{p}{c} \ni \none \\
                                  \tup{\mathtt{OK}, \mathbf{m}'} &\otherwise\,,\ \where \mathbf{m}' = \mathbf{m} \exc \mathbf{m}'\subb{n}_\pgNram = \mathbf{u}' \\
                                \end{cases} \\
                                g &\equiv \begin{cases}
                                  \CgasZfreeconst + c \cdot \CgasZfreelinear &\when r = 0 \\
                                  \CgasZallocconst + c \cdot \CgasZalloclinear &\when r \in \set{1, 2} \\
                                  \CgasZsetmodeconst + c \cdot \CgasZsetmodelinear &\when r \in \set{3, 4} \\
                                  \CgasZinvalid &\otherwise
                                \end{cases}
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `invoke` = 14             $\begin{aligned}
                                \using \sq{n, o} &= \registers_{7, 8} \\
                                \using \tup{g_R, \mathbf{w}} &= \begin{cases}
                                  \tup{g_R, \mathbf{w}}: \encode[8]{g_R} \concat \encode[8]{\mathbf{w}} = {\memory}\subrange{o}{112} &\when \Nrange{o}{112} \subseteq \writable{{\memory}} \\
                                  %\tup{\decode[8]{\memr\subrange{o}{8}}, \sq{\build{\decode[4]{\memr\subrange{o+8+8x}{8}}}{x \orderedin \Nmax{13}}}} &\when \Nrange{o}{60} \subset \writable_\mem} \\
                                  \tup{0, \error} &\otherwise
                                \end{cases} \\
                                \using \tup{c, i', g_R', \pgNgaschargedflag', \mathbf{w}', \mathbf{u}'} &= \Psi(\mathbf{m}\subb{n}_\pgNcode, \mathbf{m}\subb{n}_\pgNpc, g_R, \mathbf{m}\subb{n}_{\pgNgaschargedflag}, \mathbf{w}, \mathbf{m}\subb{n}_\pgNram)\\
                                \using {\memory}^* &= {\memory}\exc {\memory}^*\subrange{o}{112} = \encode[8]{g_R'} \concat \encode[8]{\mathbf{w}'}\\
                                \using \mathbf{m}^* &= \mathbf{m} \exc \begin{cases}
                                  \mathbf{m}^*\subb{n}_\pgNram = \mathbf{u}'\\
                                  \mathbf{m}^*\subb{n}_\pgNpc = \begin{cases}
                                    i' + \text{skip}(i') + 1 &\when c \in \set{ \host } \times \pvmreg\\
                                    i' &\otherwise
                                  \end{cases}\\
                                  \mathbf{m}^*\subb{n}_{\pgNgaschargedflag} = \pgNgaschargedflag'\\
                                \end{cases}\\
                                \tup{\execst', \registers'_7, \registers'_8, {\memory}', \mathbf{m}'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \registers_8, {\memory}, \mathbf{m}} &\when \mathbf{w} = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \registers_8, {\memory}, \mathbf{m}} &\otherwhen n \not\in \keys{\mathbf{m}} \\
                                  \tup{\blacktriangleright, \mathtt{HOST}, h, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \host \times h \\
                                  \tup{\blacktriangleright, \mathtt{FAULT}, x, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \fault \times x \\
                                  \tup{\blacktriangleright, \mathtt{OOG}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \oog \\
                                  \tup{\blacktriangleright, \mathtt{PANIC}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \panic \\
                                  \tup{\blacktriangleright, \mathtt{HALT}, \registers_8, {\memory}^*, \mathbf{m}^*} &\otherwhen c = \halt \\
                                \end{cases} \\
                                g &\equiv \CgasK + g_R \\
                                \gascounter^* &\equiv \max(\gascounter - g, 0) + \begin{cases}
                                  0 &\when \mathbf{w} = \error \vee n \not\in \keys{\mathbf{m}} \vee \gascounter < g \\
                                  g_R' &\otherwise
                                \end{cases}
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `expunge` = 15            $\begin{aligned}
                                \using \sq{m, n} &= \registers_{7, 8} \\
                                \tup{\registers'_7, \mathbf{m}', \pvmNmoduleNmap'} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{m}, \pvmNmoduleNmap} &\when (m = 0 \wedge n \not\in \keys{\mathbf{m}}) \vee (m = 1 \wedge n \not\in \keys{\pvmNmoduleNmap}) \\
                                  \tup{\mathbf{m}\subb{n}_\pgNpc, \mathbf{m} \setminus \set{n}, \pvmNmoduleNmap} &\otherwhen m = 0 \\
                                  \tup{\mathtt{OK}, \mathbf{m}, \pvmNmoduleNmap \setminus \set{n}} &\otherwhen m = 1 \\
                                  \tup{\mathtt{HUH}, \mathbf{m}, \pvmNmoduleNmap} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasX
                              \end{aligned}$
  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
