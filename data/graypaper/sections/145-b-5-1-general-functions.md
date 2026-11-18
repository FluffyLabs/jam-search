---
type: graypaper_section
title: B.5.1 General Functions
index: 145
---
These make no assumptions about the context $\context$; it is always passed through untouched, i.e. $\context' = \context$.

= 1.5mm = 2mm

  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            
  **Identifier**            
  **Gas usage (**$g$**)**   
  (lr)1-1(lr)2-2            
  `gas` = 0                 $\begin{aligned}
                                \registers'_7 &\equiv \gascounter^* \\
                                g &\equiv \CgasG
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `grow_heap` = 1           $\begin{aligned}
                                % This hostcall can be used to expand the RW data region of memory, or to query its size.
                                %
                                % It takes a single argument: the index of last writable page (plus one) the user would like
                                % to be able to access within the RW data region of the address space.
                                %
                                % It returns the index (plus one) of the last writable page in the RW data region, regardless
                                % of whether anything has changed.
                                %
                                % Extract the RO data size and the stack size from the JAM program blob.
                                \using (\mathbf{o}, s) &\mapsto \jamNblob \text{ according to eq. \ref{eq:jamblobformat}} \\
                                % Page index of the start of the RW data region.
                                \using a &= \frac{2\Cpvminitzonesize + \rnq{\len{\mathbf{o}}}}{\Cpvmpagesize} \\
                                % Page index plus one of the last possible RW data region page.
                                \using b &= \frac{2^{32} - 3\Cpvminitzonesize - \Cpvminitinputsize - \rnq{s}}{\Cpvmpagesize} \\
                                % Current writable page count of the RW data region.
                                \using c &= |\set{\build{p \in \Nclamp{a}{b}}{\memory_\ramNaccess\subb{p} = \mathrm{W}}}| \\
                                % Current heap pointer.
                                \using h &= a + c \\
                                \registers'_7 &\equiv \begin{cases}
                                  % Do nothing if the heap is large enough already, or if the requested size was too large.
                                  h &\when \registers_7 \leq h \lor \registers_7 > b \\
                                  % Expand the accessible RW data region.
                                  \registers_7 &\otherwise
                                \end{cases}\\
                                (\memory'_\ramNaccess)\interval{a}{\registers_7'} &\equiv \sq{\mathrm{W}, \dots, \mathrm{W}} \\
                                g &\equiv \CgasGeminiconst + (\registers_7' - h) \cdot \CgasGeminilinear
                              \end{aligned}$
  (lr)1-1(lr)2-2            
  `fetch` = 2               $\begin{aligned}
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
                                      \encode[4]{\Cmaxinputsize},
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
                                \end{cases} \\
                                g &\equiv \begin{cases}
                                  \CgasYc{\registers_{10}} + \fnmemgas(\CgasYl{\registers_{10}}, z) &\when \registers_{10} < 16 \\
                                  \CgasYunknown &\otherwise
                                \end{cases}
                              \end{aligned}$
  ------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
