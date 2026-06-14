---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-utils.ts#L251-L263'
title: assembly/api-utils.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 4668a97e45c9de72ab3e372f7f086c612eb3b6268e3d8c369857eaa22adf706e
language: typescript
---
`assembly/api-utils.ts` (lines 251–263)

```typescript
    const pause = new VmPause();
    pause.status = int.status;
    pause.exitCode = int.exitCode;
    pause.pc = int.pc;
    pause.nextPc = int.nextPc;
    pause.gas = int.gas.get();
    pause.registers = int.registers.slice(0);

    return pause;
  }

  return null;
}
```
