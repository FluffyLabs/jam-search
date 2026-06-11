---
type: graypaper_section
title: 14.4 Computation of Work-Report
index: 95
---
We now come to the work-report computation function $\computereport$. This forms the basis for all utilization of cores on JAM. It accepts some work-package $\wpX$, nominated core $\Ncore$, segment-root dictionary $\wrNsrlookup$, and assurer set size $\asNerasureshards$, and results in either an error $\error$ or the work-report. This function is deterministic and requires only that it be evaluated within eight epochs of a recently finalized block thanks to the historical lookup functionality. It can thus comfortably be evaluated by any node within the auditing period, even allowing for practicalities of imperfect synchronization. Formally: $$
  \computereport \colon \abracegroup{
    &\tuple{\workpackage, \coreindex, \dictionary{\hash}{\hash}, \valcount} \to \workreport \cup \set{\error} \\
    &\tup{\wpX, \Ncore, \wrNsrlookup, \asNerasureshards} \mapsto \begin{cases}
      \error &\when E \\
      \tup{\begin{aligned}
        &\wrNavspec, \is{\wrNcontext}{\wpX_\wpNcontext}, \Ncore, \\
        &\is{\wrNauthorizer}{\wpX_\wpNauthorizer}, \wrNauthtrace, \wrNsrlookup, \wrNdigests, \wrNauthgasused
      \end{aligned}} &\otherwise
    \end{cases}
  }$$

Where: $$\begin{aligned}
  \tup{\wrNauthtrace, \wrNauthgasused} &= \Psi_I(\wpX, \Ncore) \\
  E &= \wrNauthtrace \not\in \blob[:\Cmaxreportvarsize] \vee \keys{\wrNsrlookup} \ne \set{\build{h}{\wiX \in \wpX_\wpNworkitems, \tup{h^\boxplus, n} \in \wiX_\wiNimportsegments}} \\
  \tup{\wrNdigests, \overline{\mathbf{e}}} &= \transpose \sq{\build{
    (C(\wpX_\wpNworkitems\subb{j}, r, u), \mathbf{e})
  }{
    \tup{r, u, \mathbf{e}} = I(\wpX, j),\,
    j \orderedin \Nmax{\len{\wpX_\wpNworkitems}}
  }} \\
  I(\wpX, j) &\equiv \begin{cases}
    \tup{\oversize, u, \sq{\segment_0, \segment_0, \dots}\interval{}{m_\wiNexportcount}} &\when \len{r} + z > \Cmaxreportvarsize\\
    \tup{\badexports, u, \sq{\segment_0, \segment_0, \dots}\interval{}{m_\wiNexportcount}} &\otherwhen \len{\mathbf{e}} \ne m_\wiNexportcount \\
    \tup{r, u, \sq{\segment_0, \segment_0, \dots}\interval{}{m_\wiNexportcount}} &\otherwhen r \not\in \blob \\
    \tup{r, u, \mathbf{e}} &\otherwise \\
    \multicolumn{2}{l}{\where \tup{r, \mathbf{e}, u} = \Psi_R(
      c, j, \wpX, \wrNauthtrace, S^\#_\wrNsrlookup(\wpX_\wpNworkitems), \ell
    )}\\
    \multicolumn{2}{l}{\also h = \blake{\wpX}\,,\; m= \wpX_\wpNworkitems\subb{j}\,,\; \ell = \sum_{k < j}\wpX_\wpNworkitems\subb{k}_\wiNexportcount}\\
    \multicolumn{2}{l}{\also z = \len{\wrNauthtrace} + \sum_{k < j, \tup{r \in \blob, \dots} = I(\wpX, k)} \len{r}}
  \end{cases}\end{aligned}$$

Note that we gracefully handle both the case where the size of the work output would take the work-report beyond its acceptable size and where number of segments exported by a work-item's Refinement execution is incorrectly reported in the work-item's export segment count. In both cases, the work-package continues to be valid as a whole, but the work-item's exported segments are replaced by a sequence of zero-segments equal in size to the export segment count and its output is replaced by an error.

The first term to be introduced, $\tup{\wrNauthtrace, \wrNauthgasused}$, is the authorization trace, the result of the Is-Authorized function together with the amount of gas it used. The Is-Authorized logic must be executed first in order to ensure that the work-package warrants the needed core-time.

The next term, $E$, is $\top$ if there is no valid report for the given arguments. This is the case if the Is-Authorized function fails, or if the segment-root dictionary $\wrNsrlookup$ does not contain the expected entries. $\wrNsrlookup$ is expected to have entries for all unique work-package hashes of imported segments not identified directly via a segment-root but rather through a work-package hash.

In order to expect to be compensated for a work-report they are building, guarantors must compose a value for $\wrNsrlookup$ to ensure not only the above but also a further constraint that all pairs of work-package hashes and segment-roots do properly correspond: $$\begin{aligned}
    &\forall \kv{h}{e} \in \wrNsrlookup : \exists \wpX, \Ncore, \mathbf{d}, \asNerasureshards \in \workpackage, \coreindex, \dictionary{\hash}{\hash}, \valcount :\\
    &\blake{\wpX} = h \wedge (\computereport(\wpX, \Ncore, \mathbf{d}, \asNerasureshards)_\wrNavspec)_\asNsegroot = e
  \end{aligned}$$

As long as the guarantor is unable to satisfy the above constraints, then it should consider the work-package unable to be guaranteed. Auditors are not expected to populate $\wrNsrlookup$ but rather to reuse the value in the work-report they are auditing.

The third term, $\tup{\wrNdigests, \overline{\mathbf{e}}}$ is the sequence of results for each of the work-items in the work-package together with all segments exported by each work-item. The fourth definition $I$ performs an ordered accumulation (i.e. counter) in order to ensure that the Refine function has access to the total number of exports made from the work-package up to the current work-item.

The above relies on two functions, $S_\wrNsrlookup$ and $X$ which, respectively, define the import segment data (utilising the segment-root dictionary $\wrNsrlookup$) and the extrinsic data for some work-item argument $\wiX$. We also define the segment-root lookup function $L_\wrNsrlookup$, which collapses a segment-root or work-package hash into a segment-root, and $J_\wrNsrlookup$, which compiles justifications of segment data: $$\begin{aligned}
    X(\wiX \in \workitem) &\equiv \sq{\build{\mathbf{d}}{(\blake{\mathbf{d}}, \len{\mathbf{d}}) \orderedin \wiX_\wiNextrinsics}} \\
    \forall \wrNsrlookup \in \dictionary{\hash}{\hash} &: \\
    L_\wrNsrlookup(r \in \hash \cup \hash^\boxplus) &\equiv \begin{cases}
      r &\when r \in \hash \\
      \wrNsrlookup\subb{h} &\when \exists h \in \hash: r = h^\boxplus
    \end{cases} \\
    S_\wrNsrlookup(\wiX \in \workitem) &\equiv \sq{\build{\mathbf{b}\subb{n}}{\merklizecd{\mathbf{b}} = L_\wrNsrlookup(r), \tup{r, n} \orderedin \wiX_\wiNimportsegments}} \\
    J_\wrNsrlookup(\wiX \in \workitem) &\equiv \sq{\build{\var{\merklejustsubpath{0}{\mathbf{b}, n}}}{\merklizecd{\mathbf{b}} = L_\wrNsrlookup(r), \tup{r, n} \orderedin \wiX_\wiNimportsegments}}
  \end{aligned}$$

Note that while the formulations of $S_\wrNsrlookup$ and $J_\wrNsrlookup$ seem to require (due to the inner term $\mathbf{b}$) all segments exported by all work-packages exporting a segment to be imported, such a vast amount of data is not generally needed. In particular, each justification can be derived through a single paged-proof. This reduces the worst case data fetching for a guarantor to two segments for every one to be imported. In the case that contiguously exported segments are imported (which we might assume is a fairly common situation), then a single proof-page should be sufficient to justify many imported segments.

Using these three functions, we may now define the *Bundle Assembly* function $\makebundle$, which assembles an audit-friendly bundle from a work-package and a segment-root dictionary. The bundle comprises the work-package itself, the extrinsic data, and the concatenated import segments along with their proofs of correctness. $$
  \makebundle \colon \abracegroup{
    &\tuple{\workpackage, \dictionary{\hash}{\hash}} \to \blob \\
    &\tup{\wpX, \wrNsrlookup} \mapsto \encode{
      \wpX,
      X^\#(\wpX_\wpNworkitems),
      S_\wrNsrlookup^\#(\wpX_\wpNworkitems),
      J_\wrNsrlookup^\#(\wpX_\wpNworkitems)
    }
  }$$

Note the lack of length prefixes: only the Merkle paths for the justifications have a length prefix. All other sequence lengths are determinable through the work package itself.

Finally, we may define $\wrNavspec$ as the data availability specification of the package using $\makebundle$ together with the yet to be defined *Availability Specifier* function $A$ (see section 14.4.1): $$\wrNavspec = A(
    \blake{\wpX},
    \makebundle(\wpX, \wrNsrlookup),
    \concatall{\overline{\mathbf{e}}},
    \asNerasureshards
  )$$

Before executing the Refine function, the guarantor should ensure that all segment-tree roots which form imported segment commitments are known and have not expired. Additionally, the guarantor should ensure that they can fetch all preimage data referenced as the commitments of extrinsic segments.

The guarantor must reconstruct imported segments, though this process may in fact be lazy as the Refine function makes no usage of the data until the *fetch* host-call is made. Fetching generally implies that, for each imported segment, erasure-coded chunks are retrieved from enough unique validators (approximately one third) and is described in more depth in appendix 31. (Since we specify systematic erasure-coding, its reconstruction is trivial in the case that the correct validators are responsive.) Chunks must be fetched for both the data itself and for justification metadata which allows us to ensure that the data is correct.

Validators, in their role as availability assurers, should index such chunks according to the index of the segments-tree whose reconstruction they facilitate. Since the data for segment chunks is so small (12 octets in the case of 1023 assurers), fixed communications costs should be kept to a bare minimum. A good network protocol (out of scope at present) will allow guarantors to specify only the segments-tree root and index together with a Boolean to indicate whether the proof chunk need be supplied. Since we assume enough other validators are online and benevolent, we can assume that the guarantor can compute $S_\wrNsrlookup$ and $J_\wrNsrlookup$ above with confidence, based on the general availability of data committed to with $\mathbf{s}^\clubsuit$, which is specified below. Note that each imported segment must be fetched from the validator set which assured its availability; this set may no longer be active and its size may differ from that of the active validator set.
