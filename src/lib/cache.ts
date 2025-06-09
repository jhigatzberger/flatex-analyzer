import { LRUCache } from 'lru-cache'

export const cache = new LRUCache<string, any>({
  max: 100, // max number of items in cache
  ttl: 1000 * 60 * 60 * 10, // 10h
});