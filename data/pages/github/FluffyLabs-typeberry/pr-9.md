---
type: page
url: 'https://github.com/FluffyLabs/typeberry/pull/9'
title: 'PVM: basic program parser and test runner '
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-11T07:28:55.000Z'
last_modified: '2024-07-11T07:28:55.000Z'
content_kind: pr
---

# PVM: basic program parser and test runner 

## Pull Request by @mateuszsikora

### changes:
- added logic to run pvm tests
- added basic implementation of pvm that is able to read a program and print it as list of instruction


## Comment by @tomusdrw

```suggestion
	contents!: number[];
```


## Comment by @tomusdrw

```suggestion
	"initial-page-map": PageMapItem[];
```


## Comment by @tomusdrw

`types.ts` name has two big gravity (attracting more code into it). I'd suggest splitting this even into 3 separate files or just keeping the types local to `pvm.ts` file.


## Comment by @tomusdrw

And pretty much everywhere else. I find `T[]` notation more idiomatic than `Array<T>`. If you think differently, happy to change my mind, but would prioritize consistence.


## Comment by @tomusdrw

Should be moved to `bin` unless we make `pvm` a separate package with it's own `package.json`


## Comment by @tomusdrw

Should be removed?


## Comment by @tomusdrw

Same here - just call the file `fixed-array.ts`


## Comment by @tomusdrw

`"trap" | "halt"` is defined inline in PVM - is it needed?


## Comment by @mateuszsikora

done


## Comment by @mateuszsikora

done


## Comment by @mateuszsikora

done


## Comment by @mateuszsikora

removed


## Comment by @mateuszsikora

removed


## Comment by @mateuszsikora

removed


## Comment by @mateuszsikora

moved
