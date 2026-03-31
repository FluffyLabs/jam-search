---
type: graypaper_section
title: D.1 Serialization
index: 155
---
The serialization of state primarily involves placing all the various components of $\thestate$ into a single mapping from 31-octet sequence *state-keys* to octet sequences of indefinite length. The state-key is constructed from a hash component and a chapter component, equivalent to either the index of a state component or, in the case of the inner dictionaries of $\accounts$, a service index.

We define the state-key constructor functions $C$ as: $$C\colon\abracegroup{
    \Nbits{8} \cup \tup{\Nbits{8}, \serviceid} \cup \tup{\serviceid, \blob} &\to \blob[31] \\
    i \in \Nbits{8} &\mapsto \sq{i, 0, 0, \dots} \\
    \tup{i, s \in \serviceid} &\mapsto \sq{i, n_0, 0, n_1, 0, n_2, 0, n_3, 0, 0, \dots}\ \where n = \encode[4]{s} \\
    \tup{s, h} &\mapsto \sq{n_0, a_0, n_1, a_1, n_2, a_2, n_3, a_3, a_4, a_5, \dots, a_{26}}\ \where n = \encode[4]{s}, a = \blake{h}
  }$$

The state serialization is then defined as the dictionary built from the amalgamation of each of the components. Cryptographic hashing ensures that there will be no duplicate state-keys given that there are no duplicate inputs to $C$. Formally, we define $T$ which transforms some state $\thestate$ into its serialized form: $$T(\thestate) \equiv \abracegroup{
    &&C(1) &\mapsto \encode{\sq{\build{\var{x}}{x \orderedin \authpool}}} \;, \\
    &&C(2) &\mapsto \encode{\authqueue} \;, \\
    &&C(3) &\mapsto \encode{
      \var{\sq{\build{
        \tup{\rhNheaderhash, \rhNaccoutlogsuperpeak, \rhNstateroot, \var{\rhNreportedpackagehashes}}
      }{
        \tup{\rhNheaderhash, \rhNaccoutlogsuperpeak, \rhNstateroot, \rhNreportedpackagehashes} \orderedin \recenthistory
      }}},
      \mmrencode{\accoutbelt}
    } \;, \\
    &&C(4) &\mapsto \encode{
      \pendingset,
      \epochroot,
      \abracegroupboth{
        0\ &\when \sealtickets \in \sequence[\Cepochlen]{\safroleticket}\\
        1\ &\when \sealtickets \in \sequence[\Cepochlen]{\bskey}\\
      },
      \sealtickets,
      \var{\ticketaccumulator}
    } \;, \\
    &&C(5) &\mapsto \encode{
      \var{\sqorderby{x}{x \in \goodset}},
      \var{\sqorderby{x}{x \in \badset}},
      \var{\sqorderby{x}{x \in \wonkyset}},
      \var{\sqorderby{x}{x \in \offenders}}
    } \;, \\
    &&C(6) &\mapsto \encode{\entropy} \;, \\
    &&C(7) &\mapsto \encode{\stagingset} \;, \\
    &&C(8) &\mapsto \encode{\activeset} \;, \\
    &&C(9) &\mapsto \encode{\previousset} \;, \\
    &&C(10) &\mapsto \encode{
      \sq{\build{
        \maybe{\tup{\rsNworkreport, \encode[4]{\rsNtimestamp}}}
      }{
        \tup{\rsNworkreport, \rsNtimestamp} \orderedin \reports
      }}
    } \;, \\
    &&C(11) &\mapsto \encode[4]{\thetime} \;, \\
    &&C(12) &\mapsto \encode{
      \encode[4]{\manager, \assigners, \delegator, \registrar},
      \alwaysaccers
    } \;, \\
    &&C(13) &\mapsto \encode{
      \encode[4]{\valstatsaccumulator, \valstatsprevious},
      \corestats,
      \servicestats
    } \;, \\
    &&C(14) &\mapsto \encode{
      \sq{\build{
        \var{\sq{\build{
          \tup{\mathbf{r}, \var{\mathbf{d}}}
        }{
          \tup{\mathbf{r}, \mathbf{d}} \orderedin \mathbf{i}
        }}}
      }{
        \mathbf{i} \orderedin \ready
      }}
    } \;, \\
    &&C(15) &\mapsto \encode{
      \sq{\build{\var{\mathbf{i}}}{\mathbf{i} \orderedin \accumulated}}
    } \;, \\
    &&C(16) &\mapsto \encode{
      \var{\sq{\build{\tup{\encode[4]{s}, \encode{h}}}{\tup{s, h} \orderedin \lastaccout}}}
    } \;, \\
    \forall \kv{s}{\saX} \in \accounts: &&C(255, s) &\mapsto \encode{
      0,
      \saX_\saNcodehash,
      \encode[8]{
        \saX_\saNbalance,
        \saX_\saNminaccgas,
        \saX_\saNminmemogas,
        \saX_\saNoctets,
        \saX_\saNgratis
      },
      \encode[4]{
        \saX_\saNitems,
        \saX_\saNcreated,
        \saX_\saNlastacc,
        \saX_\saNparent
      }
    } \;, \\
    \forall \kv{s}{\saX} \in \accounts, \kv{\mathbf{k}}{\mathbf{v}} \in \saX_\saNstorage:
      &&C(s, \encode[4]{2^{32}-1} \concat \mathbf{k}) &\mapsto \mathbf{v} \;, \\
    \forall \kv{s}{\saX} \in \accounts, \kv{h}{\mathbf{p}} \in \saX_\saNpreimages:
      &&C(s, \encode[4]{2^{32}-2} \concat h) &\mapsto \mathbf{p} \;, \\
    \forall \kv{s}{\saX} \in \accounts, \kv{\tup{h, l}}{\mathbf{t}} \in \saX_\saNrequests:
      &&C(s, \encode[4]{l} \concat h) &\mapsto \encode{
        \var{\sq{\build{\encode[4]{x}}{x \orderedin \mathbf{t}}}}
      }
  }$$

Note that most rows describe a single mapping between a key derived from a natural and the serialization of a state component. However, the final four rows each define sets of mappings since these items act over all service accounts and in the case of the final three rows, the keys of a nested dictionary with the service.

Also note that all non-discriminator numeric serialization in state is done in fixed-length according to the size of the term.

Finally, be aware that JAM does not allow service storage keys to be directly inspected or enumerated. Thus the key values themselves are not required to be known by implementations, and only the Merklisation-ready serialisation is important, which is a fixed-size hash (alongside the service index and item marker). Implementations are free to use this fact in order to avoid storing the keys themselves.
