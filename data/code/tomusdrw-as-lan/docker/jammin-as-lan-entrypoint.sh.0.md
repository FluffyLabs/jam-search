---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docker/jammin-as-lan-entrypoint.sh#L1-L49
title: docker/jammin-as-lan-entrypoint.sh
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8291501231a050a24beb8523c95f0f35c7aa4c924c0e22939bc5deb1a2cb316e
language: bash
---
`docker/jammin-as-lan-entrypoint.sh` (lines 1–49)

```bash
#!/bin/sh
# Bridge the global node_modules into /app for asc/wasm-pvm relative-path
# lookups. AssemblyScript's compiler walks up from the entry file looking
# for `node_modules/` (it does NOT honor NODE_PATH), and jammin's default
# `pvm` script invokes wasm-pvm with `--adapter
# node_modules/@fluffylabs/as-lan/pvm-adapter.wat` — both need
# /app/node_modules to resolve.
#
# Caveat: /app is bind-mounted from the host, so the symlink we create
# there leaks onto the host filesystem. `docker run --rm` only cleans up
# the container's writable layer; bind-mounted paths are user-managed.
# Track ownership and remove the symlink in an EXIT trap so a successful
# run leaves the host directory untouched. SIGINT/SIGTERM are also
# trapped (docker stop hits us with SIGTERM after a 10s grace period).
# SIGKILL is uncatchable — abruptly killed containers may still leak,
# so we also adopt any pre-existing symlink that points at our managed
# target on entry, letting a later successful run clean up the leak.

MANAGED_LINK_TARGET=/usr/local/lib/node_modules
CREATED_LINK=

cleanup() {
    # Re-check the target on exit too: the command may have repointed the
    # link mid-run (unlikely for asc/wasm-pvm, but cheap to guard against).
    # Only remove a symlink that still matches what we'd have created, so
    # ownership doesn't silently transfer if the user took over.
    if [ -n "$CREATED_LINK" ] \
            && [ -L /app/node_modules ] \
            && [ "$(readlink /app/node_modules)" = "$MANAGED_LINK_TARGET" ]; then
        rm -f /app/node_modules
    fi
}
trap cleanup EXIT
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

# Adopt a leftover from a SIGKILLed prior run if it points at the same
# target we'd create — readlink returns the literal string we wrote, so
# an exact match means it's ours. Anything else (user-supplied dir,
# user-created symlink to somewhere else) is left alone.
if [ -L /app/node_modules ] \
        && [ "$(readlink /app/node_modules)" = "$MANAGED_LINK_TARGET" ]; then
    CREATED_LINK=1
elif [ ! -e /app/node_modules ] && [ ! -L /app/node_modules ]; then
    ln -s "$MANAGED_LINK_TARGET" /app/node_modules
    CREATED_LINK=1
fi

"$@"
```
