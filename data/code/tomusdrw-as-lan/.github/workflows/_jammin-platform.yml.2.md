---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L183-L252
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 323f2fb7dc11bb1413c273cdd8ac876a10368685c2693f9868312052683c03d1
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 183–252)

```yaml
          # If the user mounts a real node_modules at /app, the entrypoint
          # must not delete it on exit. Same for a user-created symlink
          # pointing at a target we don't manage.
          stub=$(mktemp -d)

          # Subcase 1: real directory.
          mkdir "$stub/node_modules"
          touch "$stub/node_modules/MARKER"
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            true
          if [ ! -f "$stub/node_modules/MARKER" ]; then
            echo "::error::entrypoint clobbered user-supplied node_modules dir"
            ls -la "$stub"
            exit 1
          fi
          rm -rf "$stub/node_modules"

          # Subcase 2: user-created symlink to a non-managed target. The
          # entrypoint must not adopt or remove it (target string differs
          # from /usr/local/lib/node_modules).
          mkdir "$stub/user-target"
          touch "$stub/user-target/MARKER"
          ln -s "$stub/user-target" "$stub/node_modules"
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            true
          if [ ! -L "$stub/node_modules" ] || [ ! -f "$stub/node_modules/MARKER" ]; then
            echo "::error::entrypoint clobbered user-supplied node_modules symlink"
            ls -la "$stub"
            exit 1
          fi

      - name: Report uncompressed image size
        run: |
          docker image inspect "${{ inputs.primary-tag }}" \
            --format 'uncompressed size: {{.Size}} bytes'

      - name: Login to GHCR
        if: inputs.push
        uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push by digest
        if: inputs.push
        id: push
        uses: docker/build-push-action@v7
        with:
          context: .
          file: docker/jammin-as-lan.Dockerfile
          platforms: ${{ inputs.platform }}
          outputs: type=image,name=${{ inputs.image }},push-by-digest=true,name-canonical=true,push=true
          cache-from: type=gha,scope=${{ steps.platform.outputs.pair }}

      - name: Export digest
        if: inputs.push
        run: |
          mkdir -p "${RUNNER_TEMP}/digests"
          digest="${{ steps.push.outputs.digest }}"
          touch "${RUNNER_TEMP}/digests/${digest#sha256:}"

      - name: Upload digest
        if: inputs.push
        uses: actions/upload-artifact@v7
        with:
          name: digests-${{ steps.platform.outputs.pair }}
          path: ${{ runner.temp }}/digests/*
          if-no-files-found: error
          retention-days: 1
```
