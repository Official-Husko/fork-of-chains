/**
 * This module provides rules and logic for generating narrative punishment reasons for slaver characters.
 *
 * Types:
 * - Unit: Represents a slaver character (see game model for details)
 * - PunishRule: Rule for evaluating slaver behavior and generating text
 */

import { PunishRule, evaluateRules } from "./rules";

/**
 * Array of rules for determining why a slaver might be punished.
 * Each rule contains a check function and a text template function.
 * @type {PunishRule[]}
 */
const slaverRules: PunishRule[] = [
  { check: u => u.isMasochistic(), text: (u, rep, their) => `the masochistic slaver ${rep} showed ${their} masochistic advances` },
  { check: u => u.getTraits().includes(setup.trait.per_loner), text: (u, rep, their) => `${rep} forgot ${their} manners` },
  { check: u => u.getTraits().includes(setup.trait.per_lunatic), text: (u, rep) => `${rep} indulged in a lunacy` },
  { check: u => u.getTraits().includes(setup.trait.per_chaste), text: (u, rep, their) => `${rep} kept averting ${their} gaze` },
  { check: u => u.isHasTrait(setup.trait.per_lustful), text: (u, rep) => `${rep} gestured lustfully and inappropriately` },
  { check: u => u.getTraits().includes(setup.trait.per_frugal), text: (u, rep) => `${rep} selfishly cut mid-sentence` },
  { check: u => u.getTraits().includes(setup.trait.per_lavish), text: (u, rep) => `${rep} wasted food` },
  { check: u => u.getTraits().includes(setup.trait.per_proud), text: (u, rep, their) => `${rep} arrogantly delivered ${their} demands` },
  { check: u => u.getTraits().includes(setup.trait.per_humble), text: (u, rep) => `${rep} refused to join in the discussion` },
  { check: u => u.getTraits().includes(setup.trait.per_brave), text: (u, rep) => `${rep} went overboard` },
  { check: u => u.getTraits().includes(setup.trait.per_cautious), text: (u, rep) => `${rep} was not creative enough` },
  { check: u => u.getTraits().includes(setup.trait.per_kind), text: (u, rep) => `${rep} showed too much empathy` },
  { check: u => u.isHasTrait(setup.trait.per_cruel), text: (u, rep) => `${rep} suggested something extremely cruel` },
  { check: u => u.getTraits().includes(setup.trait.per_direct), text: (u, rep, their) => `${rep} forgot ${their} manners` },
  { check: u => u.getTraits().includes(setup.trait.per_sly), text: (u, rep) => `${rep} lied` },
  { check: u => u.getTraits().includes(setup.trait.per_dominant), text: (u, rep, their) => `${rep} overstepped ${their} boundaries` },
  { check: u => u.getTraits().includes(setup.trait.per_logical), text: (u, rep) => `${rep} squealed in fear` },
  { check: u => u.getTraits().includes(setup.trait.per_loyal), text: (u, rep) => `${rep} showed excessive loyalty` },
  { check: u => u.getTraits().includes(setup.trait.per_independent), text: (u, rep) => `${rep} showed excessive disloyalty` },
  { check: u => u.getTraits().includes(setup.trait.per_empath), text: (u, rep) => `${rep} stated something subjective` },
  { check: u => u.getTraits().includes(setup.trait.per_honorable), text: (u, rep) => `${rep} suggested ending slavery` },
  { check: u => u.getTraits().includes(setup.trait.per_evil), text: (u, rep) => `${rep} schemed something evil` },
  { check: u => u.getTraits().includes(setup.trait.per_attentive), text: (u, rep) => `${rep} commented unnecessarily` },
  { check: u => u.getTraits().includes(setup.trait.per_dreamy), text: (u, rep) => `${rep} did not pay attention` },
  { check: u => u.getTraits().includes(setup.trait.per_slow), text: (u, rep) => `${rep} unable to follow the discussions` },
  { check: u => u.getTraits().includes(setup.trait.per_serious), text: (u, rep) => `${rep} responded unenthusiastically` },
  { check: u => u.getTraits().includes(setup.trait.per_playful), text: (u, rep) => `${rep} kept sidetracking the dicussions` },
  { check: u => u.getTraits().includes(setup.trait.per_stubborn), text: (u, rep, their) => `${rep} refused to change ${their} opinion` },
  { check: u => u.getTraits().includes(setup.trait.per_studious), text: (u, rep) => `${rep} refused to act` },
  { check: u => u.getTraits().includes(setup.trait.per_active), text: (u, rep) => `${rep} refused to study` },
];

/**
 * Generates a list of narrative reasons for punishing a slaver character.
 * Evaluates all rules and returns matching reason strings.
 *
 * @param {Unit} unit - The slaver character to evaluate.
 * @returns {string[]} Array of punishment reason strings.
 */
export function getPunishReasonSlaver(unit: Unit): string[] {
  return evaluateRules(
    unit,
    slaverRules,
    [
      `${unit.rep()} said something wrong`,
      `${unit.rep()} sneezed inappropriately`,
    ],
  );
}