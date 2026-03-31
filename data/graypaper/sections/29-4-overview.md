---
type: graypaper_section
title: 4 Overview
index: 29
---
As in the Yellow Paper, we begin our formalisms by recalling that a blockchain may be defined as a pairing of some initial state together with a block-level state-transition function. The latter defines the posterior state given a pairing of some prior state and a block of data applied to it. Formally, we say: $$\begin{aligned}

\thestate' \equiv \transitionstate(\thestate, \block)\end{aligned}$$

Where $\thestate$ is the prior state, $\thestate'$ is the posterior state, $B$ is some valid block and $\transitionstate$ is our block-level state-transition function.

Broadly speaking, JAM (and indeed blockchains in general) may be defined simply by specifying $\transitionstate$ and some *genesis state* $\thestate^0$.[^7] We also make several additional assumptions of agreed knowledge: a universally known clock, and the practical means of sharing data with other systems operating under the same consensus rules. The latter two were both assumptions silently made in the *YP*.
