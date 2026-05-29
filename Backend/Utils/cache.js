const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Get a value from the cache
 * @param {string} key 
 * @returns {any}
 */
const getCache = (key) => {
  return cache.get(key);
};

/**
 * Set a value in the cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} [ttl] - Optional TTL in seconds, defaults to stdTTL
 */
const setCache = (key, value, ttl) => {
  if (ttl) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
};

/**
 * Delete a specific key from the cache
 * @param {string} key 
 */
const delCache = (key) => {
  cache.del(key);
};

/**
 * Delete all keys matching a specific prefix
 * @param {string} prefix 
 */
const clearCachePrefix = (prefix) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.startsWith(prefix));
  if (keysToDelete.length > 0) {
    cache.del(keysToDelete);
  }
};

/**
 * Clear the entire cache
 */
const flushCache = () => {
  cache.flushAll();
};

module.exports = {
  getCache,
  setCache,
  delCache,
  clearCachePrefix,
  flushCache
};
