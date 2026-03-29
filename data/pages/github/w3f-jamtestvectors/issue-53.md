---
type: page
url: 'https://github.com/w3f/jamtestvectors/issues/53'
title: Service keys are missing hash invocation
site: github.com/w3f/jamtestvectors
created_at: '2025-07-08T20:05:31.000Z'
last_modified: '2025-07-08T20:05:31.000Z'
---

# Service keys are missing hash invocation

## Issue by @ggwpez

Reading at [Safrole traces](https://github.com/w3f/jamtestvectors/blob/master/traces/safrole/00000002.json), we find the following state key:  
`00fe00ff00ff00ff9f7d8641972a525b5cf0964d352c14d56925034212e83c`

This key looks *almost* like an [account key](https://graypaper.fluffylabs.dev/#/38c4e62/3bab033bb303?v=0.7.0) for service id 0:

<img width="627" height="54" alt="Image" src="https://github.com/user-attachments/assets/6413ea13-aad0-40f5-9c6e-279034511198" />
<img width="944" height="54" alt="Image" src="https://github.com/user-attachments/assets/5dce8cc7-e6d6-4cca-b09f-b197627ad40d" />

But the hash invocation is missing. Please let me know if I am overlooking something here.

PS: I realized that I looked at the last GP version, maybe it changed since then.


## Comment by @ggwpez

Yea its fine for 0.6.6, sorry.
