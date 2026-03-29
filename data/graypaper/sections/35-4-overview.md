---
type: graypaper_section
title: 4. Overview
index: 35
---
As in the Yellow Paper, we begin our formalisms by recalling that a blockchain may be defined as a pairing of some initial state together with a block-level statetransition function. The latter defines the posterior state given a pairing of some prior state and a block of data applied to it. Formally, we say: σ ′ ≡ Υ (σ, B) (4.1) Where σ is the prior state, σ ′ is the posterior state, B is some valid block and Υ is our block-level state-transition function. Broadly speaking, Jam (and indeed blockchains in general) may be defined simply by specifying Υ and some genesis state σ 0. 7 We also make several additional assumptions of agreed knowledge: a universally known clock, and the practical means of sharing data with other systems operating under the same consensus rules. The latter two were both assumptions silently made in the YP.
