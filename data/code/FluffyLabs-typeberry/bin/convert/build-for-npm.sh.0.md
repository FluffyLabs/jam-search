---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/build-for-npm.sh#L1-L54
title: bin/convert/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: d0b0672197e0cabfbc9b6a18115d2ab858e612f1146b388c2f18e814c8d8af6d
language: bash
---
`bin/convert/build-for-npm.sh` (lines 1–54)

```bash
#!/bin/bash
set -ex

# This script compiles the project into "single" JS file
# using @vercel/ncc. The result is in `./dist/convert`

VERSION=$(node -p "require('./package.json').version")
DESCRIPTION=$(node -p "require('./package.json').description")

# Start from the top-level project directory
cd ../..

DIST_FOLDER=./dist/convert

# clean dist dir
mkdir -p "${DIST_FOLDER}"
rm -rf "${DIST_FOLDER:?}"/*
# Build the main binary
BUILD="npx @vercel/ncc build -s -d"
$BUILD ./bin/convert/index.ts -o $DIST_FOLDER

cp ./LICENSE $DIST_FOLDER/
cp ./README.md $DIST_FOLDER/

# Make index.js executable and insert shebang
echo '#!/usr/bin/env node' > $DIST_FOLDER/temp.js && cat $DIST_FOLDER/index.js >> $DIST_FOLDER/temp.js && mv $DIST_FOLDER/temp.js $DIST_FOLDER/index.js
chmod +x $DIST_FOLDER/index.js

if [ -z "$IS_RELEASE" ]; then
  SHA=$(git rev-parse --short HEAD)
  VERSION="$VERSION-$SHA"
fi

# build package.json file
cat > $DIST_FOLDER/package.json << EOF
{
  "name": "@typeberry/convert",
  "version": "$VERSION",
  "description": "$DESCRIPTION",
  "main": "./index.js",
  "bin": {
    "convert": "./index.js"
  },
  "dependencies": {},
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
