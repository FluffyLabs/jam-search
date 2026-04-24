---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/484'
title: Work Report encoding
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-15T10:57:27.000Z'
last_modified: '2025-07-15T10:57:27.000Z'
content_kind: issue
---

# Work Report encoding

## Issue by @tomusdrw

Seems that the encoding of work reports has changed from what we have (identified in #477).

This task is about fixing the encoding (`coreIndex u16 -> varU16`) and fixing failing tests (most liklely also bumping the relevant codec test vectors).
