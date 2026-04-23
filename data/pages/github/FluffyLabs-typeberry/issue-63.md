---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/63'
title: 'PVM: review number overflow possibilities  '
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-01T12:23:57.000Z'
last_modified: '2024-08-01T12:23:57.000Z'
content_kind: issue
---

# PVM: review number overflow possibilities  

## Issue by @mateuszsikora

As @tomusdrw noticed here: https://github.com/FluffyLabs/typeberry/pull/58#discussion_r1699713631 address in memory instructions can exceed 32 bit and it is not handled in the current implementation. We have to fix that and review all instructions and ensure that overflow is correctly handled.

Known problems:
-indirect addressed instructions - sum of register value and immediate
-direct addressed instructions (u16, i16, u32, i32) - address + 2/4

In cases where the overflow cannot occur but it is not obvious (for example we have addition operation but we known that terms are <= 2 ** 16) we should leave a comment that explain why we don't have to handle overflow here.


## Comment by @mateuszsikora

<img width="693" alt="Screenshot 2024-09-02 at 18 51 04" src="https://github.com/user-attachments/assets/bbd61f1a-e635-46ab-9d6a-ce4ffbbdf14c">

