---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/10'
title: Provide JAM codec test vectors
site: github.com/w3f/jamtestvectors
created_at: '2024-08-21T07:21:33.000Z'
last_modified: '2024-08-21T07:21:33.000Z'
---

# Provide JAM codec test vectors

## Issue by @xlc

Currently SCALE test vectors are provided but it is not that useful as we are not using SCALE codec in GP.
Instead, JAM codec one should be provided so we can test the codec part of the implementation.


## Comment by @davxy

> but it is not that useful as we are not using SCALE codec in GP.

I think we're testing the protocol logic here, if you write a compliant implementation then is just a matter of switching the codec (which should be trivial in most cases). So the vectors are still useful.

At some point for sure we'll provide the vectors to test the JAM codec. Well, Indeed anyone can submit these vectors.   These vectors must specifically test the codec and not the protocol logic


## Comment by @xlc

If switch codec is trivial, can you just switch scale to codec to jam codec?

JSON serialization is not part of the protocol and requires extra work and jam codec is part of the protocol and requires no extra work. 


## Comment by @davxy

> If switch codec is trivial, can you just switch scale to codec to jam codec?

Of course we will, when codec implementation is ready. Once ready, switching codec is trivial. 

> JSON serialization is not part of the protocol and requires extra work and jam codec is part of the protocol and requires no extra work.

JSON has been mainained to offer a human readable version of the binary file for quick inspection. It is basically free to generate.


## Comment by @xlc

In that case can I request someone to prioritize the jam codec implementation and test vectors? Or let me know if it won't be done in next few weeks then in that case I will spend some hours to support the JSON format.


## Comment by @davxy

Closed by https://github.com/w3f/jamtestvectors/pull/12
