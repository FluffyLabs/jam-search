---
type: graypaper_section
title: I.4.4 Constants
index: 181
---
$\Ctrancheseconds = 8$

:   The period, in seconds, between audit tranches. See section 17.3.

$\Citemdeposit = 10$

:   The additional minimum balance required per item of elective service state. See equation [eq:deposits].

$\Cbytedeposit = 1$

:   The additional minimum balance required per octet of elective service state. See equation [eq:deposits].

$\Cbasedeposit = 100$

:   The basic minimum balance which all services require. See equation [eq:deposits].

$\Ccorecount = 341$

:   The total number of cores.

$\Cexpungeperiod = 19,200$

:   The period in timeslots after which an unreferenced preimage may be expunged. See `eject` definition in section 25.7.

$\Cepochlen = 600$

:   The length of an epoch in timeslots. See section 4.8.

$\Cauditbiasfactor = 2$

:   The audit bias factor, the expected number of additional validators who will audit a work-report in the following tranche for each no-show in the previous. See equation [eq:latertranches].

$\Creportaccgas = 10,000,000$

:   The gas allocated to invoke a work-report's Accumulation logic.

$\Cpackageauthgas = 50,000,000$

:   The gas allocated to invoke a work-package's Is-Authorized logic.

$\Cpackagerefgas = 5,000,000,000$

:   The gas allocated to invoke a work-package's Refine logic.

$\Cblockaccgas = 3,500,000,000$

:   The total gas allocated across for all Accumulation. Should be no smaller than $\Creportaccgas\cdot\Ccorecount + \sum_{g \in \values{\alwaysaccers}}(g)$.

$\Crecenthistorylen = 8$

:   The size of recent history, in blocks. See equation [eq:recenthistorydef].

$\Cmaxpackageitems = 16$

:   The maximum amount of work items in a package. See equations [eq:workreport] and [eq:workpackage].

$\Cmaxreportdeps = 8$

:   The maximum sum of dependency items in a work-report. See equation [eq:limitreportdeps].

$\Cmaxblocktickets = 16$

:   The maximum number of tickets which may be submitted in a single extrinsic. See equation [eq:enforceticketlimit].

$\Cmaxlookupanchorage = 14,400$

:   The maximum age in timeslots of the lookup anchor. See equation [eq:limitlookupanchorage].

$\mathsf{M}$

:   Host-function gas costs, see below.

$\Cmaxextrinsicverdicts = 16$

:   The maximum number of verdicts which may be included in a single extrinsic. See equation [eq:disputesextrinsics].

$\Cmaxextrinsicoffenses = 16$

:   The maximum number each of culprits or faults which may be included in a single extrinsic. See equation [eq:disputesextrinsics].

$\Cauthpoolsize = 8$

:   The maximum number of items in the authorizations pool. See equation [eq:authstatecomposition].

$\Cslotseconds = 6$

:   The slot period, in seconds. See equation 4.8.

$\Cauthqueuesize = 80$

:   The number of items in the authorizations queue. See equation [eq:authstatecomposition].

$\Crotationperiod = 10$

:   The rotation period of validator-core assignments, in timeslots. See sections 11.3 and 11.4.

$\Cminpublicindex = 2^{16}$

:   The minimum public service index. Services of indices below these may only be created by the Registrar. See equation [eq:newserviceindex].

$\Cmaxpackagexts = 128$

:   The maximum number of extrinsics in a work-package. See equation [eq:limitworkpackagebandwidth].

$\Cassurancetimeoutperiod = 5$

:   The period in timeslots after which reported but unavailable work is cleared. See equation [eq:availassignmentspostassurancesdef].

$\Cmaxauthcodesize = 64,000$

:   The maximum size of is-authorized code in octets. See equation [eq:isauthinvocation].

$\Cmaxbundlesize = 13,791,360$

:   The maximum size of the concatenated variable-size blobs, extrinsics and imported segments of a work-package, in octets. See equation [eq:checkextractsize].

$\Cmaxservicecodesize = 4,000,000$

:   The maximum size of service code in octets. See equations [eq:refinvocation], [eq:accinvocation] & [eq:onxferinvocation].

$\Csegmentsize = 4104$

:   The size of a segment in octets. See section 14.2.1.

$\Csegmentfootprint = \Csegmentsize + 32\ceil{\log_2(\Cmaxpackageexports)} = 4488$

:   The additional footprint in the Audits DA of a single imported segment. See equation [eq:segmentfootprint].

$\Cmaxpackageimports = 3,072$

:   The maximum number of imports in a work-package. See equation [eq:limitworkpackagebandwidth].

$\Cmaxreportvarsize = 48\cdot2^{10}$

:   The maximum total size of all unbounded blobs in a work-report, in octets. See equation [eq:limitworkreportsize].

$\Cmemosize = 128$

:   The size of a transfer memo in octets. See equation [eq:defxfer].

$\Cmaxpackageexports = 3,072$

:   The maximum number of exports in a work-package. See equation [eq:limitworkpackagebandwidth].

$\mathsf{X}$

:   Context strings, see below.

$\Cepochtailstart = 500$

:   The number of slots into an epoch at which ticket-submission ends. See sections 6.5, 6.6 and 6.7.

$\Cpvmdynaddralign = 2$

:   The PVM dynamic address alignment factor. See equation [eq:jumptablealignment].

$\Cpvminitinputsize = 2^{24}$

:   The standard PVM program initialization input data size. See equation 24.7.

$\Cpvmpagesize = 2^{12}$

:   The PVM memory page size. See equation [eq:pvmmemory].

$\Cpvminitzonesize = 2^{16}$

:   The standard PVM program initialization zone size. See section 24.7.
