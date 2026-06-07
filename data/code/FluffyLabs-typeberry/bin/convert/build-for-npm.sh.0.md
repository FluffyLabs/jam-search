---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/build-for-npm.sh#L1-L59
title: bin/convert/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b09ffa1a4190a17f734a33657a94b27cfc03c470eb6f0d2eaf8962756932ae06
language: bash
---
`bin/convert/build-for-npm.sh` (lines 1–59)

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

# When VERSION_SHA is set (e.g. CI builds) append it to the version. convert's
# --help banner uses the version inlined by ncc from packages/core/utils/package.json
# (not the root), so we stamp utils before building, same as bin/jam. Unset =
# clean release version.
if [ -n "$VERSION_SHA" ]; then
  VERSION="$VERSION-$VERSION_SHA"
  npm pkg set version="$VERSION" -w packages/core/utils
fi

# Build the main binary
BUILD="npx @vercel/ncc build -s -d"
$BUILD ./bin/convert/index.ts -o $DIST_FOLDER

cp ./LICENSE $DIST_FOLDER/
cp ./README.md $DIST_FOLDER/

# Make index.js executable and insert shebang
echo '#!/usr/bin/env node' > $DIST_FOLDER/temp.js && cat $DIST_FOLDER/index.js >> $DIST_FOLDER/temp.js && mv $DIST_FOLDER/temp.js $DIST_FOLDER/index.js
chmod +x $DIST_FOLDER/index.js

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
