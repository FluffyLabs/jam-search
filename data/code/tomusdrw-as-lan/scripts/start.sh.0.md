---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/scripts/start.sh#L1-L88'
title: scripts/start.sh
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d7b3534113f5ab4ac32e95afd45a8fb5151a25c756934b14ad09e93c6f3461f5
language: bash
---
`scripts/start.sh` (lines 1–88)

```bash
#!/usr/bin/env bash
set -euo pipefail

# Scaffold a new JAM service project using the as-lan SDK.
# Uses the fibonacci example as a template, fetching files from GitHub Pages.
# Usage: start.sh <service-name>

if [ $# -lt 1 ]; then
  echo "Usage: $0 <service-name>"
  echo "Example: $0 my-service"
  exit 1
fi

NAME="$1"
AS_LAN_REPO="${AS_LAN_REPO:-https://github.com/tomusdrw/as-lan.git}"
BASE_URL="${BASE_URL:-https://todr.me/as-lan/fibonacci}"

if [ -d "$NAME" ]; then
  echo "Error: directory '$NAME' already exists."
  exit 1
fi

echo "Creating JAM service '$NAME'..."

mkdir -p "$NAME"
cd "$NAME"

git init -q

echo "Adding as-lan SDK as git submodule..."
git submodule add -q "$AS_LAN_REPO" sdk

# --- Download template files from the fibonacci example ---
FILES=(
  asconfig.json
  assembly/index.ts
  assembly/fibonacci.ts
  assembly/index.test.ts
  assembly/test-run.ts
  assembly/tsconfig.json
  bin/test.js
  package.json
)

for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  echo "  Downloading $file..."
  curl -sfL "$BASE_URL/$file" -o "$file"
done

# --- Patch package.json: name, SDK path, ecalli mocks path, PVM adapter path ---
# Order matters: rewrite the longer `sdk-ecalli-mocks` path before the
# shorter `sdk` path so the latter doesn't also match inside the former.
sed -i.bak \
  -e "s|@fluffylabs/as-lan-fibonacci-example|$NAME|" \
  -e 's|file:../../sdk-ecalli-mocks|file:./sdk/sdk-ecalli-mocks|' \
  -e 's|file:../../sdk|file:./sdk|' \
  -e 's|../../pvm-adapter.wat|./sdk/pvm-adapter.wat|' \
  package.json
rm package.json.bak

# --- Patch assembly/tsconfig.json: SDK paths ---
sed -i.bak \
  -e 's|\.\./\.\./\.\./sdk/|../sdk/|g' \
  assembly/tsconfig.json
rm assembly/tsconfig.json.bak

# --- Generate .gitignore (not worth a fetch) ---
cat > .gitignore <<'IGNEOF'
node_modules
build
IGNEOF

echo "Installing dependencies..."
npm install

echo ""
echo "Success! Your JAM service '$NAME' is ready."
echo ""
echo "Next steps:"
echo "  cd $NAME"
echo "  npm run build          # compile WASM + PVM (release)"
echo "  npm test               # run tests"
echo "  # edit assembly/fibonacci.ts to implement your service logic"
echo ""
echo "Note: 'npm run build' produces a .pvm binary in build/."
echo "  Make sure 'wasm-pvm' is installed: cargo install wasm-pvm-cli@0.8.0"
echo ""
```
