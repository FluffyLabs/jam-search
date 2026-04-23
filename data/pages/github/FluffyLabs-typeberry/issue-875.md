---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/875'
title: Make namespaced types directly importable
site: github.com/FluffyLabs/typeberry
created_at: '2026-01-19T09:17:52.000Z'
last_modified: '2026-01-19T09:17:52.000Z'
content_kind: issue
---

# Make namespaced types directly importable

## Issue by @coderabbitai[bot]

Currently, types exported from `@typeberry/lib` are behind namespaces and cannot be imported directly. This forces users to create type aliases using workarounds like:

```typescript
type WorkReport = ReturnType<typeof workReport.WorkReport.create>;
type WorkPackageSpec = ReturnType<typeof workReport.WorkPackageSpec.create>;
type RefineContext = ReturnType<typeof refineContext.RefineContext.create>;
```

This is not ergonomic and should be improved so that types can be imported directly from the library.

**Context:**
- PR: https://github.com/FluffyLabs/jammin/pull/78
- Comment: https://github.com/FluffyLabs/jammin/pull/78#discussion_r2698953816
- Requested by: @tomusdrw


## Comment by @tomusdrw

should be fixed now with #852 
