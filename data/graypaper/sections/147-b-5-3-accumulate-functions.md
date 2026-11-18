---
type: graypaper_section
title: B.5.3 Accumulate Functions
index: 147
---
These assume a context $\imXY \in \implications^2$; see equation [eq:implications]. $$\context \equiv \imXY\ ,\qquad \context' \equiv \tup{\imX', \imY'}$$

  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            
  **Identifier**            
  **Gas usage (**$g$**)**   
  (lr)1-1(lr)2-2            
  `lookup` = 3              $\begin{aligned}
                                \using \mathbf{a} &= \begin{cases}
                                  \imX_\imNself &\when \registers_7 = 2^{64} - 1 \\
                                  (\imX_\imNstate)_\psNaccounts[\registers_7] &\otherwise
                                \end{cases} \\
                                \using \sq{h, o} &= \registers\subrange{8}{2} \\
                                \using z &= \registers_{11} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \error &\when \Nrange{h}{32} \not\subseteq \readable{\memory} \\
                                  \none &\otherwhen \mathbf{a} = \none \\
                                  \mathbf{a}_\saNpreimages[\memory\subrange{h}{32}] &\otherwise \\
                                \end{cases} \\
                                \using f &= \min(\registers_{10}, \len{\mathbf{v}}) \\
                                \using l &= \min(z, \len{\mathbf{v}} - f) \\
                                \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                  \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasLconst + \fnmemgas(\CgasLlinear, z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `read` = 4                $\begin{aligned}
                                \using \mathbf{a} &= \begin{cases}
                                  \imX_\imNself &\when \registers_7 = 2^{64} - 1 \\
                                  (\imX_\imNstate)_\psNaccounts[\registers_7] &\otherwise
                                \end{cases} \\
                                \using \sq{k_O, k_Z, o} &= \registers\subrange{8}{3} \\
                                \using v_Z &= \registers_{12} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \error &\when \Nrange{k_O}{k_Z} \not\subseteq \readable{\memory} \\
                                  \none &\otherwhen \mathbf{a} = \none \\
                                  \mathbf{a}_\saNstorage\subb{\memory\subrange{k_O}{k_Z}} &\otherwise
                                \end{cases} \\
                                \using f &= \min(\registers_{11}, \len{\mathbf{v}}) \\
                                \using l &= \min(v_Z, \len{\mathbf{v}} - f) \\
                                \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                  \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasRconst + \fnmemgas(\CgasRkeylinear, k_Z) + \fnmemgas(\CgasRvallinear, v_Z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `write` = 5               $\begin{aligned}
                                \using d &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \sq{k_O, k_Z, v_O, v_Z} &= \registers\subrange{8}{4} \\
                                \using \mathbf{k} &= \begin{cases}
                                  \memory\subrange{k_O}{k_Z} &\when \Nrange{k_O}{k_Z} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \memory\subrange{v_O}{v_Z} &\when \Nrange{v_O}{v_Z} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \begin{cases}
                                  \mathbf{k} \not\in \keys{\mathbf{d}'\subb{d}_\saNstorage} & \when \len{\mathbf{v}} = 0 \\
                                  \mathbf{d}'\subb{d}_\saNstorage\subb{\mathbf{k}} = \mathbf{v} &\otherwise
                                \end{cases} \\
                                \using l &= \begin{cases}
                                  \len{\mathbf{d}\subb{d}_\saNstorage\subb{\mathbf{k}}} &\when \mathbf{k} \in \keys{\mathbf{d}\subb{d}_\saNstorage} \\
                                  \mathtt{NONE} &\otherwise
                                \end{cases} \\
                                \tup{\execst', \registers'_7, (\imX_\imNstate')_\psNaccounts, \imX_\imNmodifiedaccounts'} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when \mathbf{k} = \error \vee \mathbf{v} = \error\\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen d \not\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid \not\in \set{d, \effectivesupervisor{\mathbf{d}}{d}} \\
                                  \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \mathbf{d}'\subb{d}_\saNminbalance > \mathbf{d}'\subb{d}_\saNbalance + \mathbf{d}'\subb{d}_\saNsupervisorbalance \lor {} \\
                                  &\phantom{\otherwhen} \mathbf{d}'\subb{d}_\saNitems \not\in \Nbits{32} \vee \mathbf{d}'\subb{d}_\saNoctets \not\in \Nbits{64} \\
                                  \tup{\blacktriangleright, l, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d}} &\otherwise\\
                                \end{cases} \\
                                g &\equiv \CgasWconst + \fnmemgas(\CgasWkeylinear, k_Z) + \fnmemgas(\CgasWvallinear, v_Z)
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `info` = 6                $\begin{aligned}
                                \using \mathbf{a} &= \begin{cases}
                                  \imX_\imNself &\when \registers_7 = 2^{64} - 1 \\
                                  (\imX_\imNstate)_\psNaccounts\subb{\registers_7} &\otherwise
                                \end{cases} \\
                                \using o &= \registers_8 \\
                                \using \mathbf{v} &= \begin{cases}
                                  \begin{aligned}
                                    &\fnencode(
                                      \mathbf{a}_\saNcodehash,
                                      \encode[4]{\mathbf{a}_\saNsupervisor, \mathbf{a}_\saNsupervisorcreated},
                                      \encode[8]{\mathbf{a}_\saNbalance, \mathbf{a}_\saNsupervisorbalance, \mathbf{a}_\saNminbalance, \mathbf{a}_\saNminaccgas, \mathbf{a}_\saNminmemogas, \mathbf{a}_\saNoctets}, \\
                                    &\phantom{\fnencode(}
                                      \encode[4]{\mathbf{a}_\saNitems},
                                      \encode[8]{\mathbf{a}_\saNgratis},
                                      \encode[4]{\mathbf{a}_\saNcreated, \mathbf{a}_\saNlastacc, \mathbf{a}_\saNparent})
                                  \end{aligned} &\when \mathbf{a} \ne \none \\
                                  \none &\otherwise
                                \end{cases} \\
                                \using f &= \min(\registers_{9}, \len{\mathbf{v}}) \\
                                \using l &= \min(\registers_{10}, \len{\mathbf{v}} - f) \\
                                \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                  \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                  \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasI
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `bless` = 16              $\begin{aligned}
                                \using \sq{m, a, v, r, o, n} &= \registers\subrange{7}{6} \\
                                \using \mathbf{p} &= (\imX_\imNstate)_\psNprivileges \\
                                \using D(x, y) &\equiv \begin{cases} y &\when x = 2^{64} - 1 \\ x &\otherwise \end{cases} \\
                                \using D_{32}(x, y) &\equiv \begin{cases} y &\when x = 2^{32} - 1 \\ x &\otherwise \end{cases} \\
                                \using \tup{m', v', r'} &= \tup{D(m, \mathbf{p}_\prNmanager), D(v, \mathbf{p}_\prNdelegator), D(r, \mathbf{p}_\prNregistrar)} \\
                                \using \prNassigners &= \begin{cases}
                                  \mathbf{p}_\prNassigners &\when a = 2^{64} - 1 \\
                                  \sq{\build{D_{32}(\decode[4]{\memory\subrange{a + 4c}{4}}, \mathbf{p}_\prNassigners\subb{c})}{c \orderedin \coreindex}} &\otherwhen \Nrange{a}{4\Ccorecount} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{z}^* &= \set{\build{\tup{s, g} \ \where \encode[4]{s} \concat \encode[8]{g} = \memory\subrange{o+12i}{12}}{i \in \Nmax{n}}} \\
                                \using \prNalwaysaccers &= \begin{cases}
                                  \mathbf{p}_\prNalwaysaccers &\when o = 2^{64} - 1 \\
                                  \mathbf{z}^* &\otherwhen \Nrange{o}{12n} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using p &= (\imX_\imNid = \mathbf{p}_\prNmanager) \vee \bigwedge \abracegroup{
                                  m' &= \mathbf{p}_\prNmanager \\
                                  \forall c \in \coreindex : \prNassigners\subb{c} &= \mathbf{p}_\prNassigners\subb{c} \vee \imX_\imNid = \mathbf{p}_\prNassigners\subb{c} \\
                                  v' &= \mathbf{p}_\prNdelegator \vee \imX_\imNid = \mathbf{p}_\prNdelegator \\
                                  r' &= \mathbf{p}_\prNregistrar \vee \imX_\imNid = \mathbf{p}_\prNregistrar \\
                                  \prNalwaysaccers &= \mathbf{p}_\prNalwaysaccers
                                } \\
                                \using \mathbf{p}' &= \tup{\is{\prNmanager}{m'}, \is{\prNdelegator}{v'}, \is{\prNregistrar}{r'}, \prNassigners, \prNalwaysaccers} \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNprivileges} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{p}} &\when \set{\prNassigners, \prNalwaysaccers} \ni \error \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{p}} &\otherwhen \neg p \vee (o \ne 2^{64} - 1 \wedge \len{\set{\build{s}{\tup{s, g} \in \prNalwaysaccers}}} \ne n) \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{p}} &\otherwhen \tup{m', v', r'} \not\in \serviceid^3 \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{p}'} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasBconst + n \cdot \CgasBlinear
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `assign` = 17             $\begin{aligned}
                                \using \sq{c, o, a} &= \registers\subrange{7}{3} \\
                                \using \mathbf{q} &= \begin{cases}
                                  \sq{\build{\memory\subrange{o + 32i}{32}}{i \orderedin \N_\Cauthqueuesize}} &\when \Nrange{o}{32\Cauthqueuesize} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{a} &= ((\imX_\imNstate)_\psNprivileges)_\prNassigners \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNauthqueue\subb{c}, ((\imX'_\imNstate)_\psNprivileges)_\prNassigners\subb{c}} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, (\imX_\imNstate)_\psNauthqueue\subb{c}, \mathbf{a}\subb{c}} &\when \mathbf{q} = \error \\
                                  \tup{\blacktriangleright, \mathtt{CORE}, (\imX_\imNstate)_\psNauthqueue\subb{c}, \mathbf{a}\subb{c}} &\otherwhen c \ge \Ccorecount \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNauthqueue\subb{c}, \mathbf{a}\subb{c}} &\otherwhen \imX_\imNid \ne \mathbf{a}\subb{c}\\
                                  \tup{\blacktriangleright, \mathtt{WHO}, (\imX_\imNstate)_\psNauthqueue\subb{c}, \mathbf{a}\subb{c}} &\otherwhen a \not\in \serviceid \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{q}, a} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasA
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `designate` = 18          $\begin{aligned}
                                \using \sq{o, z} &= \registers\subrange{7}{2} \\
                                \using \mathbf{v} &= \begin{cases}
                                  \sq{\build{\memory\subrange{o + 336i}{336}}{i \orderedin \N_z}} &\when \Nrange{o}{336z} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNstagingset} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, (\imX_\imNstate)_\psNstagingset} &\when \mathbf{v} = \error\\
                                  \tup{\blacktriangleright, \mathtt{HUH}, (\imX_\imNstate)_\psNstagingset} &\otherwhen z \not\in \valcount \vee \imX_\imNid \ne ((\imX_\imNstate)_\psNprivileges)_\prNdelegator\\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{v}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasDconst + z \cdot \CgasDlinear
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `checkpoint` = 19         $\begin{aligned}
                                \imY' &\equiv \imX \\
                                \registers'_7 &\equiv \gascounter^* \\
                                g &\equiv \CgasC
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `new` = 20                $\begin{aligned}
                                \using s &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \sq{i, x, o} &= \registers\subrange{8}{3} \\
                                \using \mathbf{p} &= (\imX_\imNstate)_\psNprivileges \\
                                \using &\encode{\saNcodehash, \encode[4]{l}, \encode[8]{\saNminaccgas, \saNminmemogas, \saNgratis}} = \memory\subrange{o}{60} \\
                                \using \tup{i', i^*} &= \begin{cases}
                                  \tup{i, \imX_\imNnextfreeid} &\when \imX_\imNid = \mathbf{p}_\prNregistrar \wedge i< \Cminpublicindex \\
                                  \tup{\imX_\imNnextfreeid, \text{check}(\Cminpublicindex + (\imX_\imNnextfreeid - \Cminpublicindex + 42) \bmod (2^{32} - \Cminpublicindex - 2^8))} &\otherwise
                                \end{cases}\\
                                \using \mathbf{a} \in \serviceaccount &= \tup{\begin{aligned}
                                  &\saNcodehash,
                                  \is{\mathbf{\saNstorage}}{\emset},
                                  \is{\mathbf{\saNrequests}}{\set{\kv{\tup{\saNcodehash, l}}{\sq{}}}},
                                  \saNbalance,
                                  \is{\saNsupervisor}{\imX_\imNid},
                                  \is{\saNsupervisorcreated}{(\imX_\imNself)_\saNcreated},
                                  \is{\saNsupervisorbalance}{\mathbf{a}_\saNminbalance - \saNbalance}, \\
                                  &\saNminaccgas,
                                  \saNminmemogas,
                                  \is{\mathbf{\saNpreimages}}{\emset},
                                  \is{\saNcreated}{t},
                                  \saNgratis,
                                  \is{\saNlastacc}{0},
                                  \is{\saNparent}{\imX_\imNid}
                                \end{aligned}} \\
                                &\phantom{{}={}} \where \saNbalance = \begin{cases}
                                  \mathbf{a}_\saNminbalance &\when x \in \set{0, 1} \\
                                  0 &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \begin{cases}
                                  \mathbf{d}'\subb{i'} = \mathbf{a} &\text{always} \\
                                  \mathbf{d}'\subb{s}_\saNbalance = \mathbf{d}\subb{s}_\saNbalance - \mathbf{a}_\saNminbalance &\when x \in \set{0, 2} \\
                                  \mathbf{d}'\subb{s}_\saNsupervisorbalance = \mathbf{d}\subb{s}_\saNsupervisorbalance - \mathbf{a}_\saNminbalance &\otherwise
                                \end{cases} \\
                                \using p &= \begin{cases}
                                  \imX_\imNid \in \set{s, \effectivesupervisor{\mathbf{d}}{s}} &\when x \in \set{0, 2} \\
                                  \imX_\imNid = \effectivesupervisor{\mathbf{d}}{s} &\otherwise
                                \end{cases} \\
                                \tup{\execst', \registers'_7, \imX'_\imNnextfreeid, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when \Nrange{o}{60} \not\subseteq \readable{\memory} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen l \not\in \preimagelen \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen s \not\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen x > 3 \lor \neg p \lor (\saNgratis \ne 0 \wedge \imX_\imNid \ne \mathbf{p}_\prNmanager) \\
                                  \tup{\blacktriangleright, \mathtt{CASH}, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \mathbf{d}'\subb{s}_\saNbalance < 0 \lor \mathbf{d}'\subb{s}_\saNsupervisorbalance < 0 \lor {} \\
                                  &\phantom{\otherwhen} \mathbf{d}'\subb{s}_\saNbalance + \mathbf{d}'\subb{s}_\saNsupervisorbalance < \mathbf{d}'\subb{s}_\saNminbalance \\
                                  \tup{\blacktriangleright, \mathtt{FULL}, \imX_\imNnextfreeid, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid = \mathbf{p}_\prNregistrar \wedge i< \Cminpublicindex \wedge i\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, i', i^*, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{s}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasN
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `supervisor` = 29         $\begin{aligned}
                                \using d &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using u &= \begin{cases}
                                  \imX_\imNid &\when \registers_8 = 2^{64} - 1 \\
                                  \registers_8 &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \abracegroup{
                                  \mathbf{d}'\subb{d}_\saNsupervisor &= u \\
                                  \mathbf{d}'\subb{d}_\saNsupervisorcreated &= \mathbf{d}\subb{u}_\saNcreated
                                } \\
                                \tup{\registers'_7, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when d \not\in \keys{\mathbf{d}} \lor u \not\in \keys{\mathbf{d}} \\
                                  \tup{\mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid \ne \effectivesupervisor{\mathbf{d}}{d} \\
                                  \tup{\mathtt{OK}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasV
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `upgrade` = 21            $\begin{aligned}
                                \using d &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \sq{o, a, m} &= \registers\subrange{8}{3} \\
                                \using c &= \begin{cases}
                                  \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \abracegroup{
                                  \mathbf{d}'\subb{d}_\saNcodehash &= c \\
                                  \mathbf{d}'\subb{d}_\saNminaccgas &= a \\
                                  \mathbf{d}'\subb{d}_\saNminmemogas &= m
                                } \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when c = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen d \not\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid \not\in \set{d, \effectivesupervisor{\mathbf{d}}{d}} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasU
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `transfer` = 22           $\begin{aligned}
                                \using \dxNsource &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \dxNdest &= \begin{cases}
                                  \imX_\imNid &\when \registers_8 = 2^{64} - 1 \\
                                  \registers_8 &\otherwise
                                \end{cases} \\
                                \using \sq{x, \dxNamount, l, o} &= \registers\subrange{9}{4} \\
                                \using \mathbf{t} \in \sequence{\defxfer} \cup \set{\error} &= \begin{cases}
                                  \sq{} &\when o = 0 \\
                                  \sq{\tup{
                                    \dxNsource,
                                    \dxNdest,
                                    \is{\dxNdestsupervisor}{x \in \set{2, 3}},
                                    \dxNamount,
                                    \is{\dxNmemo}{\memory\subrange{o}{\Cmemosize}},
                                    \is{\dxNgas}{l}
                                  }} &\otherwhen \Nrange{o}{\Cmemosize} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \begin{cases}
                                  \mathbf{d}'\subb{\dxNsource}_\saNbalance = \mathbf{d}\subb{\dxNsource}_\saNbalance - \dxNamount &\when x \in \set{0, 2} \\
                                  \mathbf{d}'\subb{\dxNsource}_\saNsupervisorbalance = \mathbf{d}\subb{\dxNsource}_\saNsupervisorbalance - \dxNamount &\when x \in \set{1, 3} \\
                                  \mathbf{d}'\subb{\dxNdest}_\saNbalance = \mathbf{d}\subb{\dxNdest}_\saNbalance + \dxNamount &\when o = 0 \land x \in \set{0, 1} \\
                                  \mathbf{d}'\subb{\dxNdest}_\saNsupervisorbalance = \mathbf{d}\subb{\dxNdest}_\saNsupervisorbalance + \dxNamount &\when o = 0 \land x \in \set{2, 3}
                                \end{cases} \\
                                \using \mathbf{w} &= \begin{cases}
                                  \set{\dxNsource, \dxNdest} &\when o = 0 \\
                                  \set{\dxNsource} &\otherwise
                                \end{cases} \\
                                \using p_s &= \begin{cases}
                                  \imX_\imNid \in \set{\dxNsource, \effectivesupervisor{\mathbf{d}}{\dxNsource}} &\when x \in \set{0, 2} \\
                                  \imX_\imNid = \effectivesupervisor{\mathbf{d}}{\dxNsource} &\otherwise
                                \end{cases} \\
                                \using p_d &= o \ne 0 \lor (\imX_\imNid \in \set{\dxNdest, \effectivesupervisor{\mathbf{d}}{\dxNdest}} \land (x \in \set{1, 2} \lor \dxNsource \ne \dxNdest)) \\
                                \using \tup{c, t} &= \begin{cases}
                                  \tup{\panic, 0} &\when \mathbf{t} = \error \\
                                  \tup{\mathtt{WHO}, 0} &\otherwhen \dxNsource \not\in \keys{\mathbf{d}} \lor \dxNdest \not\in \keys{\mathbf{d}} \\
                                  \tup{\mathtt{HUH}, 0} &\otherwhen x > 3 \lor \neg p_s \lor \neg p_d \\
                                  \tup{\mathtt{LOW}, 0} &\otherwhen o \ne 0 \land l < \mathbf{d}\subb{\dxNdest}_\saNminmemogas \\
                                  \tup{\mathtt{CASH}, 0} &\otherwhen \mathbf{d}'\subb{\dxNsource}_\saNbalance < 0 \lor \mathbf{d}'\subb{\dxNsource}_\saNsupervisorbalance < 0 \lor \mathbf{d}'\subb{\dxNsource}_\saNbalance + \mathbf{d}'\subb{\dxNsource}_\saNsupervisorbalance < \mathbf{d}'\subb{\dxNsource}_\saNminbalance \\
                                  \tup{\mathtt{OK}, 0} &\otherwhen o = 0 \\
                                  \tup{\mathtt{OK}, l} &\otherwise
                                \end{cases} \\
                                \tup{\execst', \registers'_7, \imX'_\imNxfers, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \imX_\imNxfers, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when c = \panic \\
                                  \tup{\blacktriangleright, c, \imX_\imNxfers, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen c \ne \mathtt{OK} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \imX_\imNxfers \concat \mathbf{t}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \mathbf{w}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasT + t
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `eject` = 23              $\begin{aligned}
                                \using d &= \registers_7 \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \mathbf{d} \exc \abracegroup{
                                  &d \not\in \keys{\mathbf{d}'} \\
                                  &\mathbf{d}'\subb{\imX_\imNid}_\saNbalance = (\imX_\imNself)_\saNbalance + \mathbf{d}\subb{d}_\saNbalance + \mathbf{d}\subb{d}_\saNsupervisorbalance \\
                                } \\
                                \tup{\registers'_7, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when d \not\in \keys{\mathbf{d}} \\
                                  \tup{\mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen d = \imX_\imNid \vee \imX_\imNid \ne \effectivesupervisor{\mathbf{d}}{d} \vee {} \\
                                  &\phantom{\otherwhen} \mathbf{d}\subb{d}_\saNcreated = t \vee \mathbf{d}\subb{d}_\saNitems \ne 0 \\
                                  \tup{\mathtt{OK}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d, \imX_\imNid}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasJ
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `query` = 24              $\begin{aligned}
                                \using \mathbf{s} &= \begin{cases}
                                  \imX_\imNself &\when \registers_7 = 2^{64} - 1 \\
                                  (\imX_\imNstate)_\psNaccounts\subb{\registers_7} &\otherwise
                                \end{cases} \\
                                \using \sq{o, z} &= \registers_{8, 9} \\
                                \using h &= \begin{cases}
                                  \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{a} &= \mathbf{s}_\saNrequests\subb{\tup{h, z}} \\
                                \tup{\execst', \registers'_7, \registers'_8} &\equiv \begin{cases}
                                  \tup{\blacktriangleright, \mathtt{HUH}, \registers_8} &\when z \not\in \preimagelen \\
                                  \tup{\panic, \registers_7, \registers_8} &\otherwhen h = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \registers_8} &\otherwhen \mathbf{s} = \none \\
                                  \tup{\blacktriangleright, \mathtt{NONE}, 0} &\otherwhen \mathbf{a} = \none \\
                                  \tup{\blacktriangleright, 0, 0} &\otherwhen \mathbf{a} = \sq{} \\
                                  \tup{\blacktriangleright, 1 + 2^{32}x, 0} &\otherwhen \mathbf{a} = \sq{x} \\
                                  \tup{\blacktriangleright, 2 + 2^{32}x, y} &\otherwhen \mathbf{a} = \sq{x, y} \\
                                  \tup{\blacktriangleright, 3 + 2^{32}x, y + 2^{32}z} &\otherwhen \mathbf{a} = \sq{x, y, z} \\
                                \end{cases} \\
                                g &\equiv \CgasQ
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `solicit` = 25            $\begin{aligned}
                                \using d &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \sq{o, z} &= \registers_{8, 9} \\
                                \using h &= \begin{cases}
                                  \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \begin{cases}
                                  \mathbf{d} \text{ except: } &\\
                                  \quad \mathbf{d}'\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{} &\when \tup{h, z} \not\in \keys{\mathbf{d}\subb{d}_\saNrequests} \\
                                  \quad \mathbf{d}'\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x, y, t} &\when \mathbf{d}\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x, y} \\
                                  \error &\otherwise\\
                                \end{cases} \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when z \not \in \preimagelen \\
                                  \tup{\panic, \registers_7, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen h = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen d \not\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid \not\in \set{d, \effectivesupervisor{\mathbf{d}}{d}} \lor \mathbf{d}' = \error \\
                                  \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \mathbf{d}'\subb{d}_\saNbalance + \mathbf{d}'\subb{d}_\saNsupervisorbalance < \mathbf{d}'\subb{d}_\saNminbalance \lor {} \\
                                  &\phantom{\otherwhen} \mathbf{d}'\subb{d}_\saNitems \not\in \Nbits{32} \vee \mathbf{d}'\subb{d}_\saNoctets \not\in \Nbits{64} \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasS
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `forget` = 26             $\begin{aligned}
                                \using d &= \begin{cases}
                                  \imX_\imNid &\when \registers_7 = 2^{64} - 1 \\
                                  \registers_7 &\otherwise
                                \end{cases} \\
                                \using \sq{o, z} &= \registers_{8, 9} \\
                                \using h &= \begin{cases}
                                  \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \using \mathbf{d} &= (\imX_\imNstate)_\psNaccounts \\
                                \using \mathbf{d}' &= \begin{cases}
                                  \mathbf{d} \text{ except:} &\\
                                  \quad \tup{h, z} \not\in \keys{\mathbf{d}'\subb{d}_\saNrequests} &\when \mathbf{d}\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{} \\
                                  \quad \left.
                                    \begin{aligned}
                                      \tup{h, z} &\not\in \keys{\mathbf{d}'\subb{d}_\saNrequests}\ ,\[2pt]
                                      h &\not\in \keys{\mathbf{d}'\subb{d}_\saNpreimages}
                                    \end{aligned}
                                  \ \right\} &\when \mathbf{d}\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x, y},\ y < t - \Cexpungeperiod \\
                                  \quad \mathbf{d}'\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x, t} &\when \mathbf{d}\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x} \\
                                  \quad \mathbf{d}'\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{w, t} &\when \mathbf{d}\subb{d}_\saNrequests\subb{\tup{h, z}} = \sq{x, y, w},\ y < t - \Cexpungeperiod \\
                                  \error &\otherwise\\
                                \end{cases} \\
                                \tup{\execst', \registers'_7, (\imX'_\imNstate)_\psNaccounts, \imX'_\imNmodifiedaccounts} &\equiv \begin{cases}
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\when z \not \in \preimagelen \\
                                  \tup{\panic, \registers_7, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen h = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen d \not\in \keys{\mathbf{d}} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \mathbf{d}, \imX_\imNmodifiedaccounts} &\otherwhen \imX_\imNid \not\in \set{d, \effectivesupervisor{\mathbf{d}}{d}} \lor \mathbf{d}' = \error \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \mathbf{d}', \imX_\imNmodifiedaccounts \cup \set{d}} &\otherwise
                                \end{cases} \\
                                g &\equiv \CgasF
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `yield` = 27              $\begin{aligned}
                                \using o &= \registers_7 \\
                                \using h &= \begin{cases}
                                  \memory\subrange{o}{32} &\when \Nrange{o}{32} \subseteq \readable{\memory} \\
                                  \error &\otherwise
                                \end{cases} \\
                                \tup{\execst', \registers'_7, \imX'_\imNyield} &\equiv \begin{cases}
                                  \tup{\panic, \registers_7, \imX_\imNyield} &\when h = \error \\
                                  \tup{\blacktriangleright, \mathtt{OK}, h} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasTaurus
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `provide` = 28            $\begin{aligned}
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
                                  \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNprovisions} &\when z \not \in \preimagelen \\
                                  \tup{\panic, \registers_7, \imX_\imNprovisions} &\otherwhen \mathbf{i} = \error \\
                                  \tup{\blacktriangleright, \mathtt{WHO}, \imX_\imNprovisions} &\otherwhen \mathbf{a} = \none \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNprovisions} &\otherwhen \mathbf{a}_\saNrequests[\tup{\blake{\mathbf{i}}, z}] \ne \sq{} \\
                                  \tup{\blacktriangleright, \mathtt{HUH}, \imX_\imNprovisions} &\otherwhen \tup{s, \mathbf{i}} \in \imX_\imNprovisions \\
                                  \tup{\blacktriangleright, \mathtt{OK}, \imX_\imNprovisions \cup \set{\tup{s, \mathbf{i}}}} &\otherwise \\
                                \end{cases} \\
                                g &\equiv \CgasAriesconst + \fnmemgas(\CgasArieslinear, z)
                              \end{aligned}$
  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
