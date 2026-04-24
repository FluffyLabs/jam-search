---
type: page
url: 'https://github.com/davxy/jam-test-vectors/pull/3'
title: modify progress_with_bad_signatures-2.json
site: github.com/davxy/jam-test-vectors
created_at: '2024-12-12T07:41:34.000Z'
last_modified: '2024-12-12T07:41:34.000Z'
content_kind: pr
---

# modify progress_with_bad_signatures-2.json

## Pull Request by @yoyo2325

 `disputes/tiny/progress_with_bad_signatures-2.json`  cleaning up the state data

* Removed the `bad` list in the `pre_state` and `post_state` sections. [[1]](diffhunk://#diff-a9dabfaa06bdf60c090f800b0669c460e4ff3b2d0e431796d2a099f218db2abaL55-R57) [[2]](diffhunk://#diff-a9dabfaa06bdf60c090f800b0669c460e4ff3b2d0e431796d2a099f218db2abaL152-R149)
* Removed the `offenders` list in the `pre_state` and `post_state` sections. [[1]](diffhunk://#diff-a9dabfaa06bdf60c090f800b0669c460e4ff3b2d0e431796d2a099f218db2abaL55-R57) [[2]](diffhunk://#diff-a9dabfaa06bdf60c090f800b0669c460e4ff3b2d0e431796d2a099f218db2abaL152-R149)


## Comment by @davxy

@yoyo2325 is this PR still relevant? I don't fully understand your changes here. Closing for now


## Comment by @yoyo2325

this case is actually has two error 
not only for the bad signature but also that two I removed
just let you know it!



## Comment by @davxy

What other error? Can you elaborate why you removed things from pre-state? Thank you
