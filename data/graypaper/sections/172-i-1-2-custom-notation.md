---
type: graypaper_section
title: I.1.2 Custom Notation
index: 172
---
$\dictionary{K}{V}$

:   The set of dictionaries making a partial bijection of domain $k$ to range $v$. See section 3.5.

$\serviceaccount$

:   The set of service $\mathbb{A}$ccounts. See equation [eq:serviceaccount].

$\bitstring$

:   The set of $\mathbb{b}$itstrings (Boolean sequences). Subscript denotes length. See section 3.7.

$\blob$

:   The set of $\mathbb{B}$lobs (octet sequences). Subscript denotes length. See section 3.7.

    $\blskey$

    :   The set of BLS public keys. A subset of $\blob[144]$. See section 3.8.2.

    $\ringroot$

    :   The set of Bandersnatch ring roots. A subset of $\blob[144]$. See section 3.8 and appendix 30.

$\workcontext$

:   The set of work-$\mathbb{C}$ontexts. See equation [eq:workcontext]. *Not used as the set of complex numbers.*

$\workdigest$

:   The set of work-$\mathbb{D}$igests. See equation [eq:workdigest].

$\workerror$

:   The set of work execution $\mathbb{E}$rrors. See equation [eq:workerror].

$\pvmguest$

:   The set representing the state of a $\mathbb{G}$uest PVM instance. See equation [eq:pvmguest].

$\hash$

:   The set of 32-octet cryptographic values, equivalent to $\blob[32]$. Often a $\mathbb{H}$ash function's result. See section 3.8.

    $\edkey$

    :   The set of Ed25519 public keys. A subset of $\blob[32]$. See section 3.8.2.

    $\bskey$

    :   The set of Bandersnatch public keys. A subset of $\blob[32]$. See section 3.8 and appendix 30.

$\operandtuple$

:   The $\mathbb{I}$nformation concerning a single work-item once prepared as an operand for the accumulation function. See equation [eq:operandtuple].

$\segment$

:   The set of data segments, equivalent to $\blob[\Csegmentsize]$. See equation [eq:segment].

$\valkey$

:   The set of validator $\mathbb{K}$ey-sets. See equation [eq:validatorkeys].

$\implications$

:   The set representing implications of accumulation. See equation [eq:implications].

$\ram$

:   The set of PVM $\mathbb{M}$emory (RAM) states. See equation [eq:pvmmemory].

$\workpackage$

:   The set of work-$\mathbb{P}$ackages. See equation [eq:workpackage].

$\workreport$

:   The set of work-$\mathbb{R}$eports. See equation [eq:workreport]. *Note used for the set of real numbers.*

$\partialstate$

:   The set representating a portion of overall $\mathbb{S}$tate, used during accumulation. See equation [eq:partialstate].

$\safroleticket$

:   The set of seal-key $\mathbb{T}$ickets. See equation [eq:ticket].

$\readable{\memory}$

:   The set of $\mathbb{V}$alidly readable indices for PVM RAM $\memory$. See appendix 24.

$\writable{\memory}$

:   The set of $\mathbb{V}$alidly writable indices for PVM RAM $\memory$. See appendix 24.

$\edsignature{k}{m}$

:   The set of $\mathbb{V}$alid Ed25519 signatures of the key $k$ and message $m$. A subset of $\blob[64]$. See section 3.8.

$\bssignature{k}{c}{m}$

:   The set of $\mathbb{V}$alid Bandersnatch signatures of the public key $k$, context $c$ and message $m$. A subset of $\blob[96]$. See section 3.8.

$\bsringproof{r}{c}{m}$

:   The set of $\mathbb{V}$alid Bandersnatch RingVRF proofs of the root $r$, context $c$ and message $m$. A subset of $\blob[784]$. See section 3.8.

$\workitem$

:   The set of $\mathbb{W}$ork items. See equation [eq:workitem].

$\defxfer$

:   The set of deferred transfers. See equation [eq:defxfer].

$\avspec$

:   The set of availability specifications. See equation [eq:avspec].
