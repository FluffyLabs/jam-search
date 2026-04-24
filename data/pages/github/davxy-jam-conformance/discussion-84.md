---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/84'
title: Parallelized fuzzing
site: github.com/davxy/jam-conformance
created_at: '2025-09-16T02:53:51.000Z'
last_modified: '2025-09-16T02:53:51.000Z'
content_kind: discussion
---

# Parallelized fuzzing

## Discussion by @ascrivener

For the sake of faster conformance testing, would it be possible for the fuzzer to have some sort of parallelization? Was thinking it could be possible to parallelize the vectors which expect an error, at least, since these blocks don’t need to be used as parents and the state should not be changed anyway.

this would also put less pressure on teams to have a fast implementation, at least for now


## Comment by @clearloop

likely we have already supported it in our arch


## Comment by @davxy

It's not exactly the same, but during fuzzing we can simply spawn X fuzzers against X targets, and the outcome is roughly comparable.  
If your target is Y times slower than the baseline, it will still be Y times slower regardless.  
I would rather not overcomplicate what is a fairly simple protocol -- scaling is as easy as launching more fuzzer instances.


