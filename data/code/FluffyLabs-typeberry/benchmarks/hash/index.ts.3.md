---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/hash/index.ts#L421-L651
title: benchmarks/hash/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 5
content_sha: 65167e3bc890983ea1d52ea7d965de0ef9e856fe559bda0150eaf1d558496ae9
language: typescript
---
`benchmarks/hash/index.ts` (lines 421–651)

```typescript
const xd6 = Symbol("0xd6");
const xd7 = Symbol("0xd7");
const xd8 = Symbol("0xd8");
const xd9 = Symbol("0xd9");
const xda = Symbol("0xda");
const xdb = Symbol("0xdb");
const xdc = Symbol("0xdc");
const xdd = Symbol("0xdd");
const xde = Symbol("0xde");
const xdf = Symbol("0xdf");
const xe0 = Symbol("0xe0");
const xe1 = Symbol("0xe1");
const xe2 = Symbol("0xe2");
const xe3 = Symbol("0xe3");
const xe4 = Symbol("0xe4");
const xe5 = Symbol("0xe5");
const xe6 = Symbol("0xe6");
const xe7 = Symbol("0xe7");
const xe8 = Symbol("0xe8");
const xe9 = Symbol("0xe9");
const xea = Symbol("0xea");
const xeb = Symbol("0xeb");
const xec = Symbol("0xec");
const xed = Symbol("0xed");
const xee = Symbol("0xee");
const xef = Symbol("0xef");
const xf0 = Symbol("0xf0");
const xf1 = Symbol("0xf1");
const xf2 = Symbol("0xf2");
const xf3 = Symbol("0xf3");
const xf4 = Symbol("0xf4");
const xf5 = Symbol("0xf5");
const xf6 = Symbol("0xf6");
const xf7 = Symbol("0xf7");
const xf8 = Symbol("0xf8");
const xf9 = Symbol("0xf9");
const xfa = Symbol("0xfa");
const xfb = Symbol("0xfb");
const xfc = Symbol("0xfc");
const xfd = Symbol("0xfd");
const xfe = Symbol("0xfe");
const xff = Symbol("0xff");

type Byte =
  | typeof x00
  | typeof x01
  | typeof x02
  | typeof x03
  | typeof x04
  | typeof x05
  | typeof x06
  | typeof x07
  | typeof x08
  | typeof x09
  | typeof x0a
  | typeof x0b
  | typeof x0c
  | typeof x0d
  | typeof x0e
  | typeof x0f
  | typeof x10
  | typeof x11
  | typeof x12
  | typeof x13
  | typeof x14
  | typeof x15
  | typeof x16
  | typeof x17
  | typeof x18
  | typeof x19
  | typeof x1a
  | typeof x1b
  | typeof x1c
  | typeof x1d
  | typeof x1e
  | typeof x1f
  | typeof x20
  | typeof x21
  | typeof x22
  | typeof x23
  | typeof x24
  | typeof x25
  | typeof x26
  | typeof x27
  | typeof x28
  | typeof x29
  | typeof x2a
  | typeof x2b
  | typeof x2c
  | typeof x2d
  | typeof x2e
  | typeof x2f
  | typeof x30
  | typeof x31
  | typeof x32
  | typeof x33
  | typeof x34
  | typeof x35
  | typeof x36
  | typeof x37
  | typeof x38
  | typeof x39
  | typeof x3a
  | typeof x3b
  | typeof x3c
  | typeof x3d
  | typeof x3e
  | typeof x3f
  | typeof x40
  | typeof x41
  | typeof x42
  | typeof x43
  | typeof x44
  | typeof x45
  | typeof x46
  | typeof x47
  | typeof x48
  | typeof x49
  | typeof x4a
  | typeof x4b
  | typeof x4c
  | typeof x4d
  | typeof x4e
  | typeof x4f
  | typeof x50
  | typeof x51
  | typeof x52
  | typeof x53
  | typeof x54
  | typeof x55
  | typeof x56
  | typeof x57
  | typeof x58
  | typeof x59
  | typeof x5a
  | typeof x5b
  | typeof x5c
  | typeof x5d
  | typeof x5e
  | typeof x5f
  | typeof x60
  | typeof x61
  | typeof x62
  | typeof x63
  | typeof x64
  | typeof x65
  | typeof x66
  | typeof x67
  | typeof x68
  | typeof x69
  | typeof x6a
  | typeof x6b
  | typeof x6c
  | typeof x6d
  | typeof x6e
  | typeof x6f
  | typeof x70
  | typeof x71
  | typeof x72
  | typeof x73
  | typeof x74
  | typeof x75
  | typeof x76
  | typeof x77
  | typeof x78
  | typeof x79
  | typeof x7a
  | typeof x7b
  | typeof x7c
  | typeof x7d
  | typeof x7e
  | typeof x7f
  | typeof x80
  | typeof x81
  | typeof x82
  | typeof x83
  | typeof x84
  | typeof x85
  | typeof x86
  | typeof x87
  | typeof x88
  | typeof x89
  | typeof x8a
  | typeof x8b
  | typeof x8c
  | typeof x8d
  | typeof x8e
  | typeof x8f
  | typeof x90
  | typeof x91
  | typeof x92
  | typeof x93
  | typeof x94
  | typeof x95
  | typeof x96
  | typeof x97
  | typeof x98
  | typeof x99
  | typeof x9a
  | typeof x9b
  | typeof x9c
  | typeof x9d
  | typeof x9e
  | typeof x9f
  | typeof xa0
  | typeof xa1
  | typeof xa2
  | typeof xa3
  | typeof xa4
  | typeof xa5
  | typeof xa6
  | typeof xa7
  | typeof xa8
  | typeof xa9
  | typeof xaa
  | typeof xab
  | typeof xac
  | typeof xad
  | typeof xae
  | typeof xaf
  | typeof xb0
  | typeof xb1
  | typeof xb2
  | typeof xb3
  | typeof xb4
  | typeof xb5
  | typeof xb6
  | typeof xb7
  | typeof xb8
  | typeof xb9
  | typeof xba
```
