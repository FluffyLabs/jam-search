---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.ts#L96-L213
title: packages/core/collections/blob-dictionary.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 5
content_sha: 2de9158c051c66416f7e8790e09d7630509eb35ece0e13070d763d7f3cf357a5
language: typescript
---
`packages/core/collections/blob-dictionary.ts` (lines 96–213)

```typescript
   * - When the call only overrides an existing value (no structural add/delete), the method returns `null`.
   *
   * This method is intended for internal use by the dictionary implementation and allows `undefined` as a
   * sentinel value to signal removals.
   *
   * @param key - The key to insert, update or remove.
   * @param value - The value to associate with the key, or `undefined` to remove the key.
   * @returns The leaf node created or removed on add/delete, or `null` if the operation only overwrote an existing value.
   */
  private internalSet(key: K, value: V | undefined): Leaf<K, V> | null {
    let node: Node<K, V> = this.root;
    const keyChunkGenerator = key.chunks(CHUNK_SIZE);
    let depth = 0;

    for (;;) {
      const maybeKeyChunk = keyChunkGenerator.next().value;
      if (maybeKeyChunk === undefined) {
        if (value === undefined) {
          return node.remove(key);
        }
        return node.set(key, value);
      }

      const keyChunk: KeyChunk = asOpaqueType(maybeKeyChunk);

      if (node.children instanceof ListChildren) {
        const subkey = BytesBlob.blobFrom(key.raw.subarray(CHUNK_SIZE * depth));
        const leaf = value !== undefined ? node.children.insert(subkey, { key, value }) : node.children.remove(subkey);

        if (subkey.length > CHUNK_SIZE && node.children.children.length > this.mapNodeThreshold) {
          node.convertListChildrenToMap();
        }
        return leaf;
      }

      depth += 1;

      const children = node.children;
      if (children instanceof ListChildren) {
        throw new Error("We handle list node earlier. If we fall through, we know it's for the `Map` case.");
      }

      if (children instanceof MapChildren) {
        const maybeNode = children.getChild(keyChunk);

        if (maybeNode !== undefined) {
          // simply go one level deeper
          node = maybeNode;
        } else {
          // we are trying to remove an item, but it does not exist
          if (value === undefined) {
            return null;
          }

          // no more child nodes, we insert a new one.
          const newNode = Node.withList<K, V>();
          children.setChild(keyChunk, newNode);
          node = newNode;
        }
        continue;
      }

      assertNever(children);
    }
  }

  /**
   * Adds a new entry to the dictionary or updates the value of an existing key.
   *
   * If an entry with the given key already exists, its value is replaced
   * with the new one.
   *
   * @param key - The key to add or update in the dictionary.
   * @param value - The value to associate with the specified key.
   * @returns Nothing (`void`).
   */
  set(key: K, value: V): void {
    const leaf = this.internalSet(key, value);
    if (leaf !== null) {
      this.keyvals.set(leaf.key, leaf);
    }
  }

  /**
   * Retrieves the value associated with the given key from the dictionary.
   *
   * If the key does not exist, this method returns `undefined`.
   *
   * @param key - The key whose associated value should be retrieved.
   * @returns The value associated with the specified key, or `undefined` if the key is not present.
   */
  get(key: K): V | undefined {
    let node: MaybeNode<K, V> = this.root;
    const pathChunksGenerator = key.chunks(CHUNK_SIZE);
    let depth = 0;

    while (node !== undefined) {
      if (node.children instanceof ListChildren) {
        const subkey = depth === 0 ? key : BytesBlob.blobFrom(key.raw.subarray(depth * CHUNK_SIZE));
        const child = node.children.find(subkey);
        if (child !== null) {
          return child.value;
        }
      }

      const maybePathChunk = pathChunksGenerator.next().value;

      if (maybePathChunk === undefined) {
        return node.getLeaf()?.value;
      }

      if (node.children instanceof MapChildren) {
        const pathChunk: KeyChunk = asOpaqueType(maybePathChunk);
        node = node.children.getChild(pathChunk);
        depth += 1;
      }
    }

```
