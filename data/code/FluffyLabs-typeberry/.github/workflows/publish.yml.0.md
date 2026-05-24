---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L1-L126
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 2
content_sha: dd8d5aab011262c0a364e78903645b5d0fcd99419ea0e6ab938703b3dbceaba3
language: yaml
---
`.github/workflows/publish.yml` (lines 1–126)

```yaml
name: Publish

on:
  workflow_dispatch:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    strategy:
      fail-fast: false
      matrix:
        node-version: [24]
        project: [lib, jam, convert]

    steps:
    - uses: actions/checkout@v6
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v6
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        registry-url: 'https://registry.npmjs.org'

    - name: Install dependencies
      run: npm ci

    - name: Get short commit SHA
      id: sha
      run: echo "short=$(git rev-parse --short HEAD)" >> "$GITHUB_OUTPUT"

    - name: Build @typeberry/${{ matrix.project }}
      run: npm run build -w @typeberry/${{ matrix.project }}
      # Stamp the commit into the version for everything except a real (non-pre)
      # release, which publishes the clean version. The SHA is the truthy branch
      # on purpose: GitHub Actions' `cond && A || B` returns B when A is empty,
      # so an empty-string true-branch would never win.
      env:
        VERSION_SHA: ${{ (github.event_name != 'release' || github.event.release.prerelease) && steps.sha.outputs.short || '' }}

    - name: Determine npm tag
      id: npm-tag
      run: |
        if [[ "${{ github.event_name }}" == "release" && "${{ github.event.release.prerelease }}" != "true" ]]; then
          echo "tag=latest" >> $GITHUB_OUTPUT
        else
          echo "tag=next" >> $GITHUB_OUTPUT
        fi

    - name: Get package version
      id: pkg-version
      working-directory: ./dist/${{ matrix.project }}
      run: |
        VERSION=$(node -p "require('./package.json').version")
        echo "version=$VERSION" >> $GITHUB_OUTPUT

    - name: Check if version exists on npm
      id: check-version
      run: |
        if npm view @typeberry/${{ matrix.project }}@${{ steps.pkg-version.outputs.version }} version 2>/dev/null; then
          echo "exists=true" >> $GITHUB_OUTPUT
        else
          echo "exists=false" >> $GITHUB_OUTPUT
        fi

    - name: Publish @typeberry/${{ matrix.project }}
      if: steps.check-version.outputs.exists == 'false'
      working-directory: ./dist/${{ matrix.project }}
      run: npm publish --access public --tag ${{ steps.npm-tag.outputs.tag }}

    - name: Tag existing version
      if: steps.check-version.outputs.exists == 'true'
      run: npm dist-tag add @typeberry/${{ matrix.project }}@${{ steps.pkg-version.outputs.version }} ${{ steps.npm-tag.outputs.tag }}

  publish-docker:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - uses: actions/checkout@v6
    - uses: docker/setup-buildx-action@v3

    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract version from package.json
      id: version
      run: |
        VERSION=$(node -p "require('./package.json').version")
        echo "version=$VERSION" >> $GITHUB_OUTPUT
        echo "Version: $VERSION"

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: |
          ghcr.io/${{ github.repository_owner }}/typeberry
        tags: |
          type=semver,pattern={{version}},value=${{ steps.version.outputs.version }}
          type=raw,value=latest,enable=${{ github.event_name == 'release' && !github.event.release.prerelease }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64

```
