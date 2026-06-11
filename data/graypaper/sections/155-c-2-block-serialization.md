---
type: graypaper_section
title: C.2 Block Serialization
index: 155
---
A block $\block$ is serialized as a tuple of its elements in regular order, as implied in equations [eq:block], [eq:extrinsic] and [eq:header]. For the header, we define both the regular serialization and the unsigned serialization $\fnencodeunsignedheader$. Formally:

$$\begin{aligned}
  \encode{\block} &= \encode{
    \header,
    \encodetickets{\xttickets},
    \encodepreimages{\xtpreimages},
    \encodeguarantees{\xtguarantees},
    \encodeassurances{\xtassurances},
    \encodedisputes{\xtdisputes}
  }
  \\
  \encodetickets{\xttickets} &= \encode{
    \var{\sq{\build{
      \tup{\encode[1]{\xtNentryindex}, \xtNproof}
    }{
      \tup{\xtNentryindex, \xtNproof} \orderedin \xttickets}
    }}}
  \\
  \encodepreimages{\xtpreimages} &= \encode{
    \var{\sq{\build{
      \tup{\encode[4]{\xpNserviceindex}, \var{\xpNdata}}
    }{
      \tup{\xpNserviceindex, \xpNdata} \orderedin \xtpreimages}
    }}}
  \\
  \encodeguarantees{\xtguarantees} &= \encode{\var{\xtguarantees}}
  \\
  \encodeassurances{\xtassurances} &= \encode{
    \var{\sq{\build{
      \tup{\xaNanchor, \xaNavailabilities, \encode[2]{\xaNassurer}, \xaNsignature}
    }{
      \tup{\xaNanchor, \xaNavailabilities, \xaNassurer, \xaNsignature} \orderedin \xtassurances}
    }}}
  \\
  \encodedisputes{\tup{\mathbf{v}, \mathbf{c}, \mathbf{f}}} &= \encode{
    \var{\sq{\build{
      \tup{\xvNreporthash, \encode[4]{\xvNepochindex},
        \var{\sq{\build{
          \tup{\xvjNvalidity, \encode[2]{\xvjNjudgeindex}, \xvjNsignature}
        }{
          \tup{\xvjNvalidity, \xvjNjudgeindex, \xvjNsignature} \orderedin \xvNjudgments
        }}
      }}
    }{
      \tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \orderedin \mathbf{v}
    }}},
    \var{\mathbf{c}},
    \var{\mathbf{f}}
  }
  \\
  \encode{\header} &= \encode{
    \encodeunsignedheader{\header},
    \H_\Nsealsig
  }
  \\
  \encodeunsignedheader{\header} &= \encode{
    \H_\Nparent,
    \H_\Npriorstateroot,
    \H_\Nextrinsichash,
    \encode[4]{\H_\Ntimeslot},
    \encodeepochmark{\H_\Nepochmark},
    \maybe{\H_\Nwinnersmark},
    \encode[2]{\H_\Nauthorindex},
    \H_\Nvrfsig,
    \var{\H_\Noffendersmark}
  }
  \\
  \encodeepochmark{\none} &= \encode{0}
  \\
  \encodeepochmark{\tup{\entropyaccumulator, \entropy_1, \mathbf{k}}} &= \encode{1, \entropyaccumulator, \entropy_1, \var{\mathbf{k}}}
  \\
  \encode{\wcX \in \workcontext} &\equiv \encode{
    \wcX_\wcNanchorhash,
    \encode[4]{\wcX_\wcNanchortime},
    \wcX_\wcNanchorpoststate,
    \wcX_\wcNanchoraccoutlog,
    \wcX_\wcNlookupanchorhash,
    \encode[4]{\wcX_\wcNlookupanchortime},
    \wcX_\wcNlookupanchorpoststate,
    \var{\wcX_\wcNprerequisites}
  }
  \\
  \encode{\asX \in \avspec} &\equiv \encode{
    \asX_\asNpackagehash,
    \encode[4]{\asX_\asNbundlelen},
    \asX_\asNerasureroot,
    \encode[2]{\asX_\asNerasureshards},
    \asX_\asNsegroot,
    \encode[2]{\asX_\asNsegcount}
  }
  \\
  \encode{\wdX \in \workdigest} &\equiv \encode{
    \encode[4]{\wdX_\wdNserviceindex},
    \wdX_\wdNcodehash,
    \wdX_\wdNpayloadhash,
    \encode[8]{\wdX_\wdNgaslimit},
    O\left(\wdX_\wdNresult\right),
    % These are variable length, since we never access them individually, digests
    % are never accessed directly by the PVM and space is at a premium here.
    \wdX_\wdNgasused,
    \wdX_\wdNimportcount,
    \wdX_\wdNxtcount,
    \wdX_\wdNxtsize,
    \wdX_\wdNexportcount
  }
  \\
  \encode{\wrX \in \workreport} &\equiv \encode{
    \wrX_\wrNavspec,
    \wrX_\wrNcontext,
    \wrX_\wrNcore,
    \wrX_\wrNauthorizer,
    \wrX_\wrNauthgasused,
    \var{\wrX_\wrNauthtrace},
    \var{\wrX_\wrNsrlookup},
    \var{\wrX_\wrNdigests}
  }
  \\
  \encode{\gX \in \guarantee} &\equiv \encode{
    \gX_\gNworkreport,
    \encode[4]{\gX_\gNtimeslot},
    \var{\sq{\build{\tup{\encode[2]{v}, s}}{\tup{v, s} \orderedin \gX_\gNcredential}}}
  }
  \\
  \encode{\wpX \in \workpackage} &\equiv \encode{
    \encode[4]{\wpX_\wpNauthcodehost},
    \wpX_\wpNauthcodehash,
    \wpX_\wpNcontext,
    \var{\wpX_\wpNauthtoken},
    \var{\wpX_\wpNauthconfig},
    \var{\wpX_\wpNworkitems}
  }
  \\
  \encode{\wiX \in \workitem} &\equiv \encode{
    \encode[4]{\wiX_\wiNserviceindex},
    \wiX_\wiNcodehash,
    \encode[8]{\wiX_\wiNrefgaslimit},
    \encode[8]{\wiX_\wiNaccgaslimit},
    \encode[2]{\wiX_\wiNexportcount},
    \var{\wiX_\wiNpayload},
    \var{I^\#\left(\wiX_\wiNimportsegments\right)},
    \var{\sq{\build{
      \tup{h, \encode[4]{i}}
    }{
      \tup{h, i} \orderedin \wiX_\wiNextrinsics
    }}}
  }
  \\
  \encode{\stX \in \safroleticket} &\equiv \encode{
    \stX_\stNid,
    \encode[1]{\stX_\stNentryindex}
  }
  \\
  \encode{\dxX \in \defxfer} &\equiv \encode{
    1,
    \encode[4]{\dxX_\dxNsource},
    \encode[4]{\dxX_\dxNdest},
    \encode[8]{\dxX_\dxNamount},
    \dxX_\dxNmemo,
    \encode[8]{\dxX_\dxNgas}
  }
  \\
  \encode{\otX \in \operandtuple} &\equiv \encode{
    0,
    \otX_\otNpackagehash,
    \otX_\otNsegroot,
    \otX_\otNauthorizer,
    \otX_\otNpayloadhash,
    \otX_\otNgaslimit,
    O\left(\otX_\otNresult\right),
    \var{\otX_\otNauthtrace}
  }
  \\
  O\left(o \in \workerror \cup \blob\right) &\equiv \begin{cases}
    \tup{0, \var{o}} &\when o \in \blob \\
    1 &\when o = \infty \\
    2 &\when o = \panic \\
    3 &\when o = \badexports \\
    4 &\when o = \oversize \\
    5 &\when o = \token{BAD} \\
    6 &\when o = \token{BIG}
    \\
  \end{cases}
  \\
  I\left(\tup{
    h \in \hash \cup \hash^\boxplus,
    i \in \Nbits{15}
  }\right) &\equiv \begin{cases}
    \tup{h, \encode[2]{i}} &\when h \in \hash\\
    \tup{r, \encode[2]{i + 2^{15}}} &\when \exists r \in \hash, h = r^\boxplus\\
  \end{cases}\end{aligned}$$

Note the use of $O$ above to succinctly encode the result of a work item and the slight transformations of e.g. $\xtguarantees$ and $\xtpreimages$ to take account of the fact their inner tuples contain variable-length sequence terms $a$ and $p$ which need length discriminators.
