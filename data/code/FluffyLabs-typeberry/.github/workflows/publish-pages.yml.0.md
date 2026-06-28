---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish-pages.yml#L1-L49
title: .github/workflows/publish-pages.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 62b74d70e9b2365137f5799b879ac5f21bec9918b52d328d001dd07df964227b
language: yaml
---
`.github/workflows/publish-pages.yml` (lines 1–49)

```yaml
name: Publish - GH pages

on:
  workflow_dispatch:
  push:
    branches: [ "main" ]

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  publish-codec:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - name: Use Node.js 24
      uses: actions/setup-node@v6
      with:
        node-version: 26
        cache: 'npm'
    - run: npm ci
    - name: Generate documentation
      run: npm run docs
    - name: Run links-check and generate notes.
      run: npm run reader-notes
    - name: Copy configs & schemas (configs dir)
      run: cp -r ./packages/configs/* ./web/configs/
    - name: Copy configs & schemas (schemas dir)
      run: cp -r ./packages/configs/* ./web/schemas/
    - name: Setup Pages
      uses: actions/configure-pages@v6
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v5
      with:
        path: "./web"
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v5
```
