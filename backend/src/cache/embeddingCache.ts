import { createHash } from "node:crypto";

export interface EmbeddingCache {
  store(embedding: number[], query?: string): string;
  retrieve(id: string): number[] | undefined;
  clear(): void;
}

const MAX_CACHE_ENTRIES = 100_000;
const EVICTION_BATCH_SIZE = 1_000;

class InMemoryEmbeddingCache implements EmbeddingCache {
  private cache = new Map<string, number[]>();
  private lastAccess = new Map<string, number>();

  /**
   * Generate a hash ID from an embedding
   */
  private hashEmbedding(embedding: number[]): string {
    // Convert to Float32Array for consistent 32-bit precision
    const float32Array = new Float32Array(embedding);
    const buffer = Buffer.from(
      float32Array.buffer,
      float32Array.byteOffset,
      float32Array.byteLength
    );
    return createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  }

  /**
   * Store an embedding and return a cache entry ID
   */
  store(embedding: number[], query?: string): string {
    // Generate a deterministic ID from the embedding hash
    const id = this.hashEmbedding(embedding);

    // If this embedding is already cached, just update access time
    if (this.cache.has(id)) {
      this.lastAccess.set(id, Date.now());
      return id;
    }

    // Check if we need to evict entries before adding a new one
    if (this.cache.size >= MAX_CACHE_ENTRIES) {
      this.evictLeastRecentlyUsed();
    }

    const now = Date.now();
    this.cache.set(id, embedding);
    this.lastAccess.set(id, now);

    return id;
  }

  /**
   * Retrieve an embedding by cache entry ID
   */
  retrieve(id: string): number[] | undefined {
    const embedding = this.cache.get(id);
    if (embedding !== undefined) {
      // Update access time for LRU tracking
      this.lastAccess.set(id, Date.now());
    }
    return embedding;
  }

  /**
   * Clear all cache entries (useful for testing)
   */
  clear(): void {
    this.cache.clear();
    this.lastAccess.clear();
  }

  /**
   * Evict the least recently used entries in batches
   */
  private evictLeastRecentlyUsed(): void {
    // Sort entries by last access time (oldest first)
    const sortedEntries = Array.from(this.lastAccess.entries()).sort(
      (a, b) => a[1] - b[1]
    );

    // Take the oldest EVICTION_BATCH_SIZE entries
    const toEvict = sortedEntries.slice(0, EVICTION_BATCH_SIZE);

    // Remove them from all maps
    for (const [id] of toEvict) {
      this.cache.delete(id);
      this.lastAccess.delete(id);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
    };
  }
}

// Export a singleton instance
export const embeddingCache = new InMemoryEmbeddingCache();
