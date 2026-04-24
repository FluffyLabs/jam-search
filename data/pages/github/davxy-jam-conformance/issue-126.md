---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/126'
title: JamForge
site: github.com/davxy/jam-conformance
created_at: '2025-12-12T01:16:36.000Z'
last_modified: '2025-12-12T01:16:36.000Z'
content_kind: issue
---

# JamForge

## Issue by @philoniare

Hi @davxy

This is a tracking issue for the JamForge Client.

We have opened the following PR (https://github.com/davxy/jam-conformance/pull/125) to add our target as docker image. The initial release supports GP version 0.7.0. We have made sure that all test vectors in the Minifuzz examples folder are passing.

Would be great if we could get the report and be included in the benchmark to track our performance. 

Thank you very much for your support


## Comment by @davxy

@philoniare 

```
❯ ./target.py get jam-forge
Downloading jam-forge for linux...
Pulling Docker image: ghcr.io/philoniare/jam-forge:latest
Error response from daemon: Head "https://ghcr.io/v2/philoniare/jam-forge/manifests/latest": unauthorized
Error: Failed to pull Docker image ghcr.io/philoniare/jam-forge:latest
```


## Comment by @philoniare

@davxy Ah my bad, the package visibility was set to private, I've made it public. Could you please try again?


## Comment by @philoniare

@davxy We've updated our solution to conform to GP v0.7.1: https://github.com/davxy/jam-conformance/pull/129. We've tested it by running the `fuzz-reports/0.7.1/traces`


## Comment by @philoniare

Our client is now up to date with GP v0.7.2, the docker image has been updated.


## Comment by @philoniare

@davxy would be great if you could run the performance benchmark on our solution whenever you can. We've pushed some updates to use CRaC checkpoints for a warmed up JVM before a benchmark is run. 


## Comment by @davxy

@philoniare I see that you are returning `jam-scala` in the app-name field of the PeerInfo message. Can you please set it to `jam-forge`?



## Comment by @philoniare

@davxy Yep done
