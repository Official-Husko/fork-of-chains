/**
 * Punishment sentence module exports.
 *
 * - rules: Defines the PunishRule type and the evaluateRules function,
 *          which applies a set of rules to a unit and returns all matching punishment reasons.
 * - slave: Contains the list of rules and logic for generating punishment reasons for slave units,
 *          using traits and behaviors.
 * - slaver: Contains the list of rules and logic for generating punishment reasons for slaver units,
 *          using traits and behaviors.
 * - punishreason: Provides the main function to select a random punishment reason for a unit,
 *          delegating to slave or slaver logic as appropriate.
 */

export * from "./punishreason";
export * from "./rules";
export * from "./slave";
export * from "./slaver";
export * from "./textpunish";
