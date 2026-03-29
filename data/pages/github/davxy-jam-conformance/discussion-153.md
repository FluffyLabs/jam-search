---
type: page
url: 'https://github.com/davxy/jam-conformance/discussions/153'
title: '1767896003_2013'
site: github.com/davxy/jam-conformance
created_at: '2026-01-11T16:12:28.000Z'
last_modified: '2026-01-11T16:12:28.000Z'
---

# 1767896003_2013

## Discussion by @boymaas

**Should memory access beyond sbrk allocation cause a panic?**

### The Scenario

1. Program calls `sbrk(500)` and receives address `0x33000`
2. Program writes to address `0x33600` (which is **256 bytes beyond** the 500-byte allocation)
3. **Should this write cause a panic?**

### My Initial Interpretation

**YES** - the program only allocated 500 bytes, so accessing byte 600 should panic.

### The Problem

The graypaper defines memory permissions at **page granularity** (4096 bytes), not byte granularity:

- `ram_access` is a sequence of 2^32/4096 entries (one per page)
- When `sbrk(500)` makes bytes `[0x33000, 0x331f4)` writable, it must mark the entire page writable
- This makes **ALL 4096 bytes** in `[0x33000, 0x34000)` have `ram_access = W`
- According to graypaper byte `0x33600` **IS now writable**

### The Question

**Is it legal for a program to read/write any byte within a page that was made writable by sbrk, even if those bytes are beyond the exact number of bytes requested?**

Or should implementations track exact byte allocations and panic on access beyond that, which I assume is done by most implementation as they seem to pass this trace. 



## Comment by @dakk

IMO it is legal to r/w within the page even if above the heap, like it is in linux (you can r/w above the heap pointer withing the page). This could cause corruption, but heap management should be handled by the compiler (or by the developer, depending on the language)

Proof:

```c
#include <unistd.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
  void *hs = sbrk(128);
  int* n_arr = (int*)hs;
  for(int i=0;i<256;i++) {
    n_arr[i] = 0xda;
  }
  printf("0x%02x\n", n_arr[255]);
  return 0;
}
```


## Comment by @davxy

^ @koute


## Comment by @koute

Irrelevant, since `sbrk` [is gone now](https://github.com/gavofyork/graypaper/pull/508).

But to answer your original question as to what was the original intent: it works in page granularity, so if you, say, do `sbrk(1)` and that moves the heap pointer to another page, then the whole page is now accessible, and not only the first byte. The rationale for this design was so that very trivial/simple programs can directly use `sbrk` as their memory allocator (so can allocate in byte granularity), but paging is still efficient (so it works in page-granularity).

But as I said - this is irrelevant now, because `sbrk` is not a thing anymore.


## Comment by @davxy

Not relevant for 0.8; however IIUC, M1 fuzzing begins with 0.7.2, so this remains relevant for M1 conformance and the prize


## Comment by @davxy

<img width="952" height="408" alt="Screenshot from 2026-01-12 10-04-52" src="https://github.com/user-attachments/assets/ee829ae1-387f-4155-8cfc-7f69b7f69417" />



## Comment by @koute

Yes, in that case the answer is: "the exact byte range should not be tracked; access permissions should be checked on page granularity".


## Comment by @boymaas

Thank you for the clarification @dakk @davxy and @koute! In that case the trace is correct. 
