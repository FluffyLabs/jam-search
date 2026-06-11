---
type: graypaper_section
title: I.4.2 State components
index: 179
---
Here, the prime annotation indicates posterior state. Individual components may be identified with a letter subscript.

$\authpool$

:   The core $\authpool$uthorizations pool. See equation [eq:authstatecomposition].

$\recent$

:   Log of recent activity. See equation [eq:recentspec].

    $\recenthistory$

    :   Information on the most recent blocks. See equation [eq:recenthistoryspec].

    $\accoutbelt$

    :   The Merkle mountain belt for accumulating Accumulation outputs. See equations [eq:accoutbeltspec] and [eq:accoutbeltdef].

$\safrole$

:   State concerning Safrole. See equation [eq:consensusstatecomposition].

    $\ticketaccumulator$

    :   The sealing lottery ticket accumulator. See equation [eq:ticketaccumulatorsealticketsspec].

    $\pendingset$

    :   The keys for the validators of the next epoch, equivalent to those keys which constitute $\epochroot$. See equation [eq:validatorkeys].

    $\sealtickets$

    :   The slot-sealer sequence of the current epoch. See equation [eq:ticketaccumulatorsealticketsspec].

    $\epochroot$

    :   The Bandersnatch root for the current epoch's ticket submissions. See equation [eq:epochrootspec].

$\accountspre$

:   The (prior) state of the service accounts. See equation [eq:serviceaccounts].

    $\accountspostacc$

    :   The post-accumulation, pre-preimage integration intermediate state. See equation [eq:accountspostaccdef].

$\entropy$

:   The entropy accumulator and epochal randomness. See equation [eq:entropycomposition].

$\stagingset$

:   The validator keys and metadata to be drawn from next. See equation [eq:validatorkeys].

$\activeset$

:   The validator keys and metadata currently active. See equation [eq:validatorkeys].

$\previousset$

:   The validator keys and metadata which were active in the prior epoch. See equation [eq:validatorkeys].

$\availassignments$

:   The availability assignments. A core's availability assignment is the work-report guarantee which is being made available prior to accumulation. See equation [eq:reportingstate].

    $\availassignmentspostjudgment$

    :   The post-judgment, pre-assurances-extrinsic intermediate state. See equation [eq:removenonpositive].

    $\availassignmentspostassurances$

    :   The post-assurances-extrinsic, pre-guarantees-extrinsic intermediate state. See equation [eq:availassignmentspostassurancesdef].

$\thestate$

:   The overall state of the system. See equations [eq:statetransition], [eq:statecomposition].

$\thetime$

:   The most recent block's timeslot. See equation [eq:timeslotindex].

$\authqueue$

:   The authorization queue. See equation [eq:authstatecomposition].

$\disputes$

:   Past judgments on work-reports and validators. See equation [eq:disputesspec].

    $\badset$

    :   Work-reports judged to be incorrect. See equation [eq:badsetdef].

    $\goodset$

    :   Work-reports judged to be correct. See equation [eq:goodsetdef].

    $\wonkyset$

    :   Work-reports whose validity is judged to be unknowable. See equation [eq:wonkysetdef].

    $\offenders$

    :   Validators who made a judgment found to be incorrect. See equation [eq:offendersdef].

$\privileges$

:   The privileged service indices. See equation [eq:privilegesspec].

    $\manager$

    :   The index of the blessed service. See equation [eq:accountspostaccdef].

    $\assigners$

    :   The indices of the services able to assign each core's authorizer queue. See equation [eq:accountspostaccdef].

    $\delegator$

    :   The index of the designate service. See equation [eq:accountspostaccdef].

    $\registrar$

    :   The index of the registrar service. See equation [eq:accountspostaccdef].

    $\alwaysaccers$

    :   The always-accumulate service indices and their basic gas allowance. See equation [eq:accountspostaccdef].

$\activity$

:   The activity statistics for the validators. See equation [eq:activityspec].

$\ready$

:   The accumulation queue. See equation [eq:readyspec].

$\accumulated$

:   The accumulation history. See equation [eq:accumulatedspec].

$\lastaccout$

:   The most recent Accumulation outputs. See equations [eq:lastaccoutspec] and [eq:finalstateaccumulation].
