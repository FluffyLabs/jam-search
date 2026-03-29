---
type: page
url: >-
  https://docs.jamcha.in/knowledge/advanced/simple-networking/Block%20Propagation%20Grid
title: Block Propagation Grid | JAM Docs
site: docs.jamcha.in
created_at: '2025-05-26T09:22:35.065Z'
last_modified: '2026-03-24T03:46:40.114Z'
---
The SNP spec specifies that nodes need to announce their blocks only to specific peers - not to the whole network. Our interpretation of the SNP spec leads to the following grid for block propagation:

There are three grids consisting of the previous, current and future validator set. They are topologically identical. This example is simplified and uses eight instead of 31 for the grid size.

You can see the authoring validator in red and propagating to its first order peers through red edges. The second order propagation edges are in green and the third order are all nodes. The third order edges are not drawn for visibility of the others.

Threejs playground (forked) - StackBlitz

index.ts

More Actions…

1

2

3

4

5

6

7

8

9

10

11

12

13

14

import\*asTHREE

from'three';

// Configuration

constGRID\_SIZE =

8;

constLAYER\_HEIGHT

= 2;

const

VALIDATOR\_SIZE = 0.

3;

const

SELECTED\_VALIDATOR\_

POS = { layer:1,

row:1, col:1 };

const

ROTATION\_SPEED = 0.

0005;

// Colors

const

PRIMARY\_CONNECTION\_

COLOR = 0xff4444; /

/ Red

const

SECONDARY\_CONNECTIO

N\_COLOR =

0x44ff44; // Green

// Setup

Enter to Rename, Shift+Enter to Preview

Compiling application & starting dev server…

[Astro Basics\\
\\
Node.js](https://stackblitz.com/fork/github/withastro/astro/tree/latest/examples/basics?file=README.md&title=Astro%20Starter%20Kit:%20Basics) [Next.js\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/nextjs?title=Next.js%20Starter&description=The%20React%20framework%20for%20production) [Nuxt\\
\\
Node.js](https://stackblitz.com/fork/github/nuxt/starter/tree/v3-stackblitz) [React\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-react-ts?file=index.html&terminal=dev) [Vanilla\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla?file=index.html&terminal=dev) [Vanilla\\
\\
TypeScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vanilla-ts?file=index.html&terminal=dev) [Static\\
\\
HTML/JS/CSS](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/static?title=Static%20Starter&description=HTML/CSS/JS%20Starter&file=script.js,styles.css,index.html&terminalHeight=10) [Node.js\\
\\
Blank project](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/node?title=node.new%20Starter&description=Starter%20project%20for%20Node.js%2C%20a%20JavaScript%20runtime%20built%20on%20Chrome%27s%20V8%20JavaScript%20engine) [Angular\\
\\
TypeScript](https://stackblitz.com/fork/github/stackblitz/starters/tree/main/angular?template=node&title=Angular%20Starter&description=An%20angular-cli%20project%20based%20on%20%40angular%2Fanimations%2C%20%40angular%2Fcommon%2C%20%40angular%2Fcompiler%2C%20%40angular%2Fcore%2C%20%40angular%2Fforms%2C%20%40angular%2Fplatform-browser%2C%20%40angular%2Fplatform-browser-dynamic%2C%20%40angular%2Frouter%2C%20core-js%2C%20rxjs%2C%20tslib%20and%20zone.js) [Vue\\
\\
JavaScript](https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-vue?file=index.html&terminal=dev) [WebContainer API\\
\\
Node.js](https://stackblitz.com/fork/github/stackblitz/webcontainer-api-starter)

# Publish a package

Are you trying to publish ``?

CancelConfirm

# Allow access to localhost resource

Request to:

More information

```
Method: undefined
Headers:
```

Warning

Allowing access to your localhost resources can lead to security issues such as unwanted request access or data leaks through your localhost.

Do not ask me again

BlockAllow

# Out of memory error

This browser tab is running out of memory. Free up memory by closing other StackBlitz tabs and then refresh the page.

OK [Learn more](https://developer.stackblitz.com/codeflow/working-in-codeflow-ide#out-of-memory-error)

## Example [​](https://docs.jamcha.in/knowledge/advanced/simple-networking/Block%20Propagation%20Grid\#example "Direct link to Example")

Assuming the validator with index `32` (grid coordinate `(1, 1)`) wants to propagate a block. It would have to send it to these first-order grid neighbors:

`[{0, 1}, {2, 1}, {3, 1}, {4, 1}, {5, 1}, {6, 1}, {7, 1}, {8, 1}, {9, 1}, {10, 1}, {11, 1}, {12, 1}, {13, 1}, {14, 1}, {15, 1}, {16, 1}, {17, 1}, {18, 1}, {19, 1}, {20, 1}, {21, 1}, {22, 1}, {23, 1}, {24, 1}, {25, 1}, {26, 1}, {27, 1}, {28, 1}, {29, 1}, {30, 1}, {1, 0}, {1, 2}, {1, 3}, {1, 4}, {1, 5}, {1, 6}, {1, 7}, {1, 8}, {1, 9}, {1, 10}, {1, 11}, {1, 12}, {1, 13}, {1, 14}, {1, 15}, {1, 16}, {1, 17}, {1, 18}, {1, 19}, {1, 20}, {1, 21}, {1, 22}, {1, 23}, {1, 24}, {1, 25}, {1, 26}, {1, 27}, {1, 28}, {1, 29}, {1, 30}]`

Translating to the following indices:

`[1, 63, 94, 125, 156, 187, 218, 249, 280, 311, 342, 373, 404, 435, 466, 497, 528, 559, 590, 621, 652, 683, 714, 745, 776, 807, 838, 869, 900, 931, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61]`

Additionally, they also send it to the same validator indices of the previous and future epoch.

- [Example](https://docs.jamcha.in/knowledge/advanced/simple-networking/Block%20Propagation%20Grid#example)
