---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/pages.yml#L1-L38
title: .github/workflows/pages.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ace55bff09c30e65c5b0ef29387bbe16b9a3ac2eb4b3d5c3a257a4f4c98d7fca
language: yaml
---
`.github/workflows/pages.yml` (lines 1–38)

```yaml
name: Deploy docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: jontze/action-mdbook@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - run: mdbook build docs
      - run: cp scripts/start.sh docs/book/
      - name: Copy fibonacci example for scaffold template
        run: |
          mkdir -p docs/book/fibonacci
          rsync -a --exclude='node_modules/' --exclude='build/' --exclude='package-lock.json' \
            examples/fibonacci/ docs/book/fibonacci/
      - uses: actions/upload-pages-artifact@v5
        with:
          path: docs/book
      - id: deployment
        uses: actions/deploy-pages@v5
```
