/**
 * Label helpers for friendship values.
 *
 * This file maps numerical friendship amounts to human-readable labels used
 * throughout the UI and macro output.
 */

// Map an amount to the first bucket whose "maxInclusive" it doesn't exceed.
function pickByUpperBounds(amt: number, bounds: ReadonlyArray<[number, string]>): string {
  // If the game guarantees -1000..1000, this is already O(n) tiny; no need for binary search.
  for (const [maxInclusive, label] of bounds) {
    if (amt <= maxInclusive) return label;
  }
  // Fallback (should never hit if bounds ends with +Infinity).
  return bounds[bounds.length - 1][1];
}

/** Titles for general friendship */
const FRIEND_TITLE_BOUNDS: ReadonlyArray<[number, string]> = [
  // Preserve exact -1000 special case by putting it first.
  [-1000, "archrival"],
  [-900, "big rival"],
  [-500, "rival"],
  [-300, "competitor"],
  [-150, "minor rival"],
  [149, "acquaintance"],     // (< 150)
  [299, "distant friend"],   // (< 300)
  [499, "friend"],           // (< 500)
  [899, "companion"],        // (< 900)
  [999, "confidant"],        // (< 1000)
  [Infinity, "best friend"], // else
];

/** Titles for slave-oriented phrasing */
const FRIEND_SLAVE_TITLE_BOUNDS: ReadonlyArray<[number, string]> = [
  [-1000, "is terrified by"],
  [-900, "is frightened by"],
  [-500, "respects"],
  [-300, "is scared by"],
  [-150, "slightly respects"],
  [149, "is indifferent to"], // (< 150)
  [299, "slightly trusts"],   // (< 300)
  [499, "is loyal to"],       // (< 500)
  [899, "is devoted to"],     // (< 900)
  [999, "is bonded to"],      // (< 1000)
  [Infinity, "is fully bonded to"],
];

/**
 * Return a generic friendship title for a numeric friendship amount.
 *
 * @param {number} amt - Friendship value (expected range roughly -1000..1000)
 * @returns {string} Human readable friendship label.
 */
export function getFriendTitle(amt: number): string {
  return pickByUpperBounds(amt, FRIEND_TITLE_BOUNDS);
}

/**
 * Return a slave-oriented friendship phrase for a numeric friendship amount.
 * This is phrased to fit constructions like "<<their \"key\">> is loyal to".
 *
 * @param {number} amt - Friendship value
 * @returns {string} Slave-oriented friendship phrase.
 */
export function getFriendSlaveTitle(amt: number): string {
  return pickByUpperBounds(amt, FRIEND_SLAVE_TITLE_BOUNDS);
}
