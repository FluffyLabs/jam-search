---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/50'
title: >-
  Accumulation same_code_different_services-1, wrong values for bytes and items
  in service accounts?
site: github.com/w3f/jamtestvectors
created_at: '2025-06-06T14:52:39.000Z'
last_modified: '2025-06-06T14:52:39.000Z'
content_kind: issue
---

# Accumulation same_code_different_services-1, wrong values for bytes and items in service accounts?

## Issue by @danielvladco

Are the values for bytes and items in service accounts correct for service account 1730?

```
"bytes": 36008,
"items": 2
```

Shouldn't they be zero since we have no preimages or storage items in the respective service account?

From the paper it doesn't seem like services are supposed to access preimages or storage items of other services, or am I missing something?
