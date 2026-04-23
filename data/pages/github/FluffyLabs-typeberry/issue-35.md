---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/35'
title: 'PVM - change the owner of result object in ArgsDecoder '
site: github.com/FluffyLabs/typeberry
created_at: '2024-07-23T14:57:51.000Z'
last_modified: '2024-07-23T14:57:51.000Z'
content_kind: issue
---

# PVM - change the owner of result object in ArgsDecoder 

## Issue by @mateuszsikora

Currently `ArgsDecoder.getArgs` returns an object that is mutable. In such cases the method should be named `fillArgs` and take an object to fill as a param:

<img width="939" alt="Screenshot 2024-07-23 at 16 39 39" src="https://github.com/user-attachments/assets/906c63fa-a4ae-449d-9b59-df544b39274f">

