---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/48'
title: '1756548741_00000059'
site: github.com/davxy/jam-conformance
created_at: '2025-09-01T17:08:26.000Z'
last_modified: '2025-09-01T17:08:26.000Z'
---

# 1756548741_00000059

## Discussion by @clearloop

[this trace](https://github.com/davxy/jam-conformance/tree/main/fuzz-reports/0.7.0/traces/1756548741) does not follow block based gas charging, we can pass it with our interpreter but not compiler, the last execution block panics at the middle:

### interpretor instruction tracing

```
TRACE pos=46801  JumpInd              gas=19932138 regs=[474, 4278057048, 1073948832, 196616, 2430, 78, 212256, 204808, 137438953472, 33554269, 37, 82, 4611686018427387904]

-- termination

TRACE pos=18039  LoadIndU16           gas=19932137 regs=[474, 4278057048, 1073948832, 196616, 2430, 78, 212256, 204808, 137438953472, 33554269, 37, 82, 4611686018427387904]
TRACE pos=18043  LoadIndU64           gas=19932136 regs=[474, 4278057048, 1073948832, 196616, 2430, 78, 212256, 20346, 137438953472, 33554269, 37, 82, 4611686018427387904]
TRACE pos=18047  LoadIndU64           gas=19932135 regs=[474, 4278057048, 1073948832, 196616, 2430, 78, 212256, 20346, 114366376, 33554269, 37, 82, 4611686018427387904]
TRACE pos=18051  Ecalli               gas=19932134 regs=[474, 4278057048, 1073948832, 196616, 2430, 78, 212256, 20346, 114366376, 0, 37, 82, 4611686018427387904]
DEBUG host call: 15
 WARN PVM execution stopped with reason: Panic("Memory page 27921 not accessible") for service 2494454674

--- the block has not finished, still has 5 instructions not executed
```

### recompiler tracing

```
    TRACE -> charge gas 8
    TRACE     Offset { range: 18039..18043, value: LoadIndU16(RRI { reg0: 7, reg1: 1, imm0: 0x508 }) }
    TRACE     Offset { range: 18043..18047, value: LoadIndU64(RRI { reg0: 8, reg1: 1, imm0: 0x218 }) }
    TRACE     Offset { range: 18047..18051, value: LoadIndU64(RRI { reg0: 9, reg1: 1, imm0: 0x210 }) }
    TRACE     Offset { range: 18051..18053, value: Ecalli(I { imm0: 0xf }) }
    TRACE     Offset { range: 18053..18055, value: MoveReg(RR { reg0: 9, reg1: 7 }) }
    TRACE     Offset { range: 18055..18060, value: LoadImm(RI { reg0: 7, imm0: 0x1069c }) }
    TRACE     Offset { range: 18060..18063, value: LoadImm(RI { reg0: 8, imm0: 0xf }) }
    TRACE     Offset { range: 18063..18069, value: LoadImmJump(RIO { reg0: 0, imm0: 0x1dc, off0: 0x1800 }) }
    TRACE -> charge gas 2
```


## Comment by @davxy

As per current GP revision, we're using per instruction gas charging.
