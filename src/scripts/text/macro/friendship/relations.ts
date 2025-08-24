/**
 * Relation helpers for friendship macros.
 *
 * Decision rules (priority order):
 * 1. Lovers: a direct lover link always yields 'lover'.
 * 2. Family: if a family relation exists, use its representation.
 * 3. Slaves: if either party is a slave and there's no lover/family, return
 *    an empty string to avoid awkward phrasing — slave-specific wording is
 *    handled elsewhere.
 * 4. Friendship strength: only return a friendship-based label for strong
 *    positive/negative ties; weak ties (roughly -200..200) are considered
 *    insignificant and return an empty string.
 */

import { getFriendTitle } from "./labels";

/**
 * Return a short label describing how `unit1` sees `unit2` based on lover/friendship.
 *
 * This function intentionally focuses on the emotional label (lover/friend/...)
 * and delegates numeric-to-label mapping to `getFriendTitle`.
 *
 * @param {Unit} unit1 - Observer unit.
 * @param {Unit} unit2 - Target unit.
 * @returns {string} Relation label (e.g. 'lover', 'friend', 'companion').
 */
export function getFriend(unit1: Unit, unit2: Unit): string {
  // Direct lover relationship is the highest-priority label.
  if (unit1.getLover() == unit2) return "lover";

  // Fall back to numeric friendship value and map to a human label.
  const friendship = State.variables.friendship.getFriendship(unit1, unit2);
  return getFriendTitle(friendship);
}

/**
 * Compute a general relation between two units.
 *
 * Precedence summary:
 * - If units are lovers, return 'lover'.
 * - If there is a family relation, use its textual representation.
 * - If either unit is a slave, return empty string (no generic relation shown).
 * - If friendship is weak (between -200 and 200), return empty string.
 * - Otherwise, return the friendship-derived label from `getFriend`.
 *
 * The empty-string return value is used so callers can omit relation fragments
 * when there is no meaningful relationship to display.
 *
 * @param {Unit} unit1 - Observer unit.
 * @param {Unit} unit2 - Target unit.
 * @returns {string} Relation label or empty string when no label should be shown.
 */
export function getRel(unit1: Unit, unit2: Unit): string {
  if (unit1.getLover() == unit2) return "lover";

  // family relations are authoritative and already formatted via `rep()`
  const relation = State.variables.family.getRelation(unit2, unit1);
  if (relation) return relation.rep();

  // For slave contexts, avoid generating a generic relation fragment here.
  if (unit1.isSlave() || unit2.isSlave()) return "";

  // Only show non-empty friendship labels for reasonably strong ties.
  // The -200..200 band is treated as 'no distinct relation' to keep UI concise.
  const friendship = State.variables.friendship.getFriendship(unit1, unit2);
  if (friendship > -200 && friendship < 200) return "";

  return getFriend(unit1, unit2);
}

/**
 * Return a wiki-ready phrase combining the observer's 'their' key with the relation.
 * Example output: '<<their "alice">> friend' or an empty string if there's no relation.
 *
 * This is intended for insertion into wiki-markup passages where the 'their' form
 * (possessive/keyed pronoun) should prefix the relation.
 *
 * @param {Unit} unit1 - Observer unit.
 * @param {Unit} unit2 - Target unit.
 * @returns {string} Wiki-ready relation fragment (possibly empty).
 */
export function getTheirRel(unit1: Unit, unit2: Unit): string {
  const rel = getRel(unit1, unit2);
  if (!rel) return "";
  return `<<their "${unit1.key}">> ${rel}`;
}

/**
 * Return a human-readable "name + relation" string like 'Alice friend'.
 * Returns empty string when no relation should be shown.
 *
 * @param {Unit} unit1 - Observer unit.
 * @param {Unit} unit2 - Target unit.
 * @returns {string} Name-and-relation string or empty string.
 */
export function getNameRel(unit1: Unit, unit2: Unit): string {
  const rel = getRel(unit1, unit2);
  if (!rel) return "";
  return `${unit1.rep()} ${rel}`;
}
