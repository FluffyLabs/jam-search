---
type: graypaper_section
title: I.4.1 Block-context Terms
index: 178
---
These terms are all contextualized to a single block. They may be superscripted with some other term to alter the context and reference some other block.

$\ancestors$

:   The ancestor set of the block. See equation [eq:ancestors].

$\block$

:   The block. See equation [eq:block].

$\extrinsic$

:   The block extrinsic. See equation [eq:extrinsic].

$\accoutcommitment{v}$

:   The BEEFY signed commitment of validator $v$. See equation [eq:accoutsignedcommitment].

$\reporters$

:   The set of Ed25519 guarantor keys who made a work-report. See equation [eq:guarantorsig].

$\header$

:   The block header. See equation [eq:header].

$\accumulationstatistics$

:   Service-indexed accumulation statistics for this block. See equations [eq:accumulationstatisticsspec] and [eq:accumulationstatisticsdef].

$\guarantorassignments$

:   The current core assignments. See section 11.3.

$\guarantorassignmentsunderlastrotation$

:   The core assignments in the previous rotation. See section 11.3.

$\justbecameavailable$

:   The sequence of work-reports which have now become available and ready for accumulation. See equation [eq:availableworkreports].

$\isticketed$

:   The ticketed condition, true if the block was sealed with a ticket signature rather than a fallback. See equations [eq:ticketconditiontrue] and [eq:ticketconditionfalse].

$\isaudited$

:   The audit condition, equal to $\top$ once the block is audited. See section 17.

Without any superscript, the block is assumed to the block being imported or, if no block is being imported, the head of the best chain (see section 19). Explicit block-contextualizing superscripts include:

$\block^\natural$

:   The latest finalized block. See equation 19.

$\block^\flat$

:   The block at the head of the best chain. See equation 19.
