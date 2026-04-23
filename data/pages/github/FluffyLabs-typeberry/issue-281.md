---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/281'
title: Add `Ordering` class and replace all usages of `isLessThan`
site: github.com/FluffyLabs/typeberry
created_at: '2025-03-03T15:37:36.000Z'
last_modified: '2025-03-03T15:37:36.000Z'
content_kind: issue
---

# Add `Ordering` class and replace all usages of `isLessThan`

## Issue by @mateuszsikora

              Have you considered adding the convenience `class Ordering` I proposed initially? It shouldn't cause any performance impact and it would be quite easy to replace usage of these methods. Can you please create a separate issue for this?

_Originally posted by @tomusdrw in https://github.com/FluffyLabs/typeberry/pull/261#discussion_r1976709516_

```
enum OrderingValue {
  Less,
  Equal,
  Greater
}

class Ordering {
  constructor(
    public readonly value: OrderingValue,
  ) {}

  isLess() {
    return this.value === OrderingValue.Less;
  }

  isGreater() {
    return this.value === OrderingValue.Greater;
  }

  isEqual() {
    return this.value === OrderingValue.Equal;
  }

  isGreaterOrEqual() {
    return this.isEqual() || this.isGreater();
  }

  isLessOrEqual() {
    return this.isEqual() || this.isLess();
  }
}

export const LESS = new Ordering(OrderingValue.Less);
export const GREATER = new Ordering(OrderingValue.Greater);
export const EQUAL = new Ordering(OrderingValue.Equal);
```
            


## Comment by @mateuszsikora

https://github.com/FluffyLabs/typeberry/pull/261#discussion_r1972397910
