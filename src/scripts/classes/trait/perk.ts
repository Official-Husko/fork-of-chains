// @ts-nocheck

import "./trait";

setup.Perk = class Perk extends setup.Trait {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {string} description 
   * @param {number} slave_value 
   * @param {Record<string, number>} skill_bonuses 
   * @param {string[]} tags 
   * @param {{ tier?: number, icon?: string, colors?: boolean, background?: string }} icon_settings 
   * @param {{
   * perk_choice_restrictions: setup.Restriction[],
   * perk_end_of_week_effect: setup.Cost[],
   * perk_null_traits?: setup.Trait[],
   * perk_extra_traits?: setup.Trait[],
   * }} args
   */
  constructor(key, name, description, slave_value, skill_bonuses, tags, icon_settings,
    {
      perk_choice_restrictions,
      perk_end_of_week_effect,
      perk_null_traits,
      perk_extra_traits,
    }) {

    super(key, name, description, slave_value, skill_bonuses, tags, icon_settings)

    this.perk_choice_restrictions = perk_choice_restrictions
    this.perk_end_of_week_effect = perk_end_of_week_effect
    this.perk_null_trait_keys = (perk_null_traits || []).map(perk => perk.key)
    this.perk_extra_trait_keys = (perk_extra_traits || []).map(perk => perk.key)
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getPerkChoiceRestrictions() { return this.perk_choice_restrictions }

  /**
   * @returns {setup.Cost[]}
   */
  getEndOfWeekEffect() { return this.perk_end_of_week_effect }

  /**
   * Return list of traits whose disaster effects are nullified by this perk.
   * @returns {setup.Trait[]}
   */
  getPerkNullTraits() {
    return this.perk_null_trait_keys.map(key => setup.trait[key])
  }

  /**
   * Return list of extra traits from perk
   * @returns {setup.Trait[]}
   */
  getPerkExtraTraits() {
    return this.perk_extra_trait_keys.map(key => setup.trait[key])
  }

  isPerkAvailableInChoiceFor(unit) {
    return setup.RestrictionLib.isUnitSatisfy(unit, this.getPerkChoiceRestrictions())
  }

  /**
   * Special trait has their own limits.
   * @returns {boolean}
   */
  isSpecial() {
    return this.getTags().includes('perkspecial')
  }

  /**
   * Called at end of each week from the unit.
   * 
   * @param {setup.Unit} unit 
   */
  advanceWeek(unit) {
    super.advanceWeek(unit)
    if (unit.isSlaver()) {
      setup.RestrictionLib.applyAll(this.getEndOfWeekEffect(), setup.costUnitHelper(unit, this.getName()))
    }
  }
}
