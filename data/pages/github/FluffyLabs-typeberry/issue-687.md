---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/687'
title: Improve error messages from `Result.error`
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-02T07:47:19.000Z'
last_modified: '2025-10-02T07:47:19.000Z'
content_kind: issue
---

# Improve error messages from `Result.error`

## Issue by @tomusdrw

We currently use numeric errors (enums) for efficiency reasons. However `Result.error` may accept an additional argument (`details`) with human-readable explanation of the error code, however producing `details` (i.e. concatenating the string) might be pretty performance detrimental.

Having `details` is cool, but it's not used everywhere, so many times the errors user will get is something like:
```
Error Stf(4) - 7 - 2
```
which isn't easy to understand. To improve the error messages I propose:

- [ ] Make `details` a mandatory argument.
- [ ] and make `details` a closure.

That way, developers will be forced to produce a human-readable explanation of the error message, but it should not affect the performance that much.
