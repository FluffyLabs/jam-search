---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/bin/test.js#L1-L7'
title: sdk/bin/test.js
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: cb7925ec511feef84fce7d20ba02c4310eaa588a83b75cbc4029789df14823ec
language: javascript
---
`sdk/bin/test.js` (lines 1–7)

```javascript
#!/usr/bin/env node

import { setMemory } from "ecalli";
import { memory, runAllTests } from "../build/test.js";

setMemory(memory);
runAllTests();
```
