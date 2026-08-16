---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.ts#L344-L493
title: packages/core/collections/blob-dictionary.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 08dbb8f7d66b0be6fc2aa17ade624525f78f97eec51b98da0d86274de72e424c
language: typescript
---
`packages/core/collections/blob-dictionary.ts` (lines 344–493)

```typescript
 * It is needed to distinguish shorter chunks that have 0s at the end, for example: [1, 2] and [1, 2, 0]
 * */
export function bytesAsU48(bytes: Uint8Array): number {
  const len = bytes.length;

  check`${len <= CHUNK_SIZE} Length has to be <= ${CHUNK_SIZE}, got: ${len}`;

  let value = bytes[3] | (bytes[2] << 8) | (bytes[1] << 16) | (bytes[0] << 24);

  for (let i = 4; i < bytes.length; i++) {
    value = value * 256 + bytes[i];
  }

  return value * 8 + len;
}

type KeyChunk = Opaque<BytesBlob, `up to ${CHUNK_SIZE} bytes`>;
type U48 = number;
type SubKey<_K extends BytesBlob> = BytesBlob;
type OriginalKeyRef<K> = K;
type MaybeNode<K extends BytesBlob, V> = Node<K, V> | undefined;

type Leaf<K extends BytesBlob, V> = {
  key: OriginalKeyRef<K>;
  value: V;
};

class Node<K extends BytesBlob, V> {
  convertListChildrenToMap() {
    if (!(this.children instanceof ListChildren)) {
      return;
    }
    this.children = MapChildren.fromListNode<K, V>(this.children);
  }

  static withList<K extends BytesBlob, V>(): Node<K, V> {
    return new Node(undefined, ListChildren.new());
  }

  static withMap<K extends BytesBlob, V>(): Node<K, V> {
    return new Node(undefined, MapChildren.new());
  }

  private constructor(
    private leaf: Leaf<K, V> | undefined,
    public children: MapChildren<K, V> | ListChildren<K, V>,
  ) {}

  getLeaf(): Leaf<K, V> | undefined {
    return this.leaf;
  }

  remove(_key: K): Leaf<K, V> | null {
    if (this.leaf === undefined) {
      return null;
    }

    const removedLeaf = this.leaf;
    this.leaf = undefined;
    return removedLeaf;
  }

  set(key: K, value: V): Leaf<K, V> | null {
    if (this.leaf === undefined) {
      this.leaf = { key, value };
      return this.leaf;
    }
    this.leaf.value = value;
    return null;
  }
}

export class ListChildren<K extends BytesBlob, V> {
  children: [SubKey<K>, Leaf<K, V>][] = [];

  private constructor() {}

  find(key: SubKey<K>): Leaf<K, V> | null {
    const result = this.children.find((item) => item[0] === key || item[0].isEqualTo(key));

    if (result !== undefined) {
      return result[1];
    }

    return null;
  }

  remove(key: SubKey<K>): Leaf<K, V> | null {
    const existingIndex = this.children.findIndex((item) => item[0].isEqualTo(key));
    if (existingIndex >= 0) {
      const ret = this.children.splice(existingIndex, 1);
      return ret[0][1];
    }
    return null;
  }

  insert(key: SubKey<K>, leaf: Leaf<K, V>): Leaf<K, V> | null {
    const existingIndex = this.children.findIndex((item) => item[0].isEqualTo(key));
    if (existingIndex >= 0) {
      const existing = this.children[existingIndex];
      existing[1].value = leaf.value;
      return null;
    }

    this.children.push([key, leaf]);
    return leaf;
  }

  static new<K extends BytesBlob, V>() {
    return new ListChildren<K, V>();
  }
}

class MapChildren<K extends BytesBlob, V> {
  children: Map<U48, Node<K, V>> = new Map();

  private constructor() {}

  static new<K extends BytesBlob, V>(): MapChildren<K, V> {
    return new MapChildren<K, V>();
  }

  static fromListNode<K extends BytesBlob, T>(node: ListChildren<K, T>): MapChildren<K, T> {
    const mapNode = new MapChildren<K, T>();

    for (const [key, leaf] of node.children) {
      const currentKeyChunk: KeyChunk = asOpaqueType(BytesBlob.blobFrom(key.raw.subarray(0, CHUNK_SIZE)));
      const subKey = BytesBlob.blobFrom(key.raw.subarray(CHUNK_SIZE));

      let child = mapNode.getChild(currentKeyChunk);

      if (child === undefined) {
        child = Node.withList<K, T>();
        mapNode.setChild(currentKeyChunk, child);
      }

      const children = child.children as ListChildren<K, T>;
      children.insert(subKey, leaf);
    }

    return mapNode;
  }

  getChild(keyChunk: KeyChunk) {
    const chunkAsNumber = bytesAsU48(keyChunk.raw);
    return this.children.get(chunkAsNumber);
  }

  setChild(keyChunk: KeyChunk, node: Node<K, V>) {
    const chunkAsNumber = bytesAsU48(keyChunk.raw);
```
