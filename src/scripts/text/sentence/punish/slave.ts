/**
 * This module provides rules and logic for generating narrative punishment reasons for slave characters.
 *
 * Types:
 * - Unit: Represents a slave character (see game model for details)
 * - PunishRule: Rule for evaluating slave behavior and generating text
 */

import { PunishRule, evaluateRules } from "./rules";

/**
 * Array of rules for determining why a slave might be punished.
 * Each rule contains a check function and a text template function.
 * @type {PunishRule[]}
 */
const slaveRules: PunishRule[] = [
  { check: u => u.getTraits().includes(setup.trait.training_none), text: (u, rep) => `${rep} acted disobediently` },
  { check: u => u.isMasochistic(), text: (u, rep) => `the masochistic slave ${rep} disobeys intentionally` },
  { check: u => !u.isCanOrgasm(), text: (u, rep) => `${rep} orgasmed without permission` },
  { check: u => !u.isCanTalk(), text: (u, rep) => `${rep} talked without permission` },
  { check: u => u.getTraits().includes(setup.trait.per_loner), text: (u, rep, their) => `${rep} accidentally insulted ${their} owner` },
  { check: u => u.getTraits().includes(setup.trait.per_lunatic), text: (u, rep) => `${rep} was being strange` },
  { check: u => u.getTraits().includes(setup.trait.per_chaste), text: (u, rep) => `${rep} showed discomfort when being used sexually` },
  { check: u => u.isHasTrait(setup.trait.per_lustful) && u.isHasDick(), text: (u, rep) => `${rep} came without permission` },
  { check: u => u.isHasTrait(setup.trait.per_lustful) && !u.isHasDick(), text: (u, rep) => `${rep} climaxed without permission` },
  { check: u => u.getTraits().includes(setup.trait.per_frugal), text: (u, rep) => `${rep} hid a small amount of money` },
  { check: u => u.getTraits().includes(setup.trait.per_lavish), text: (u, rep) => `${rep} wasted food` },
  { check: u => u.getTraits().includes(setup.trait.per_proud), text: (u, rep) => `${rep} showed signs of defiance` },
  { check: u => u.getTraits().includes(setup.trait.per_humble), text: (u, rep) => `${rep} refused to help discipline another slave` },
  { check: u => u.getTraits().includes(setup.trait.per_brave), text: (u, rep, their) => `${rep} went overboard with ${their} advances` },
  { check: u => u.getTraits().includes(setup.trait.per_cautious), text: (u, rep, their) => `${rep} was not creative enough with ${their} advances` },
  { check: u => u.getTraits().includes(setup.trait.per_kind), text: (u, rep) => `${rep} helped another slave that was being punished` },
  { check: u => u.isHasTrait(setup.trait.per_cruel), text: (u, rep) => `${rep} helped another slave under punishment` },
  { check: u => u.getTraits().includes(setup.trait.per_direct), text: (u, rep, their) => `${rep} forgot ${their} manners` },
  { check: u => u.getTraits().includes(setup.trait.per_sly), text: (u, rep) => `${rep} lied` },
  { check: u => u.getTraits().includes(setup.trait.per_dominant), text: (u, rep, their) => `${rep} overstepped ${their} borders` },
  { check: u => u.getTraits().includes(setup.trait.per_logical), text: (u, rep, their) => `${rep} corrected ${their} master unnecessarily` },
  { check: u => u.getTraits().includes(setup.trait.per_empath), text: (u, rep) => `${rep} showed pity to another disobedient slave` },
  { check: u => u.getTraits().includes(setup.trait.per_honorable), text: (u, rep) => `${rep} refused sex with an evil slaver` },
  { check: u => u.getTraits().includes(setup.trait.per_evil), text: (u, rep, their) => `${rep} schemed under ${their} owner's nose` },
  { check: u => u.getTraits().includes(setup.trait.per_attentive), text: (u, rep) => `${rep} commented unnecessarily` },
  { check: u => u.getTraits().includes(setup.trait.per_dreamy), text: (u, rep) => `${rep} did not pay attention` },
  { check: u => u.getTraits().includes(setup.trait.per_slow), text: (u, rep) => `${rep} was slow at their task` },
  { check: u => u.getTraits().includes(setup.trait.per_serious), text: (u, rep) => `${rep} looks unenthusiastic` },
  { check: u => u.getTraits().includes(setup.trait.per_loyal), text: (u, rep) => `${rep} showed excessive loyalty` },
  { check: u => u.getTraits().includes(setup.trait.per_independent), text: (u, rep) => `${rep} showed excessive disloyalty` },
  { check: u => u.getTraits().includes(setup.trait.per_playful), text: (u, rep) => `${rep} was naughty` },
  { check: u => u.getTraits().includes(setup.trait.per_stubborn) && u.getTraits().includes(setup.trait.training_none), text: (u, rep) => `${rep} stubbornly showed signs of defiance` },
  { check: u => u.getTraits().includes(setup.trait.per_studious), text: (u, rep) => `${rep} was unenthusiastic at physical acts` },
  { check: u => u.getTraits().includes(setup.trait.per_active), text: (u, rep) => `${rep} was lazy as their task` },
];

/**
 * Generates a list of narrative reasons for punishing a slave character.
 * Evaluates all rules and returns matching reason strings.
 *
 * @param {Unit} unit - The slave character to evaluate.
 * @returns {string[]} Array of punishment reason strings.
 */
export function getPunishReasonSlave(unit: Unit): string[] {
  return evaluateRules(
    unit,
    slaveRules,
    [`${unit.rep()} failed in to please <<their "${unit.key}">> owner`],
  );
}