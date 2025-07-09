// All money-related constants for the Twine SugarCube project.
// This module attaches values to the global `setup` object.

export function registerMoneyConstants(setup: any) {
  // how much money each slaver makes per week on average
  setup.MONEY_PER_SLAVER_WEEK = 500;

  // how much money each slave makes per week on average on a quest
  setup.MONEY_PER_SLAVE_WEEK = 250;

  // how much variance can the money reward change? E.g., 0.02 means up to 2%
  setup.MONEY_NUDGE = 0.1;

  // at slavers level one, how much fraction of money they would get compared to lv40?
  setup.MONEY_LEVEL_ONE_MULTI = 0.5;

  // how money multiplied by when its a crit result?
  setup.MONEY_CRIT_MULTIPLIER = 2;

  // multiplier for sold items
  setup.MONEY_SELL_MULTIPLIER = 0.5;

  // building prices mults
  setup.BUILDING_CHEAP_MULT = 6;
  setup.BUILDING_MEDIUMLOW_MULT = 10;
  setup.BUILDING_MEDIUM_MULT = 20;
  setup.BUILDING_HIGH_MULT = 40;
  setup.BUILDING_VERYHIGH_MULT = 100;
  setup.BUILDING_ASTRO_MULT = 200;
}
