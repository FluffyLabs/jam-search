---
type: graypaper_section
title: 11.2.1 The Assurances Extrinsic
index: 74
---
The assurances extrinsic is a sequence of *assurance* values, at most one per validator. Each assurance is a sequence of binary values (i.e. a bitstring), one per core, together with a signature and the index of the validator who is assuring. A value of $1$ (or $\top$, if interpreted as a Boolean) at any given index implies that the validator assures they are contributing to its availability.[^12] Formally: $$\begin{aligned}
  
  \xtassurances \in \sequence{\tuple{
    \isa{\xaNanchor}{\hash},\,
    \isa{\xaNavailabilities}{\bitstring[\Ccorecount]},\,
    \isa{\xaNassurer}{\Nmax{\len{\activeset}}},\,
    \isa{\xaNsignature}{\edsignaturebase}
  }}\end{aligned}$$

The assurances must all be anchored on the parent and ordered by validator index: $$\begin{aligned}
  \forall a &\in \xtassurances : a_\xaNanchor = \H_\Nparent \\
  \forall i &\in \set{ 1 \dots \len{\xtassurances} } : \xtassurances\subb{i - 1}_\xaNassurer < \xtassurances\subb{i}_\xaNassurer\end{aligned}$$

The signature must be one whose public key is that of the validator assuring and whose message is the serialization of the parent hash $\H_\Nparent$ and the aforementioned bitstring: $$\begin{aligned}
  
  &\forall a \in \xtassurances : a_\xaNsignature \in \edsignature{\activeset\subb{a_\xaNassurer}_\vkNed}{\Xavailable \concat \blake{\encode{\H_\Nparent, a_\xaNavailabilities}}} \\
  &\Xavailable \equiv \token{\$jam\_available}\end{aligned}$$

A bit may only be set if the corresponding core has an availability assignment: $$\forall a \in \xtassurances, \cX \in \coreindex :
  \quad a_\xaNavailabilities\subb{\cX} \Rightarrow \availassignmentspostjudgment\subb{\cX} \ne \none$$
