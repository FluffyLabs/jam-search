---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/packages/README.md#L92-L102'
title: packages/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: f4b0bba167123917234b52aad0344a7f2aa50147e7e2a2c676e59cf2d5348bd7
language: markdown
---
`packages/README.md` (lines 92–102)

```markdown
4. **Use @typeberry scope**: Package names should use the `@typeberry/` npm scope
5. **Add dependencies**: Reference other packages using the `@typeberry/` scope and "*" version for local packages

## Package Organization Guidelines

- **Core packages** should be framework-agnostic and provide fundamental functionality
- **JAM packages** contain JAM-specific implementations and logic, builds on core.
- **Extensions** add optional functionality that builds on core or jam packages
- **Workers** contain background processing and worker-specific code
- **Configs** store configuration files and schemas
- **Misc** contains development tools and utilities that don't fit elsewhere
```
