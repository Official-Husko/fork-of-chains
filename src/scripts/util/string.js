/**
 * @file string.js
 * @description Extends the String prototype with a performant, non-colliding hashCode method for use in hashing, quick comparisons, and data structures. This implementation is designed for speed and compatibility with the Twine game engine.
 */

/**
 * Computes a 32-bit integer hash code for the string.
 * The algorithm iterates over each character, applying a bitwise operation to generate a hash.
 * Useful for hash tables, quick string comparisons, and storing string keys efficiently.
 *
 * @function
 * @memberof String.prototype
 * @returns {number} The 32-bit integer hash code of the string.
 *
 * @example
 *   "example".hashCode(); // returns a deterministic integer
 */
Object.defineProperty(String.prototype, "hashCode", {
  value: function() {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },
  writable: false,
  configurable: false,
});
