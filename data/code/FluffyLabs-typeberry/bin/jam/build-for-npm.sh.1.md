---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/build-for-npm.sh#L83-L130
title: bin/jam/build-for-npm.sh
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e165241785eb0f8ec70910db3bbfc0c8a2056798a3498845a9b9e60341421079
language: bash
---
`bin/jam/build-for-npm.sh` (lines 83–130)

```bash
  sed -i "\$ s|sourceMappingURL=index.js.map|sourceMappingURL=$2.mjs.map|" "$2.mjs"
  # Move the bundle up one level into $DIST_FOLDER. We can't use `mv * ../`:
  # workers that pull in telemetry also emit gRPC asset directories (proto/,
  # protoc-gen-validate/, xds/) that the main bundle - and earlier workers -
  # already created up there, and `mv` refuses to merge into a non-empty dir.
  tar cf - . | ( cd ../ && tar xf - )
  cd ../
  rm -rf "./$1"
}

# Flatten the workers structure
cd $DIST_FOLDER
flatten_worker importer bootstrap-importer
flatten_worker jam-network bootstrap-network
flatten_worker block-authorship bootstrap-generator

# copy worker wasm files
cp **/*.wasm ./ || true # ignore overwrite errors

# Make index.js executable and insert shebang with 7GB heap size limit
echo '#!/usr/bin/env -S node --max-old-space-size=7168' > ./temp.js && cat ./index.js >> ./temp.js && mv ./temp.js ./index.js
chmod +x ./index.js

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
    "lmdb": "$LMDB_VERSION",
    "@matrixai/quic": "$QUIC_VERSION",
    "@typeberry/native": "$NATIVE_VERSION"
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
