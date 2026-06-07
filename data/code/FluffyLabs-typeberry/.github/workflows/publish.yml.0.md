---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/.github/workflows/publish.yml#L1-L119
title: .github/workflows/publish.yml
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: aba50ae0cc8e3577a4893e282d11c6aca1ad4592f0b9161f23d6392c3eafa3c0
language: yaml
---
`.github/workflows/publish.yml` (lines 1–119)

```yaml
name: Build & Publish

on:
  workflow_dispatch:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  publish-npm:
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    strategy:
      fail-fast: false
      matrix:
        node-version: [26]
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

  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - uses: actions/checkout@v6
    - uses: docker/setup-buildx-action@v4

    - name: Get short commit SHA
      id: sha
      run: echo "short=$(git rev-parse --short HEAD)" >> "$GITHUB_OUTPUT"

    - name: Get package version
      id: version
      run: echo "version=$(node -p "require('./package.json').version")" >> "$GITHUB_OUTPUT"

    # Stamp the commit into the version for everything except a final (non-pre)
    # release. Mirrors the publish-npm VERSION_SHA logic.
    - name: Compute VERSION_SHA build-arg
      id: vsha
      run: |
        if [[ "${{ github.event_name }}" == "release" && "${{ github.event.release.prerelease }}" != "true" ]]; then
          echo "value=" >> "$GITHUB_OUTPUT"
        else
          echo "value=${{ steps.sha.outputs.short }}" >> "$GITHUB_OUTPUT"
        fi

    # metadata-action auto-lowercases the image path and produces OCI labels.
    # Tag matrix:
    #   push to main         -> next + {version}-{sha}
    #   release (prerelease) -> next + {version}-{sha}
    #   release (final)      -> {version} + latest
    #   pull_request/dispatch -> no tags (no push)
    - name: Compute image tags and labels
```
