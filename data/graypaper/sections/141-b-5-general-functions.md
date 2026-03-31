---
type: graypaper_section
title: B.5 General Functions
index: 141
---
We come now to defining the host functions which are utilized by the PVM invocations. Generally, these map some PVM state, including invocation context, possibly together with some additional parameters, to a new PVM state.

The general functions are all broadly of the form $\tup{\gascounter' \in \signedgas, \registers' \in \sequence[13]{\pvmreg}, \memory' \in \ram} = \Omega_\square(\gascounter \in \gas, \registers \in \sequence[13]{\pvmreg}, \memory \in \ram)$. Functions which have a result component which is equivalent to the corresponding argument may have said components elided in the description. Functions may also depend upon particular additional parameters.

Unlike the Accumulate functions in appendix 25.7, these do not mutate an accumulation context. Some, such as $\mathtt{write}$ mutate a service account and both accept and return some $\mathbf{s} \in \serviceaccount$. Others are more general functions, such as $\mathtt{fetch}$ and do not assume any context but have a parameter list suffixed with an ellipsis to denote that the context parameter may be taken and is provided transparently into its result. This allows it to be easily utilized in multiple PVM invocations.

Other than the gas-counter which is explicitly defined, elements of PVM state are each assumed to remain unchanged by the host-call unless explicitly specified. $$\begin{aligned}
  \gascounter' &\equiv \gascounter - g\\
  \tup{\execst', \registers', \memory', \mathbf{s}'} &\equiv \begin{cases}
    \tup{\oog, \registers, \memory, \mathbf{s}} &\when \gascounter < g\\
    \tup{\blacktriangleright, \registers, \memory, \mathbf{s}} \text{ except as indicated below} &\otherwise
  \end{cases}\end{aligned}$$

= 1.5mm = 2mm

  ---------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                   
  **Identifier**   
  **Gas usage**    
  (lr)1-1(lr)2-2   
  `gas` = 0        
  $g = 10$         $\begin{aligned}
                       \registers'_7 &\equiv \gascounter'
                     \end{aligned}$
  (lr)1-1(lr)2-2   
  `fetch` = 1      
  $g = 10$         $\begin{aligned}
                       \using \mathbf{v} &= \begin{cases}
                         \mathbf{c} &\when \registers_{10} = 0 \\
                         \multicolumn{2}{l}{\where \mathbf{c} = \encode{
                           \begin{aligned}
                             &\encode[8]{\Citemdeposit},
                             \encode[8]{\Cbytedeposit},
                             \encode[8]{\Cbasedeposit},
                             \encode[2]{\Ccorecount},
                             \encode[4]{\Cexpungeperiod},
                             \encode[4]{\Cepochlen},
                             \encode[8]{\Creportaccgas},\\
                             &\encode[8]{\Cpackageauthgas},
                             \encode[8]{\Cpackagerefgas},
                             \encode[8]{\Cblockaccgas},
                             \encode[2]{\Crecenthistorylen},
                             \encode[2]{\Cmaxpackageitems},
                             \encode[2]{\Cmaxreportdeps},
                             \encode[2]{\Cmaxblocktickets},\\
                             &\encode[4]{\Cmaxlookupanchorage},
                             \encode[2]{\Cticketentries},
                             \encode[2]{\Cauthpoolsize},
                             \encode[2]{\Cslotseconds},
                             \encode[2]{\Cauthqueuesize},
                             \encode[2]{\Crotationperiod},
                             \encode[2]{\Cmaxpackagexts},
                             \encode[2]{\Cassurancetimeoutperiod},\\
                             &\encode[2]{\Cvalcount},
                             \encode[4]{\Cmaxauthcodesize},
                             \encode[4]{\Cmaxbundlesize},
                             \encode[4]{\Cmaxservicecodesize},
                             \encode[4]{\Cecpiecesize},
                             \encode[4]{\Cmaxpackageimports},\\
                             &\encode[4]{\Csegmentecpieces},
                             \encode[4]{\Cmaxreportvarsize},
                             \encode[4]{\Cmemosize},
                             \encode[4]{\Cmaxpackageexports},
                             \encode[4]{\Cepochtailstart}
                           \end{aligned}
                         }}\\
                         n &\when n \ne \none \wedge \registers_{10} = 1 \\
                         \mathbf{r} &\when \mathbf{r} \ne \none \wedge \registers_{10} = 2 \\
                         \overline{\mathbf{x}}[\registers_{11}]_{\registers_{12}} &\when \overline{\mathbf{x}} \ne \none \wedge \registers_{10} = 3 \wedge \registers_{11} < \len{\overline{\mathbf{x}}} \wedge \registers_{12} < \len{\overline{\mathbf{x}}[\registers_{11}]} \\
                         \overline{\mathbf{x}}\subb{i}_{\registers_{11}} &\when \overline{\mathbf{x}} \ne \none \wedge i \ne \none \wedge \registers_{10} = 4 \wedge \registers_{11} < \len{\overline{\mathbf{x}}\subb{i}} \\
                         \overline{\mathbf{i}}[\registers_{11}]_{\registers_{12}} &\when \overline{\mathbf{i}} \ne \none \wedge \registers_{10} = 5 \wedge \registers_{11} < \len{\overline{\mathbf{i}}} \wedge \registers_{12} < \len{\overline{\mathbf{i}}[\registers_{11}]} \\
                         \overline{\mathbf{i}}\subb{i}_{\registers_{11}} &\when \overline{\mathbf{i}} \ne \none \wedge i \ne \none \wedge \registers_{10} = 6 \wedge \registers_{11} < \len{\overline{\mathbf{i}}\subb{i}} \\
                         \encode{p} &\when p \ne \none \wedge \registers_{10} = 7 \\
                         p_\wpNauthconfig &\when p \ne \none \wedge \registers_{10} = 8 \\
                         p_\wpNauthtoken &\when p \ne \none \wedge \registers_{10} = 9 \\
                         \encode{p_\wpNcontext} &\when p \ne \none \wedge \registers_{10} = 10 \\
                         \encode{\var{\sq{\build{S(w)}{w \orderedin p_\wpNworkitems}}}} &\when p \ne \none \wedge \registers_{10} = 11 \\
                         S(p_\wpNworkitems[\registers_{11}]) &\when p \ne \none \wedge \registers_{10} = 12 \wedge \registers_{11} < \len{p_\wpNworkitems} \\
                         \multicolumn{2}{l}{\where S(w) \equiv \encode{\encode[4]{w_\wiNserviceindex}, w_\wiNcodehash, \encode[8]{w_\wiNrefgaslimit, w_\wiNaccgaslimit}, \encode[2]{w_\wiNexportcount, \len{w_\wiNimportsegments}, \len{w_\wiNextrinsics}}, \encode[4]{\len{w_\wiNpayload}}}} \\
                         p_\wpNworkitems[\registers_{11}]_\wiNpayload &\when p \ne \none \wedge \registers_{10} = 13 \wedge \registers_{11} < \len{p_\wpNworkitems} \\
                         \encode{\var{\mathbf{i}}} &\when \mathbf{i} \ne \none \wedge \registers_{10} = 14 \\
                         \encode{\mathbf{i}[\registers_{11}]} &\when \mathbf{i} \ne \none \wedge \registers_{10} = 15 \wedge \registers_{11} < \len{\mathbf{i}} \\
                         \none &\otherwise
                       \end{cases} \\
                       \using o &= \registers_7 \\
                       \using f &= \min(\registers_8, \len{\mathbf{v}}) \\
                       \using l &= \min(\registers_9, \len{\mathbf{v}} - f) \\
                       \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                         \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \Nrange{o}{l} \not\subseteq \writable{\memory} \\
                         \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                         \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                       \end{cases}
                     \end{aligned}$
  (lr)1-1(lr)2-2   
  `lookup` = 2     
  $g = 10$         $\begin{aligned}
                       \using \mathbf{a} &= \begin{cases}
                         \mathbf{s} &\when \registers_7 \in \set{ s, 2^{64} - 1 } \\
                         \mathbf{d}[\registers_7] &\otherwhen \registers_7 \in \keys{\mathbf{d}} \\
                         \none &\otherwise
                       \end{cases} \\
                       \using \sq{h, o} &= \registers\subrange{8}{2} \\
                       \using \mathbf{v} &= \begin{cases}
                         \error &\when \Nrange{h}{32} \not\subseteq \readable{\memory} \\
                         \none &\otherwhen \mathbf{a} = \none \vee \memory\subrange{h}{32} \not\in \keys{\mathbf{a}_\saNpreimages} \\
                         \mathbf{a}_\saNpreimages[\memory\subrange{h}{32}] &\otherwise \\
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
  `read` = 3       
  $g = 10$         $\begin{aligned}
                       \using s^* &= \begin{cases}
                         s &\when \registers_7 = 2^{64} - 1 \\
                         \registers_7 &\otherwise
                       \end{cases} \\
                       \using \mathbf{a} &= \begin{cases}
                         \mathbf{s} &\when s^* = s \\
                         \mathbf{d}[s^*] &\otherwhen s^* \in \keys{\mathbf{d}} \\
                         \none &\otherwise
                       \end{cases} \\
                       \using \sq{k_O, k_Z, o} &= \registers\subrange{8}{3} \\
                       \using \mathbf{v} &= \begin{cases}
                         \error &\when \Nrange{k_O}{k_Z} \not\subseteq \readable{\memory} \\
                         \mathbf{a}_\saNstorage\subb{\mathbf{k}} &\otherwhen \mathbf{a} \ne \none \wedge \mathbf{k} \in \keys{\mathbf{a}_\saNstorage}\,,\ \where \mathbf{k} = \memory\subrange{k_O}{k_Z} \\
                         \none &\otherwise
                       \end{cases} \\
                       \using f &= \min(\registers_{11}, \len{\mathbf{v}}) \\
                       \using l &= \min(\registers_{12}, \len{\mathbf{v}} - f) \\
                       \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                         \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                         \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                         \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                       \end{cases}
                     \end{aligned}$
  (lr)1-1(lr)2-2   
  `write` = 4      
  $g = 10$         $\begin{aligned}
                       \using \sq{k_O, k_Z, v_O, v_Z} &= \registers\subrange{7}{4} \\
                       \using \mathbf{k} &= \begin{cases}
                         \memory\subrange{k_O}{k_Z} &\when \Nrange{k_O}{k_Z} \subseteq \readable{\memory} \\
                         \error &\otherwise
                       \end{cases} \\
                       \using \mathbf{a} &= \begin{cases}
                         \mathbf{s}\,,\ \exc \keys{\mathbf{a}_\saNstorage} = \keys{\mathbf{a}_\saNstorage} \setminus \set{k} & \when v_Z = 0 \\
                         \mathbf{s}\,,\ \exc \mathbf{a}_\saNstorage\subb{\mathbf{k}} = \memory\subrange{v_O}{v_Z} &\otherwhen \Nrange{v_O}{v_Z} \subseteq \readable{\memory} \\
                         \error &\otherwise
                       \end{cases} \\
                       \using l &= \begin{cases}
                         \len{\mathbf{s}_\saNstorage\subb{k}} &\when \mathbf{k} \in \keys{\mathbf{s}_\saNstorage} \\
                         \mathtt{NONE} &\otherwise
                       \end{cases} \\
                       \tup{\execst', \registers'_7, \mathbf{s}'} &\equiv \begin{cases}
                         \tup{\panic, \registers_7, \mathbf{s}} &\when \mathbf{k} = \error \vee \mathbf{a} = \error\\
                         \tup{\blacktriangleright, \mathtt{FULL}, \mathbf{s}} &\otherwhen \mathbf{a}_\saNminbalance > \mathbf{a}_\saNbalance \\
                         \tup{\blacktriangleright, l, \mathbf{a}} &\otherwise\\
                       \end{cases}
                     \end{aligned}$
  (lr)1-1(lr)2-2   
  `info` = 5       
  $g = 10$         $\begin{aligned}
                       \using \mathbf{a} &= \begin{cases}
                         \mathbf{d}\subb{s} &\when \registers_7 = 2^{64} - 1 \\
                         \mathbf{d}\subb{\registers_7} &\otherwise
                       \end{cases} \\
                       \using o &= \registers_8 \\
                       \using \mathbf{v} &= \begin{cases}
                         \encode{
                           \mathbf{a}_\saNcodehash,
                           \encode[8]{\mathbf{a}_\saNbalance, \mathbf{a}_\saNminbalance, \mathbf{a}_\saNminaccgas, \mathbf{a}_\saNminmemogas, \mathbf{a}_\saNoctets},
                           \encode[4]{\mathbf{a}_\saNitems},
                           \encode[8]{\mathbf{a}_\saNgratis},
                           \encode[4]{\mathbf{a}_\saNcreated, \mathbf{a}_\saNlastacc, \mathbf{a}_\saNparent}
                         } &\when \mathbf{a} \ne \none \\
                         \none &\otherwise
                       \end{cases} \\
                       \using f &= \min(\registers_{9}, \len{\mathbf{v}}) \\
                       \using l &= \min(\registers_{10}, \len{\mathbf{v}} - f) \\
                       \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                         \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                         \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                         \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                       \end{cases}
                     \end{aligned}$
  ---------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
