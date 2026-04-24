---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/437'
title: Inline WASM files into JavaScript bundle for single-file distribution
site: github.com/FluffyLabs/typeberry
created_at: '2025-06-17T07:59:30.000Z'
last_modified: '2025-06-17T07:59:30.000Z'
content_kind: issue
---

# Inline WASM files into JavaScript bundle for single-file distribution

## Issue by @coderabbitai[bot]

## Description

Currently, the typeberry build process creates a JavaScript file alongside separate WASM files that need to be distributed together. The goal is to have a single JavaScript file that contains everything, including the WASM files inlined within the bundle.

## Current State
- Build process copies WASM files from node_modules to distribution directory
- Results in JS file + 3 separate WASM files that must be kept together

## Desired State  
- Single JavaScript file containing all functionality
- WASM files inlined/embedded within the JavaScript bundle
- Easier distribution and deployment

## Technical Notes
Webpack should support inlining WASM files through various plugins or loaders. This would eliminate the need for the current WASM file copying step in the build process.

## References
- PR: https://github.com/FluffyLabs/typeberry/pull/435
- Comment: https://github.com/FluffyLabs/typeberry/pull/435#discussion_r2150768148


## Comment by @tomusdrw

Fixed in #599 
