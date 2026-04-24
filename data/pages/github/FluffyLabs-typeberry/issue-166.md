---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/166'
title: Get rid of ` as` conversions to `Opaque` types.
site: github.com/FluffyLabs/typeberry
created_at: '2024-11-03T19:16:38.000Z'
last_modified: '2024-11-03T19:16:38.000Z'
content_kind: issue
---

# Get rid of ` as` conversions to `Opaque` types.

## Issue by @tomusdrw

My initial thinking was that doing stuff like `5 as CoreIndex` is going to be safe enough and does not need an extra function call.

However I've realised that there might be some cases, where it can actually be harmful.

While **it's completely fine** if we cast a literal number (like `5 as CoreIndex`) it get's much more tricky with `someVar as CoreIndex`. In the latter case, we might be casting something that should never be casted, like say `null | number` and it's going to work fine.

Every opaque type should have an extra conversion function that has a `check` inside to make sure the value is within bonds.

**HOWEVER** we have to be extremely careful to avoid using these functions for unknown data. Instead of catching an error we should rather have a function that validates and returns an error explicitly if the value cannot be conversed.

Example:
```typescript
type CoreIndex = Opaque<U16, "CoreIndex[u16]">;

function asCoreIndex(v: number): CoreIndex {
  return asOpaqueType(u16(v));
}

function somePvmCode(regs: Registers) {
   const coreIdx = asCoreIndex(regs.asUnsigned[7]);
   // ^^^ this will throw an exception if the value in the registry is greater than `2**16 - 1` and that's most likely incorrect.
}
```





## Comment by @tomusdrw

We might consider having extra set of functions like so:
```typescript
export function tryAsCoreIndex(v: number): CoreIndex | null {
  // validate and use `asCoreIndex` when sure it won't throw
}
```


## Comment by @tomusdrw

Note that some of the types will require `ChainSpec`. For instance the `CoreIndex` should be restricted even further to the number of available cores.

See same examples in #257 (`tryAsPerCore` & `tryAsPerValidator`)


## Comment by @tomusdrw

Would be awesome to have an eslint rule for that. I've found: https://www.npmjs.com/package/eslint-plugin-no-type-assertion but open to suggestions.

CC @r0tc :)


## Comment by @tomusdrw

Mostly tacked thanks to coderabbit rule.
