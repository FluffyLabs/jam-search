---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L94-L169
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e82bd59a156133c57c98a66ea7bcf1fba184c7417ac941077ece3b5db6ea7dc4
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 94–169)

```yaml
          out=$(docker run --rm "${{ inputs.primary-tag }}")
          rc=$?
          set -e
          echo "$out"
          if [ "$rc" -ne 64 ]; then
            echo "::error::expected exit 64 from no-args run, got $rc"
            exit 1
          fi
          echo "$out" | grep -q 'jammin-as-lan: builder image'

      - name: Smoke test — pre-baked SDK resolves without npm install
        run: |
          set -eux
          # A service mounted at /app with no node_modules must still
          # compile via `asc` because the entrypoint symlinks the global
          # node_modules into /app/node_modules.
          stub=$(mktemp -d)
          mkdir -p "$stub/assembly"
          cat > "$stub/package.json" <<'EOF'
          {
            "name": "smoke-stub",
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "asbuild": "asc assembly/index.ts --target debug --runtime=stub"
            }
          }
          EOF
          cat > "$stub/assembly/index.ts" <<'EOF'
          import { Bytes32 } from "@fluffylabs/as-lan/core/bytes";
          export function ping(): u32 {
            return Bytes32.zero().length;
          }
          EOF
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            npm run asbuild

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
        uses: actions/upload-artifact@v4
        with:
          name: digests-${{ steps.platform.outputs.pair }}
          path: ${{ runner.temp }}/digests/*
          if-no-files-found: error
          retention-days: 1
```
