/**
 * This module defines the PunishRule type and provides the evaluateRules function.
 * Used for applying a set of punishment rules to a unit and generating matching narrative reasons.
 *
 * Types:
 * - Unit: Represents a character (slave or slaver)
 * - PunishRule: Rule for evaluating behavior and generating text
 */

/**
 * Represents a rule for evaluating a unit's behavior and generating a punishment reason.
 * @typedef {Object} PunishRule
 * @property {(unit: Unit) => boolean} check - Function to determine if the rule applies to the unit.
 * @property {(unit: Unit, rep: string, their: string) => string} text - Function to generate the reason text.
 */
export type PunishRule = {
  check: (unit: Unit) => boolean;
  text: (unit: Unit, rep: string, their: string) => string;
};

/**
 * Evaluates a set of rules for a given unit and returns all matching punishment reason strings.
 *
 * @param {Unit} unit - The character to evaluate.
 * @param {PunishRule[]} rules - Array of rules to check against the unit.
 * @param {string[]} base - Base reasons to include regardless of rules.
 * @returns {string[]} Array of matching punishment reason strings.
 */
export function evaluateRules(
  unit: Unit,
  rules: PunishRule[],
  base: string[],
): string[] {
  let their = `<<their \"${unit.key}\">>`;
  let rep = unit.rep();
  const outputs = [...base];

  for (const rule of rules) {
    if (rule.check(unit)) {
      outputs.push(rule.text(unit, rep, their));
    }
  }
  return outputs;
}