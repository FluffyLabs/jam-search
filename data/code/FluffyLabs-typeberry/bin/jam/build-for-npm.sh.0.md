---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/build-for-npm.sh#L1-L95
title: bin/jam/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e803a8dca8766cf612d6d66ddf64e0dd35b0a9461c4cb413384e74709948865a
language: bash
---
`bin/jam/build-for-npm.sh` (lines 1–95)

```bash
#!/bin/bash
set -ex

# This script compiles the project into "single" JS file (it's actually one per worker thread)
# using @vercel/ncc. The result is in `./dist/jam`

VERSION=$(node -p "require('./package.json').version")
DESCRIPTION=$(node -p "require('./package.json').description")

# Start from the top-level project directory
cd ../..

DIST_FOLDER=./dist/jam

# clean dist file
mkdir $DIST_FOLDER || true
rm -rf $DIST_FOLDER/*

# TODO [ToDr] Temporary require anan-as before https://github.com/tomusdrw/anan-as/issues/99
# is resolved.
# Build the main binary
BUILD="npx @vercel/ncc build -a -s -e lmdb -e @matrixai/quic -e tsx/esm/api"
$BUILD ./bin/jam/index.ts -o $DIST_FOLDER

# Fix un-compiled worker files to point to the ones we will compile manually.
#
# Despite using `-a` flag, @vercel/ncc does not bundle the worker files,
# so they still point to some external files via `import` statements.
# To fix that, we manually build workers and move the files inside.

# Build all workers separately and then the main binary
$BUILD ./packages/workers/importer/index.ts -o $DIST_FOLDER/importer
$BUILD ./packages/workers/jam-network/index.ts -o $DIST_FOLDER/jam-network
$BUILD ./packages/workers/block-authorship/index.ts -o $DIST_FOLDER/block-authorship

# copy some files that should be there
cp ./LICENSE $DIST_FOLDER/
cp ./README.md $DIST_FOLDER/

# Flatten the workers structure
cd $DIST_FOLDER

cd ./importer
rm *.mjs || true
mv index.js bootstrap-importer.mjs
mv index.js.map bootstrap-importer.mjs.map
mv * ../
cd ../jam-network
rm *.mjs || true
mv index.js bootstrap-network.mjs
mv index.js.map bootstrap-network.mjs.map
mv * ../
cd ../block-authorship
rm *.mjs || true
mv index.js bootstrap-generator.mjs
mv index.js.map bootstrap-generator.mjs.map
mv * ../
cd ../

# copy worker wasm files
cp **/*.wasm ./ || true # ignore overwrite errors

# Make index.js executable and insert shebang with 8GB heap size
echo '#!/usr/bin/env -S node --max-old-space-size=8192' > ./temp.js && cat ./index.js >> ./temp.js && mv ./temp.js ./index.js
chmod +x ./index.js

if [ -z "$IS_RELEASE" ]; then
  SHA=$(git rev-parse --short HEAD)
  VERSION="$VERSION-$SHA"
fi

# build package.json file
cat > ./package.json << EOF
{
  "name": "@typeberry/jam",
  "version": "$VERSION",
  "description": "$DESCRIPTION",
  "main": "./index.js",
  "bin": {
    "jam": "./index.js"
  },
  "dependencies": {
    "lmdb": "3.1.3",
    "@matrixai/quic": "2.0.9"
  },
  "homepage": "https://typeberry.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "author": "Fluffy Labs <hello@fluffylabs.dev>",
  "license": "MPL-2.0",
  "type": "module"
}
EOF
```
