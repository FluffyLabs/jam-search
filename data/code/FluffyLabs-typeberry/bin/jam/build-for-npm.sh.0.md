---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/build-for-npm.sh#L1-L81
title: bin/jam/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: de541cc89a2b076d013567b992a14203f0bb78188952ba7bc450a69914544e60
language: bash
---
`bin/jam/build-for-npm.sh` (lines 1–81)

```bash
#!/bin/bash
set -ex

# This script compiles the project into "single" JS file (it's actually one per worker thread)
# using @vercel/ncc. The result is in `./dist/jam`

VERSION=$(node -p "require('./package.json').version")
DESCRIPTION=$(node -p "require('./package.json').description")

# Start from the top-level project directory
cd ../..

# These four are native/external modules that ncc can't bundle, so they ship as
# real prod deps and get installed by the `npm install` below. We read the
# versions from the packages that actually declare them instead of hardcoding,
# so the bundle never drifts from the rest of the workspace.
#
# @typeberry/native carries the bandersnatch native addon as platform-specific
# optionalDependencies. ncc can't bundle the runtime `require(<platformPkg>)`
# (the argument is computed at runtime), so shipping it as a dep lets npm pull
# the matching `.node` binary into dist/jam/node_modules. Otherwise the node
# falls back to the slower wasm impl.
#
# @fjall-js/fjall is the same story: a napi-rs native addon whose generated
# index.js uses CommonJS `__dirname` to locate its `.node` binary. Inlining it
# into the ESM bundle crashes at load with "__dirname is not defined", and even
# if it bundled it would freeze the build host's platform binary into the bundle
# (wrong for cross-platform deploys). Externalizing + shipping as a dep lets npm
# pull the matching platform binary, just like lmdb.
NATIVE_VERSION=$(node -p "require('./packages/core/crypto/package.json').dependencies['@typeberry/native']")
LMDB_VERSION=$(node -p "require('./packages/jam/database-lmdb/package.json').dependencies.lmdb")
QUIC_VERSION=$(node -p "require('./packages/core/networking/package.json').dependencies['@matrixai/quic']")
FJALL_VERSION=$(node -p "require('./packages/jam/database-fjall/package.json').dependencies['@fjall-js/fjall']")

# A missing/renamed dependency key makes `node -p` print the literal "undefined"
# and exit 0, so `set -e` won't catch it. Bail out here with a clear message
# instead of writing a broken "undefined" version into dist/jam/package.json.
for pair in "@typeberry/native=$NATIVE_VERSION" "lmdb=$LMDB_VERSION" "@matrixai/quic=$QUIC_VERSION" "@fjall-js/fjall=$FJALL_VERSION"; do
  name="${pair%%=*}"
  ver="${pair#*=}"
  if [ -z "$ver" ] || [ "$ver" = "undefined" ]; then
    echo "ERROR: could not resolve version for '$name' from its package.json" >&2
    exit 1
  fi
done

DIST_FOLDER=./dist/jam

# clean dist file
mkdir $DIST_FOLDER || true
rm -rf $DIST_FOLDER/*

# When VERSION_SHA is set (e.g. Docker builds) append it to the version. The
# banner version is inlined by ncc from packages/core/utils/package.json: the
# `../../../package.json` import in that package resolves there through the
# workspace symlink, NOT to the repo root, so we must stamp utils (not root).
if [ -n "$VERSION_SHA" ]; then
  VERSION="$VERSION-$VERSION_SHA"
  npm pkg set version="$VERSION" -w packages/core/utils
fi

# Build the main binary
BUILD="npx @vercel/ncc build -a -s -e lmdb -e @matrixai/quic -e @fjall-js/fjall -e tsx/esm/api"
$BUILD ./bin/jam/index.ts -o $DIST_FOLDER

# Despite using `-a` flag, @vercel/ncc does not bundle the worker files,
# so they still point to some external files via `import` statements.
# To fix that, we manually build workers and move the files inside.

# NOTE: the entry MUST be `bootstrap-main.ts` (the file that actually calls
# `initWorker()` + `main()`), NOT `index.ts`. For some reason bundling
# `index.ts` produces a worker that does nothing on load so the app just
# hangs and does not do anything.
$BUILD ./packages/workers/importer/bootstrap-main.ts -o $DIST_FOLDER/importer
$BUILD ./packages/workers/jam-network/bootstrap-main.ts -o $DIST_FOLDER/jam-network
$BUILD ./packages/workers/block-authorship/bootstrap-main.ts -o $DIST_FOLDER/block-authorship

# copy some files that should be there
cp ./LICENSE $DIST_FOLDER/
cp ./README.md $DIST_FOLDER/

```
