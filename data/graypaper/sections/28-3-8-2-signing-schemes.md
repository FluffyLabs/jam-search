---
type: graypaper_section
title: 3.8.2 Signing Schemes
index: 28
---
$\edsignature{k}{m} \subset \blob[64]$ is the set of valid Ed25519 signatures, defined by [@rfc8032], made through knowledge of a secret key whose public key counterpart is $k \in \hash$ and whose message is $m$. To aid readability, we denote the set of valid public keys $\edkey$.

We denote the set of valid Bandersnatch public keys as $\bskey$, defined in appendix 30. $\bssignature{k \in \bskey}{x \in \blob}{m \in \blob} \subset \blob[96]$ is the set of valid singly-contextualized signatures of utilizing the secret counterpart to the public key $k$, some context $x$ and message $m$.

$\bsringproof{r \in \ringroot}{x \in \blob}{m \in \blob} \subset \blob[784]$, meanwhile, is the set of valid Bandersnatch RingVRF deterministic singly-contextualized proofs of knowledge of a secret within some set of secrets identified by some root in the set of valid *roots* $\ringroot \subset \blob[144]$. We denote $\getringroot{\mathbf{s} \in \sequence{\bskey}} \in \ringroot$ to be the root specific to the set of public key counterparts $\mathbf{s}$. A root implies a specific set of Bandersnatch key pairs, knowledge of one of the secrets would imply being capable of making a unique, valid---and anonymous---proof of knowledge of a unique secret within the set.

Both the Bandersnatch signature and RingVRF proof strictly imply that a member utilized their secret key in combination with both the context $x$ and the message $m$; the difference is that the member is identified in the former and is anonymous in the latter. Furthermore, both define a VRF *output*, a high entropy hash influenced by $x$ but not by $m$, formally denoted $\banderout{\bsringproof{r}{x}{m}} \subset \hash$ and $\banderout{\bssignature{k}{x}{m}} \subset \hash$.

We use $\blskey \subset \blob[144]$ to denote the set of public keys for the BLS signature scheme, described by [@jofc-2004-14130], on curve BLS- defined by [@bls12-381]. We correspondingly use the notation $\blssignature{k}{m}$ to denote the set of valid BLS signatures for public key $k \in \blskey$ and message $m \in \blob$.

We define the signature functions for creating valid signatures; $\edsigndata{k}{m} \in \edsignature{k}{m}$, $\blssigndata{k}{m} \in \blssignature{k}{m}$. We assert that the ability to compute a result for this function relies on knowledge of a secret key.
