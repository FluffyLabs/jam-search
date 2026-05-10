---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/build-docker.yml#L1-L44
title: .github/workflows/build-docker.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: cb0c3f9103c1144c28d4e0a037dd50d768c3d050ef266d68c66bc6d74cbcb4f0
language: yaml
---
`.github/workflows/build-docker.yml` (lines 1–44)

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

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: false
        load: true
        tags: typeberry:latest
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
