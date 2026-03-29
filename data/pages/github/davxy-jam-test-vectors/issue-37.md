---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/37'
title: Core index in work reports is not encoded as compact
site: github.com/davxy/jam-test-vectors
created_at: '2025-04-06T20:57:06.000Z'
last_modified: '2025-04-06T20:57:06.000Z'
---

# Core index in work reports is not encoded as compact

## Issue by @bloppan

Hi @davxy , [the GP specifies](https://graypaper.fluffylabs.dev/#/68eaa1f/378102379202?v=0.6.4) that the core index in WorkReports is encoded as compact, but in the _tiny_ test vectors I only can decode the .bin files properly if I use the integer encoding `E2` in the core index. 
