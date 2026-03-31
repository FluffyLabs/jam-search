---
type: graypaper_section
title: B.7 Accumulate Functions
index: 143
---
This defines a number of functions broadly of the form $(\gascounter' \in \signedgas, \registers' \in \sequence[13]{\pvmreg}, \memory', \tup{\imX', \mathbf{y}'}) = \Omega_\square(\gascounter \in \gas, \registers \in \sequence[13]{\pvmreg}, \memory \in \ram, \imXY \in \implications^2, \dots)$. Functions which have a result component which is equivalent to the corresponding argument may have said components elided in the description. Functions may also depend upon particular additional parameters.

Other than the gas-counter which is explicitly defined, elements of PVM state are each assumed to remain unchanged by the host-call unless explicitly specified. $$\begin{aligned}
  \gascounter' &\equiv \gascounter - g\\
  \tup{\execst', \registers', \memory', \imX', \mathbf{y}'} &\equiv \begin{cases}
    \tup{\oog, \registers, \memory, \mathbf{x}, \mathbf{y}} &\when \gascounter < g\\
    \tup{\blacktriangleright, \registers, \memory, \mathbf{x}, \mathbf{y}} \text{ except as indicated below} &\otherwise
  \end{cases}\end{aligned}$$

  ------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                      
  **Identifier**      
  **Gas usage**       
  (lr)1-1(lr)2-2      
  `bless` = 14        
  $g = 10$            $\begin{aligned}
                          \using \sq{m, a, v, r, o, n} &= \registers\subrange{7}{6} \\
                          \using \mathbf{a} &= \begin{cases}
                            \decode[4]{\memory\subrange{a}{4\Ccorecount}} &\when \Nrange{a}{4\Ccorecount} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{z} &= \begin{cases}
                            \set{\build{\kv{s}{g} \ \where \encode[4]{s} \concat \encode[8]{g} = \memory\subrange{o+12i}{12}}{i \in \Nmax{n}}} &\when \Nrange{o}{12n} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, (\imX'_\imNstate)_{\tup{\psNmanager, \psNassigners, \psNdelegator, \psNregistrar, \psNalwaysaccers}}} &= \begin{cases}
                            \tup{\panic, \registers_7, (\imX_\imNstate)_{\tup{\psNmanager, \psNassigners, \psNdelegator, \psNregistrar, \psNalwaysaccers}}} &\when \set{\mathbf{z}, \mathbf{a}} \ni \error \\
                            \tup{\blacktriangleright, \mathtt{WHO}, (\imX_\imNstate)_{\tup{\psNmanager, \psNassigners, \psNdelegator, \psNregistrar, \psNalwaysaccers}}} &\otherwhen \tup{m, v, r} \not\in \serviceid^3 \\
                            \tup{\blacktriangleright, \mathtt{OK}, \tuple{m, \mathbf{a}, v, r, \mathbf{z}}} &\otherwise \\
                          \end{cases}
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `assign` = 15       
  $g = 10$            $\begin{aligned}
                          \using \sq{c, o, a} &= \registers\subrange{7}{3} \\
                          \using \mathbf{q} &= \begin{cases}
                            \sq{\build{\memory\subrange{o + 32i}{32}}{i \orderedin \N_\Cauthqueuesize}} &\when \Nrange{o}{32\Cauthqueuesize} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNauthqueue\subb{c}, (\imX'_\imNstate)_\psNassigners\subb{c}} &= \begin{cases}
                            \tup{\panic, \registers_7, (\imX_\imNstate)_\psNauthqueue\subb{c}, (\imX_\imNstate)_\psNassigners\subb{c}} &\when \mathbf{q} = \error \\
                            \tup{\blacktriangleright, \mathtt{CORE}, (\imX_\imNstate)_\psNauthqueue\subb{c}, (\imX_\imNstate)_\psNassigners\subb{c}} &\otherwhen c \ge \Ccorecount \\
                            \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNauthqueue\subb{c}, (\imX_\imNstate)_\psNassigners\subb{c}} &\otherwhen \imX_\imNid \ne (\imX_\imNstate)_\psNassigners\subb{c}\\
                            \tup{\blacktriangleright, \mathtt{WHO}, (\imX_\imNstate)_\psNauthqueue\subb{c}, (\imX_\imNstate)_\psNassigners\subb{c}} &\otherwhen a \not\in \serviceid \\
                            \tup{\blacktriangleright, \mathtt{OK}, \mathbf{q}, a} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `designate` = 16    
  $g = 10$            $\begin{aligned}
                          \using o &= \registers_7 \\
                          \using \mathbf{v} &= \begin{cases}
                            \sq{\build{\memory\subrange{o + 336i}{336}}{i \orderedin \valindex}} &\when \Nrange{o}{336\Cvalcount} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNstagingset} &= \begin{cases}
                            \tup{\panic, \registers_7, (\imX_\imNstate)_\psNstagingset} &\when \mathbf{v} = \error\\
                            \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNstagingset} &\otherwhen \imX_\imNid \ne (\imX_\imNstate)_\psNdelegator\\
                            \tup{\blacktriangleright, \mathtt{OK}, \mathbf{v}} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `checkpoint` = 17   
  $g = 10$            $\begin{aligned}
                          \imY' &\equiv \imX \\
                          \registers'_7 &\equiv \gascounter'
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `new` = 18          
  $g = 10$            $\begin{aligned}
                          \using \sq{o, l, \saNminaccgas, \saNminmemogas, \saNgratis, i} &= \registers\subrange{7}{6} \\
                          \using \saNcodehash &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \wedge l \in \Nbits{32} \\
                            \error &\otherwise
                          \end{cases}\\
                          \using \mathbf{a} \in \serviceaccount \cup \set{\error} &= \begin{cases}
                            \tup{
                              \saNcodehash,
                              \is{\mathbf{\saNstorage}}{\emset},
                              \is{\mathbf{\saNrequests}}{\set{\kv{\tup{c, l}}{\sq{}}}},
                              \is{\saNbalance}{\mathbf{a}_\saNminbalance},
                              \saNminaccgas,
                              \saNminmemogas,
                              \is{\mathbf{\saNpreimages}}{\emset},
                              \is{\saNcreated}{t},
                              \saNgratis,
                              \is{\saNlastacc}{0},
                              \is{\saNparent}{\imX_\imNid}
                            } &\when c \ne \error \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{s} &= \imX_\imNself \exc \mathbf{s}_\saNbalance = (\imX_\imNself)_\saNbalance - \mathbf{a}_\saNminbalance \\
                          \tup{\execst', \registers'_7, \imX'_\imNnextfreeid, (\imX'_\imNstate)_\psNaccounts} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNnextfreeid, (\imX_\imNstate)_\psNaccounts} &\when c = \error \\
                            \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNnextfreeid, (\imX_\imNstate)_\psNaccounts} &\otherwhen f \ne 0 \wedge \imX_\imNid \ne (\imX_\imNstate)_\psNmanager \\
                            \tup{\blacktriangleright, \mathtt{CASH}, \imX_\imNnextfreeid, (\imX_\imNstate)_\psNaccounts} &\otherwhen \mathbf{s}_\saNbalance < (\imX_\imNself)_\saNminbalance \\
                            \tup{\blacktriangleright, \mathtt{FULL}, \imX_\imNnextfreeid, (\imX_\imNstate)_\psNaccounts} &\otherwhen \imX_\imNid = (\imX_\imNstate)_\psNregistrar \wedge i< \Cminpublicindex \wedge i\in \keys{(\imX_\imNstate)_\psNaccounts} \\
                            \tup{\blacktriangleright, i, \imX_\imNnextfreeid, (\imX_\imNstate)_\psNaccounts \cup \mathbf{d}} &\otherwhen \imX_\imNid = (\imX_\imNstate)_\psNregistrar \wedge i< \Cminpublicindex \\
                            \multicolumn{2}{l}{\quad \where \mathbf{d} = \set{ \kv{i}{\mathbf{a}}, \kv{\imX_\imNid}{\mathbf{s}} }}\\
                            \tup{\blacktriangleright, \imX_\imNnextfreeid, i^*, (\imX_\imNstate)_\psNaccounts \cup \mathbf{d}} &\otherwise \\
                            \multicolumn{2}{l}{\quad \where i^* = \text{check}(\Cminpublicindex + (\imX_\imNnextfreeid - \Cminpublicindex + 42) \bmod (2^{32} - \Cminpublicindex - 2^8))}\\
                            \multicolumn{2}{l}{\quad \also \mathbf{d} = \set{ \kv{\imX_\imNnextfreeid}{\mathbf{a}}, \kv{\imX_\imNid}{\mathbf{s}} }}\\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `upgrade` = 19      
  $g = 10$            $\begin{aligned}
                          \using \sq{o, g, m} &= \registers\subrange{7}{3} \\
                          \using c &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, (\imX'_\imNself)_\saNcodehash, (\imX'_\imNself)_\saNminaccgas, (\imX'_\imNself)_\saNminmemogas} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, (\imX_\imNself)_\saNcodehash, (\imX_\imNself)_\saNminaccgas, (\imX_\imNself)_\saNminmemogas} &\when c = \error \\
                            \tup{\blacktriangleright, \mathtt{OK}, c, g, m} &\otherwise \\
                          \end{cases}
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `transfer` = 20     
  $g = 10 + t$        $\begin{aligned}
                          \using \sq{\dxNdest, \dxNamount, l, o} &= \registers\subrange{7}{4},  \\
                          \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts\\
                          \using \mathbf{t} \in \defxfer \cup \set{\error} &= \begin{cases}
                            \tup{
                              \is{\dxNsource}{\imX_\imNid},
                              \dxNdest,
                              \dxNamount,
                              \is{\dxNmemo}{\memory\subrange{o}{\Cmemosize}},
                              \is{\dxNgas}{l}
                            } &\when \Nrange{o}{\Cmemosize} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using b &= (\imX_\imNself)_\saNbalance - \dxNamount \\
                          \using \tup{c, t} &= \begin{cases}
                            \tup{\panic, 0} &\when \mathbf{t} = \error \\
                            \tup{\mathtt{WHO}, 0} &\otherwhen \dxNdest \not \in \keys{\mathbf{d}} \\
                            \tup{\mathtt{LOW}, 0} &\otherwhen l < \mathbf{d}[\dxNdest]_\saNminmemogas \\
                            \tup{\mathtt{CASH}, 0} &\otherwhen b < (\imX_\imNself)_\saNminbalance \\
                            \tup{\mathtt{OK}, l} &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \imX'_\imNxfers, (\imX'_\imNself)_\saNbalance} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNxfers, (\imX_\imNself)_\saNbalance} &\when c = \panic \\
                            \tup{\blacktriangleright, c, \imX_\imNxfers, (\imX_\imNself)_\saNbalance} &\otherwhen c \ne \mathtt{OK} \\
                            \tup{\blacktriangleright, \mathtt{OK}, \imX_\imNxfers \append \mathbf{t}, b} &\otherwise
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `eject` = 21        
  $g = 10$            $\begin{aligned}
                          \using \sq{d, o} &= \registers_{7, 8} \\
                          \using h &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{d} &= \begin{cases}
                            (\imX_\imNstate)_\psNaccounts\subb{d} &\when d \ne \imX_\imNid \wedge d \in \keys{(\imX_\imNstate)_\psNaccounts} \\
                            \error &\otherwise \\
                          \end{cases} \\
                          \using l &= \max(81, \mathbf{d}_\saNoctets) - 81 \\
                          \using \mathbf{s}' &= \imX_\imNself \exc \mathbf{s}'_\saNbalance = (\imX_\imNself)_\saNbalance + \mathbf{d}_\saNbalance \\
                          \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNaccounts} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, (\imX_\imNstate)_\psNaccounts} &\when h = \error \\
                            \tup{\blacktriangleright, \mathtt{WHO}, (\imX_\imNstate)_\psNaccounts} &\otherwhen \mathbf{d} = \error \vee \mathbf{d}_\saNcodehash \ne \encode[32]{\imX_\imNid} \\
                            \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNaccounts} &\otherwhen \mathbf{d}_\saNitems \ne 2 \vee \tup{h, l} \not\in \mathbf{d}_\saNrequests \\
                            \tup{\blacktriangleright, \mathtt{OK}, (\imX_\imNstate)_\psNaccounts \setminus \set{d} \cup \set{ \kv{\imX_\imNid}{\mathbf{s}'} }} &\otherwhen \mathbf{d}_\saNrequests\subb{h, l} = \sq{x, y}, y < t - \Cexpungeperiod \\
                            \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNaccounts} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `query` = 22        
  $g = 10$            $\begin{aligned}
                          \using \sq{o, z} &= \registers_{7, 8} \\
                          \using h &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{a} &= \begin{cases}
                            (\imX_\imNself)_\saNrequests\subb{h, z} &\when \tup{h, z} \in \keys{(\imX_\imNself)_\saNrequests}\\
                            \error &\otherwise\\
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \registers'_8} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \registers_8} &\when h = \error \\
                            \tup{\blacktriangleright, \mathtt{NONE}, 0} &\otherwhen \mathbf{a} = \error \\
                            \tup{\blacktriangleright, 0, 0} &\otherwhen \mathbf{a} = \sq{} \\
                            \tup{\blacktriangleright, 1 + 2^{32}x, 0} &\otherwhen \mathbf{a} = \sq{x} \\
                            \tup{\blacktriangleright, 2 + 2^{32}x, y} &\otherwhen \mathbf{a} = \sq{x, y} \\
                            \tup{\blacktriangleright, 3 + 2^{32}x, y + 2^{32}z} &\otherwhen \mathbf{a} = \sq{x, y, z} \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `solicit` = 23      
  $g = 10$            $\begin{aligned}
                          \using \sq{o, z} &= \registers_{7, 8} \\
                          \using h &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{a} &= \begin{cases}
                            \imX_\imNself \text{ except: } &\\
                            \quad \mathbf{a}_\saNrequests\subb{\tup{h, z}} = \sq{} &\when h \ne \error \wedge \tup{h, z} \not\in \keys{(\imX_\imNself)_\saNrequests} \\
                            \quad \mathbf{a}_\saNrequests\subb{\tup{h, z}} = (\imX_\imNself)_\saNrequests\subb{\tup{h, z}} \append t &\when (\imX_\imNself)_\saNrequests\subb{\tup{h, z}} = \sq{x, y} \\
                            \error &\otherwise\\
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \imX'_\imNself} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNself} &\when h = \error \\
                            \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNself} &\otherwhen \mathbf{a} = \error \\
                            \tup{\blacktriangleright, \mathtt{FULL}, \imX_\imNself} &\otherwhen \mathbf{a}_\saNbalance < \mathbf{a}_\saNminbalance \\
                            \tup{\blacktriangleright, \mathtt{OK}, \mathbf{a}} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `forget` = 24       
  $g = 10$            $\begin{aligned}
                          \using \sq{o, z} &= \registers_{7, 8} \\
                          \using h &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{a} &= \begin{cases}
                            \imX_\imNself \text{ except:} &\\
                            \quad \left.
                              \begin{aligned}
                                \keys{\mathbf{a}_\saNrequests} &= \keys{(\imX_\imNself)_\saNrequests} \setminus \set{\tup{h, z}}\ ,\[2pt]
                                \keys{\mathbf{a}_\saNpreimages} &= \keys{(\imX_\imNself)_\saNpreimages} \setminus \set{h}
                              \end{aligned}
                            \ \right\} &\when (\imX_\imNself)_\saNrequests\subb{h, z} \in \set{\sq{}, \sq{x, y}},\ y < t - \Cexpungeperiod \\
                            \quad \mathbf{a}_\saNrequests\subb{h, z} = \sq{x, t} &\when (\imX_\imNself)_\saNrequests\subb{h, z} = \sq{x} \\
                            \quad \mathbf{a}_\saNrequests\subb{h, z} = \sq{w, t} &\when (\imX_\imNself)_\saNrequests\subb{h, z} = \sq{x, y, w},\ y < t - \Cexpungeperiod \\
                            \error &\otherwise\\
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \imX'_\imNself} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNself} &\when h = \error \\
                            \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNself} &\otherwhen \mathbf{a} = \error \\
                            \tup{\blacktriangleright, \mathtt{OK}, \mathbf{a}} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `yield` = 25        
  $g = 10$            $\begin{aligned}
                          \using o &= \registers_7 \\
                          \using h &= \begin{cases}
                            \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \imX'_\imNyield} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNyield} &\when h = \error \\
                            \tup{\blacktriangleright, \mathtt{OK}, h} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  (lr)1-1(lr)2-2      
  `provide` = 26      
  $g = 10$            $\begin{aligned}
                          \using \sq{o, z} &= \registers_{8, 9} \\
                          \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts\\
                          \using s &= \begin{cases}
                            \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                            \registers_7 &\otherwise
                          \end{cases} \\
                          \using \mathbf{i} &= \begin{cases}
                            \memory\subrange{o}{z} &\when \Nrange{o}{z} \subseteq \readable{\memory} \\
                            \error &\otherwise
                          \end{cases} \\
                          \using \mathbf{a} &= \begin{cases}
                            \mathbf{d}[s] &\when s \in \keys{\mathbf{d}} \\
                            \none &\otherwise
                          \end{cases} \\
                          \tup{\execst', \registers'_7, \imX'_\imNprovisions} &\equiv \begin{cases}
                            \tup{\panic, \registers_7, \imX_\imNprovisions} &\when \mathbf{i} = \error \\
                            \tup{\blacktriangleright, \mathtt{WHO}, \imX_\imNprovisions} &\otherwhen \mathbf{a} = \none \\
                            \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNprovisions} &\otherwhen \mathbf{a}_\saNrequests[\tup{\blake{\mathbf{i}}, z}] \ne \sq{} \\
                            \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNprovisions} &\otherwhen \tup{s, \mathbf{i}} \in \imX_\imNprovisions \\
                            \tup{\blacktriangleright, \mathtt{OK}, \imX_\imNprovisions \cup \set{\tup{s, \mathbf{i}}}} &\otherwise \\
                          \end{cases} \\
                        \end{aligned}$
  ------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
