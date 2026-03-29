---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/53'
title: v0.6.6
site: github.com/davxy/jam-test-vectors
created_at: '2025-05-13T11:00:56.000Z'
last_modified: '2025-05-13T11:00:56.000Z'
---

# v0.6.6

## Issue by @davxy

Changelog: https://github.com/gavofyork/graypaper/releases/tag/v0.6.6

- [x] Accumulate operands encoding: move auth output to the end
- [x] Wrangled operands changed for all entry points
- [x] Fetch host call extended with new variants



## Comment by @clearloop

please mark the version of jam libs that the test-service used  btw 🙏 

could not compile it with jam-pvm-build form 0.1.12 till 0.1.21


## Comment by @davxy

> please mark the version of jam libs that the test-service used btw 🙏
> 
> could not compile it with jam-pvm-build form 0.1.12 till 0.1.21

Indeed the jam libs published on crates.io are quite outdated. 
I'm not directly maintaining the published libs, please ping in the JAM channel


## Comment by @clearloop

hope we can update the accumulate tests with the test-service built with known deps in the v0.6.6 / v0.6.7 update, I've been guessing the encoding of AccumulateItem from yesterday ( our tracing logs have a different jump at pc 4800 with davxy/stuffs/process_one_immediate_report_1.log ) ... no clue about how other teams pass the accumulate tests with the current program binary, but verifying if the encoding is correct would be really helpful for us to continue our debugging

EDITED: I'm gonna replace the binary of the test vectors with the same service built with 0.1.22 deps to debug our encoding problem now

EDITED: The problem is mainly on our side, I have a bug on memory page initialization = =



## Comment by @daiagi


what is the status on the todo items above?
are the current vectors on  master branch 100% 0.6.6 compliant or not yet?

I am asking because we at Jamixir have some  accumulate vectors failing, that were not failing before
so i want to know if we should wait for 0.6.6 Compliance or start debugging

Thank you


## Comment by @davxy

Hey. Please wait for v0.6.6 announcement. It's almost ready
