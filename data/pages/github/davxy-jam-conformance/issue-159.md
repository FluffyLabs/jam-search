---
type: page
url: 'https://github.com/davxy/jam-conformance/issues/159'
title: Minifuzz unexpected close reason
site: github.com/davxy/jam-conformance
created_at: '2026-01-22T21:10:48.000Z'
last_modified: '2026-01-22T21:10:48.000Z'
content_kind: issue
---

# Minifuzz unexpected close reason

## Issue by @mikirov

Hello.
Running my target locally using the minifuzz, i have an issue with processing instruction 26:
```
Processing pair 26: 00000025_fuzzer_import_block.bin <-> 00000025_target_error.bin
Error decoding precomputed fuzzer request: 'builtin_function_or_method' object has no attribute 'read'
Connection closed
```

For the no_forks everything runs properly.
The error i am sending over the socket matches the one from `00000025_target_error.bin`
What version of python should i be running with? Would it be possible to commit a venv file? 
Cheers.


