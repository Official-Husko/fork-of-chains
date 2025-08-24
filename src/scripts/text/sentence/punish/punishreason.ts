/**
 * This module provides the main function to select a random punishment reason for a unit.
 * Delegates to slave or slaver logic as appropriate based on unit type.
 *
 * Types:
 * - Unit: Represents a character (slave or slaver)
 */

import { getPunishReasonSlave } from "./slave";
import { getPunishReasonSlaver } from "./slaver";

/**
 * Returns a random punishment reason for a given unit.
 * Uses slave or slaver logic depending on the unit type.
 *
 * @param {Unit} unit - The character to evaluate.
 * @returns {string} A randomly selected punishment reason string.
 */
export function punishreason(unit: Unit): string {
  const outputs = unit.isSlave()
    ? getPunishReasonSlave(unit)
    : getPunishReasonSlaver(unit);
  return setup.rng.choice(outputs);
}