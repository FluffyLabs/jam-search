---
type: graypaper_section
title: 10.1 The State
index: 64
---
The *disputes* state includes four items, three of which concern verdicts: a good-set ($\goodset$), a bad-set ($\badset$) and a wonky-set ($\wonkyset$) containing the hashes of all work-reports which were respectively judged to be correct, incorrect or that it appears impossible to judge. The fourth item, the punish-set ($\offenders$), is a set of Ed25519 keys representing validators which were found to have misjudged a work-report. $$
  \disputes \equiv \tup{\goodset, \badset, \wonkyset, \offenders}$$
