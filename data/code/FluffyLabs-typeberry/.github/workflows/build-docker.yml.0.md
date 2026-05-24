---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/build-docker.yml#L1-L51
title: .github/workflows/build-docker.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 560df993185162024d68cfa06e919b4e2e25d68604eca32563934c9e921a1105
language: yaml
---
`.github/workflows/build-docker.yml` (lines 1–51)

```yaml
name: Build - Docker

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  #merge_group: # no need to build docker in merge queue

jobs:
  docker-build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v6

    - name: Get short commit SHA
      id: sha
      run: echo "short=$(git rev-parse --short HEAD)" >> "$GITHUB_OUTPUT"

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: false
        load: true
        tags: typeberry:latest
        # This is not a release build, so stamp the commit into the version.
        build-args: |
          VERSION_SHA=${{ steps.sha.outputs.short }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Test Docker image
      run: |
        docker run --rm typeberry:latest --help

    - name: Save Docker image
      run: |
        docker save typeberry:latest | gzip > typeberry-image.tar.gz

    - name: Upload Docker image artifact
      uses: actions/upload-artifact@v4
      with:
        name: typeberry-docker-image
        path: typeberry-image.tar.gz
        retention-days: 1
```
