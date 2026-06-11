---
type: graypaper_section
title: B.5 General Functions
index: 143
---
We come now to defining the host functions which are utilized by the PVM invocations. Generally, these map some PVM state, including invocation context, possibly together with some additional parameters, to a new PVM state.

The general functions are all broadly of the form $\tup{\gascounter' \in \signedgas, \registers' \in \sequence[13]{\pvmreg}, \memory' \in \ram} = \Omega_\square(\gascounter \in \gas, \registers \in \sequence[13]{\pvmreg}, \memory \in \ram)$. Functions which have a result component which is equivalent to the corresponding argument may have said components elided in the description. Functions may also depend upon particular additional parameters.

Unlike the Accumulate functions in appendix 25.7, these do not mutate an accumulation context. Some, such as $\mathtt{write}$ mutate a service account and both accept and return some $\mathbf{s} \in \serviceaccount$. Others are more general functions, such as $\mathtt{fetch}$ and do not assume any context but have a parameter list suffixed with an ellipsis to denote that the context parameter may be taken and is provided transparently into its result. This allows it to be easily utilized in multiple PVM invocations.

Elements of PVM state are each assumed to remain unchanged by the host-call unless explicitly specified. $$\begin{aligned}
  \gascounter' &\equiv \gascounter - g\text{ unless $\gascounter'$ is explicitly defined below}\\
  \tup{\execst', \registers', \memory', \mathbf{s}'} &\equiv \begin{cases}
    \tup{\oog, \registers, \memory, \mathbf{s}} &\when \gascounter < g\\
    \tup{\blacktriangleright, \registers, \memory, \mathbf{s}} \text{ except as indicated below} &\otherwise
  \end{cases}\end{aligned}$$

Memory-sized gas for host-calls is given by a rate $L$ (gas per 1024 octets) and size $\ell$ (octets). The following defines the gas cost for such a size: $$
  \fnmemgas(L, \ell) \equiv \ceil{\frac{L \cdot \ell}{1024}}$$ With base cost $c$, total gas is $c + \fnmemgas(L, \ell)$. The host-call table below uses this formula for all memory-sized terms.

= 1.5mm = 2mm

  --------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                                          
  **Identifier**                                                                          
  **Gas usage (**$g$**)**                                                                 
  (lr)1-1(lr)2-2                                                                          
  `gas` = 0                                                                               
  $g = \CgasG$                                                                            $\begin{aligned}
                                                                                              \registers'_7 &\equiv \gascounter'
                                                                                            \end{aligned}$
  (lr)1-1(lr)2-2                                                                          
  `grow_heap` = 1                                                                         
  $g = \CgasGeminiconst + (\registers_7 - h) \cdot \CgasGeminilinear$                     $\begin{aligned}
                                                                                              % This hostcall can be used to expand the RW data region of memory, or to query its size.
                                                                                              %
                                                                                              % It takes a single argument: the index of last writable page (plus one) the user would like
                                                                                              % to be able to access within the RW data region of the address space.
                                                                                              %
                                                                                              % It returns the index (plus one) of the last writable page in the RW data region, regardless
                                                                                              % of whether anything has changed.
                                                                                              %
                                                                                              % Extract the RO data size and the stack size from the JAM program blob.
                                                                                              \using (\mathbf{o}, s) &\mapsto \jamNblob \text{ according to eq. \ref{eq:conditions}} \\
                                                                                              % Page index of the start of the RW data region.
                                                                                              \using a &= \frac{2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}}}{\Cpvmpagesize} \\
                                                                                              % Page index plus one of the last possible RW data region page.
                                                                                              \using b &= \frac{2^{32} - 3\Cpvminitzonesize - \Cpvminitinputsize - \rnp{s}}{\Cpvmpagesize} \\
                                                                                              % Current writable page count of the RW data region.
                                                                                              \using c &= |\set{\build{p \in \Nclamp{a}{b}}{\memory_\ramNaccess\subb{p} = \mathrm{W}}}| \\
                                                                                              % Current heap pointer.
                                                                                              \using h &= a + c \\
                                                                                              \tup{\execst', \gascounter', \registers'_7} &\equiv \begin{cases}
                                                                                                % Do nothing if the heap is large enough already, or if the requested size was too large.
                                                                                                \tup{\blacktriangleright, \gascounter - \CgasGeminiconst, h} &\when \registers_7 \leq h \lor \registers_7 > b \\
                                                                                                % Only enlarge the heap if we have enough gas; otherwise abort with OOG.
                                                                                                \tup{\oog, \gascounter, h} &\otherwhen \gascounter < g \\
                                                                                                % Charge gas and expand the accessible RW data region.
                                                                                                \tup{\blacktriangleright, \gascounter - g, \registers_7} &\otherwise \\
                                                                                              \end{cases}\\
                                                                                              (\memory'_\ramNaccess)\interval{a}{\registers_7'} &\equiv \sq{\mathrm{W}, \dots, \mathrm{W}}
                                                                                            \end{aligned}$
  (lr)1-1(lr)2-2                                                                          
  `fetch` = 2                                                                             
  $g = \CgasYc{c} + \fnmemgas(\CgasYl{c}, z)$                                             $\begin{aligned}
                                                                                              \using c &= \begin{cases}
                                                                                                \registers_{10} &\when \registers_{10} < 16 \\
                                                                                                \none &\otherwise
                                                                                              \end{cases} \\
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
                                                                                                    \encode[2]{\Cauthpoolsize},
                                                                                                    \encode[2]{\Cslotseconds},
                                                                                                    \encode[2]{\Cauthqueuesize},
                                                                                                    \encode[2]{\Crotationperiod},
                                                                                                    \encode[2]{\Cmaxpackagexts},
                                                                                                    \encode[2]{\Cassurancetimeoutperiod},\\
                                                                                                    &\encode[4]{\Cmaxauthcodesize},
                                                                                                    \encode[4]{\Cmaxbundlesize},
                                                                                                    \encode[4]{\Cmaxservicecodesize},
                                                                                                    \encode[4]{\Cmaxpackageimports},
                                                                                                    \encode[4]{\Cmaxreportvarsize},\\
                                                                                                    &\encode[4]{\Cmemosize},
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
                                                                                              \using \sq{o, f_0, z} &= \registers\subrange{7}{3} \\
                                                                                              \using f &= \min(f_0, \len{\mathbf{v}}) \\
                                                                                              \using l &= \min(z, \len{\mathbf{v}} - f) \\
                                                                                              \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                                                                                \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \Nrange{o}{l} \not\subseteq \writable{\memory} \\
                                                                                                \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                                                                                \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                                                                              \end{cases}
                                                                                            \end{aligned}$
  (lr)1-1(lr)2-2                                                                          
  `lookup` = 3                                                                            
  $g = \CgasLconst + \fnmemgas(\CgasLlinear, z)$                                          $\begin{aligned}
                                                                                              \using \mathbf{a} &= \begin{cases}
                                                                                                \mathbf{s} &\when \registers_7 \in \set{ s, 2^{64} - 1 } \\
                                                                                                \mathbf{d}[\registers_7] &\otherwhen \registers_7 \in \keys{\mathbf{d}} \\
                                                                                                \none &\otherwise
                                                                                              \end{cases} \\
                                                                                              \using \sq{h, o} &= \registers\subrange{8}{2} \\
                                                                                              \using z &= \registers_{11} \\
                                                                                              \using \mathbf{v} &= \begin{cases}
                                                                                                \error &\when \Nrange{h}{32} \not\subseteq \readable{\memory} \\
                                                                                                \none &\otherwhen \mathbf{a} = \none \vee \memory\subrange{h}{32} \not\in \keys{\mathbf{a}_\saNpreimages} \\
                                                                                                \mathbf{a}_\saNpreimages[\memory\subrange{h}{32}] &\otherwise \\
                                                                                              \end{cases} \\
                                                                                              \using f &= \min(\registers_{10}, \len{\mathbf{v}}) \\
                                                                                              \using l &= \min(z, \len{\mathbf{v}} - f) \\
                                                                                              \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                                                                                \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                                                                                \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                                                                                \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                                                                              \end{cases}
                                                                                            \end{aligned}$
  (lr)1-1(lr)2-2                                                                          
  `read` = 4                                                                              
  $g = \CgasRconst + \fnmemgas(\CgasRkeylinear, k_Z) + \fnmemgas(\CgasRvallinear, v_Z)$   $\begin{aligned}
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
                                                                                              \using v_Z &= \registers_{12} \\
                                                                                              \using \mathbf{v} &= \begin{cases}
                                                                                                \error &\when \Nrange{k_O}{k_Z} \not\subseteq \readable{\memory} \\
                                                                                                \mathbf{a}_\saNstorage\subb{\mathbf{k}} &\otherwhen \mathbf{a} \ne \none \wedge \mathbf{k} \in \keys{\mathbf{a}_\saNstorage}\,,\ \where \mathbf{k} = \memory\subrange{k_O}{k_Z} \\
                                                                                                \none &\otherwise
                                                                                              \end{cases} \\
                                                                                              \using f &= \min(\registers_{11}, \len{\mathbf{v}}) \\
                                                                                              \using l &= \min(v_Z, \len{\mathbf{v}} - f) \\
                                                                                              \tup{\execst', \registers'_7, \memory'\subrange{o}{l}} &\equiv \begin{cases}
                                                                                                \tup{\panic, \registers_7, \memory\subrange{o}{l}} &\when \mathbf{v} = \error \vee \Nrange{o}{l} \not\subseteq \writable{\memory}\\
                                                                                                \tup{\blacktriangleright, \mathtt{NONE}, \memory\subrange{o}{l}} &\otherwhen \mathbf{v} = \none \\
                                                                                                \tup{\blacktriangleright, \len{\mathbf{v}}, \mathbf{v}\subrange{f}{l}} &\otherwise \\
                                                                                              \end{cases}
                                                                                            \end{aligned}$
  (lr)1-1(lr)2-2                                                                          
  `write` = 5                                                                             
  $g = \CgasWconst + \fnmemgas(\CgasWkeylinear, k_Z) + \fnmemgas(\CgasWvallinear, v_Z)$   $\begin{aligned}
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
  `info` = 6                                                                              
  $g = \CgasI$                                                                            $\begin{aligned}
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
  --------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
