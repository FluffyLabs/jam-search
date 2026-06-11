---
type: graypaper_section
title: 14.3 Packages and Items
index: 93
---
We begin by defining a *work-package*, of set $\workpackage$, and its constituent *work-item*s, of set $\workitem$. A work-package includes a simple blob acting as an authorization token $\wpNauthtoken$, the index of the service which hosts the authorization code $\wpNauthcodehost$, an authorization code hash $\wpNauthcodehash$ and a configuration blob $\wpNauthconfig$, a context $\wpNcontext$ and a sequence of work items $\wpNworkitems$: $$
  \workpackage \equiv \tuple{
    \isa{\wpNauthtoken}{\blob},\
    \isa{\wpNauthcodehost}{\serviceid},\
    \isa{\wpNauthcodehash}{\hash},\
    \isa{\wpNauthconfig}{\blob},\
    \isa{\wpNcontext}{\workcontext},\
    \isa{\wpNworkitems}{\sequence[1:\Cmaxpackageitems]{\workitem}}
  }$$

A work item includes: $\wiNserviceindex$ the identifier of the service to which it relates, the code hash of the service at the time of reporting $\wiNcodehash$ (whose preimage must be available from the perspective of the lookup anchor block), a payload blob $\wiNpayload$, gas limits for Refinement and Accumulation $\wiNrefgaslimit$ & $\wiNaccgaslimit$, and the three elements of its manifest, a sequence of imported data segments $\wiNimportsegments$ which identify a prior exported segment through an index and the identity of an exporting work-package, $\wiNextrinsics$, a sequence of extrinsic data hashes and lengths and $\wiNexportcount$ the number of data segments exported by this work item. $$
  \workitem \equiv \tuple{\begin{aligned}
    &\isa{\wiNserviceindex}{\serviceid},
    \isa{\wiNcodehash}{\hash},
    \isa{\wiNpayload}{\blob},
    \isa{\wiNrefgaslimit}{\gas},
    \isa{\wiNaccgaslimit}{\gas},
    \isa{\wiNexportcount}{\N}, \\
    &\isa{\wiNimportsegments}{\sequence{\tuple{\hash \cup (\hash^\boxplus),\N}}},
    \isa{\wiNextrinsics}{\sequence{\tuple{\hash, \N}}}
  \end{aligned}}$$

Note that an imported data segment's work-package is identified through the union of sets $\hash$ and a tagged variant $\hash^\boxplus$. A value drawn from the regular $\hash$ implies the hash value is of the segment-root containing the export, whereas a value drawn from $\hash^\boxplus$ implies the hash value is the hash of the exporting work-package. In the latter case it must be converted into a segment-root by the guarantor and this conversion reported in the work-report for on-chain validation. Work-packages referenced in this manner are considered dependencies, as are work-packages explicitly listed as prerequisites in the context $\wpNcontext$. We limit the total number of dependencies to $\Cmaxreportdeps = 8$: $$\forall \wpX \in \workpackage: \len{\set{\build{h}{\wiX \in \wpX_\wpNworkitems, \tup{h^\boxplus, n} \in \wiX_\wiNimportsegments}}} + \len{(\wpX_\wpNcontext)_\wcNprerequisites} \le \Cmaxreportdeps$$

We limit the total number of exported items to $\Cmaxpackageexports = 3072$, the total number of imported items to $\Cmaxpackageimports = 3072$, and the total number of extrinsics to $\Cmaxpackagexts = 128$: $$
  \!\!\!\!
  \begin{aligned}
    &\forall \wpX \in \workpackage: \\
    &\ \sum_{\wiX \in \wpX_\wpNworkitems} \wiX_\wiNexportcount \le \Cmaxpackageexports \wedge\
    \sum_{\wiX \in \wpX_\wpNworkitems} \len{\wiX_\wiNimportsegments} \le \Cmaxpackageimports \wedge\
    \sum_{\wiX \in \wpX_\wpNworkitems} \len{\wiX_\wiNextrinsics} \le \Cmaxpackagexts
  \end{aligned}$$

We make an assumption that the preimage to each extrinsic hash in each work-item is known by the guarantor. In general this data will be passed to the guarantor alongside the work-package.

We limit the total size of the auditable *work-bundle*, containing the work-package, import and extrinsic items, together with all payloads, the authorizer configuration and the authorization token to around 13.6MB. This limit allows 2MB/s/core D$^{3}$L imports, and thus a full complement of 3,072 imports, assuming no extrinsics, 64 bytes for each of the authorization token and trace, and a work-item payload of 4KB: $$\begin{aligned}
  
  &\begin{aligned}
    &\forall \wpX \in \workpackage: \Big(\len{\wpX_\wpNauthtoken} + \len{\wpX_\wpNauthconfig} +
    \!\!\sum_{\wiX \in \wpX_\wpNworkitems}\!\!S(\wiX)\Big) \le \Cmaxbundlesize \\
    &\where S(\wiX \in \workitem) \equiv \len{\wiX_\wiNpayload} + \len{\wiX_\wiNimportsegments}\cdot\Csegmentfootprint + \!\!\!\!\!\!\sum_{\tup{h, l} \in \wiX_\wiNextrinsics} \!\!\!l
  \end{aligned}\\
  
  &\Csegmentfootprint \equiv \Csegmentsize + 32\ceil{\log_2(\Cmaxpackageexports)}\\
  &\Cmaxbundlesize \equiv \Cmaxpackageimports\cdot\Csegmentfootprint + 4096 + 64 + 64 = 13,791,360\end{aligned}$$

We limit the sums of each of the two gas limits to be at most the maximum gas allocated to a core for the corresponding operation: $$
  \forall \wpX \in \workpackage:\ \;
    \sum_{\wiX \in \wpX_\wpNworkitems}(\wiX_\wiNaccgaslimit) < \Creportaccgas
  \quad\wedge\ \;
    \sum_{\wiX \in \wpX_\wpNworkitems}(\wiX_\wiNrefgaslimit) < \Cpackagerefgas$$

Given the result $\wdNresult$ and gas used $\wdNgasused$ of some work-item, we define the item-to-digest function $C$ as: $$C\colon\abracegroup{
    \tuple{\workitem, \blob \cup \workerror, \gas} &\to \workdigest\\
    \tup{\tup{\begin{aligned}
      &\Nserviceindex, \Ncodehash, \Npayload,\\
      &\wiNaccgaslimit, \Nexportcount, \wiNimportsegments, \wiNextrinsics
    \end{aligned}
    }, \wdNresult, \wdNgasused} &\mapsto \tup{\begin{aligned}
      &\wdNserviceindex,\,
      \wdNcodehash,\,
      \is{\wdNpayloadhash}{\blake{\Npayload}},\,
      \is{\wdNgaslimit}{\wiNaccgaslimit},\,
      \wdNresult,\,
      \wdNgasused,\\
      &\is{\wdNimportcount}{\len{\wiNimportsegments}},\,
      \wdNexportcount,\,
      \is{\wdNxtcount}{\len{\wiNextrinsics}},\,
      \is{\wdNxtsize}{\!\!\!\!\sum_{\tup{h, z} \in \wiNextrinsics}\!\!\!\!z}
    \end{aligned}}\!\!\!\!
  }$$

We define the work-package's implied authorizer as $\wpX_\wpNauthorizer$, the hash of the authorization code hash concatenated with the configuration. We define the authorization code as $\wpX_\wpNauthcode$ and require that it be available at the time of the lookup anchor block from the historical lookup of service $\wpX_\wpNauthcodehost$. Formally: $$\forall \wpX \in \workpackage: \abracegroup[\,]{
    \wpX_\wpNauthorizer &\equiv \blake{\wpX_\wpNauthcodehash \concat \wpX_\wpNauthconfig} \\
    \encode{\var{\wpX_\wpNmetadata}, \wpX_\wpNauthcode} &\equiv \histlookup(\accounts\subb{\wpX_\wpNauthcodehost}, (\wpX_\wpNcontext)_\wcNlookupanchortime, \wpX_\wpNauthcodehash) \\
    \tup{\wpX_\wpNmetadata, \wpX_\wpNauthcode} &\in \tuple{\blob, \blob}
  }$$

(The historical lookup function, $\histlookup$, is defined in equation [eq:historicallookup].)
