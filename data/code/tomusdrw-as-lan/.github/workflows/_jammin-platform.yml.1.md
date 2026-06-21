---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/.github/workflows/_jammin-platform.yml#L94-L187
title: .github/workflows/_jammin-platform.yml
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: bc6832b741d555383e21729ab2a74aae26abd4dcbd873294fff9b0eec7bb8411
language: yaml
---
`.github/workflows/_jammin-platform.yml` (lines 94–187)

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

      - name: Smoke test — pvm-adapter.wat reachable from /app/node_modules
        run: |
          set -eux
          # jammin's default `pvm` script invokes wasm-pvm with
          # `--adapter node_modules/@fluffylabs/as-lan/pvm-adapter.wat`,
          # a relative path resolved from the service cwd (/app). This
          # regresses if the SDK is installed via a path that bypasses the
          # `prepack` hook (e.g. `npm install -g <localdir>` without
          # packing first), because pvm-adapter.wat is staged into the
          # package by prepack.
          stub=$(mktemp -d)
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            test -f node_modules/@fluffylabs/as-lan/pvm-adapter.wat

      - name: Smoke test — entrypoint cleans up /app/node_modules symlink
        run: |
          set -eux
          # /app is bind-mounted, so any symlink the entrypoint creates
          # there leaks onto the host. Verify the entrypoint removes it
          # on exit, otherwise users see a dangling
          # services/<svc>/node_modules -> /usr/local/lib/node_modules
          # link that breaks subsequent host-side `npm install`.
          stub=$(mktemp -d)
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            true
          if [ -L "$stub/node_modules" ] || [ -e "$stub/node_modules" ]; then
            echo "::error::entrypoint left node_modules behind in bind-mounted /app"
            ls -la "$stub"
            exit 1
          fi

      - name: Smoke test — entrypoint adopts orphan managed symlink
        run: |
          set -eux
          # Recovery path for SIGKILLed prior runs. SIGKILL bypasses our
          # EXIT/INT/TERM traps, so the managed symlink leaks onto the
          # host. The entrypoint should treat any /app/node_modules link
          # whose target matches our managed path as ours and clean it
          # up on the next successful run.
          stub=$(mktemp -d)
          ln -s /usr/local/lib/node_modules "$stub/node_modules"
          docker run --rm -v "$stub:/app" "${{ inputs.primary-tag }}" \
            true
          if [ -L "$stub/node_modules" ] || [ -e "$stub/node_modules" ]; then
            echo "::error::orphan managed symlink not reclaimed by entrypoint"
            ls -la "$stub"
            exit 1
          fi

      - name: Smoke test — entrypoint leaves user-supplied node_modules alone
        run: |
          set -eux
          # If the user mounts a real node_modules at /app, the entrypoint
          # must not delete it on exit. Same for a user-created symlink
          # pointing at a target we don't manage.
          stub=$(mktemp -d)

```
