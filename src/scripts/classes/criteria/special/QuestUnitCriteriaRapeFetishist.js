import { IMPORTABLE } from "../criteria"

setup.QuestUnitCriteriaRapeFetishist = class QuestUnitCriteriaRapeFetishist extends setup.UnitCriteria {
  constructor() {
    super('quest_unit_criteria_rape_fetishist', 'Rape Victim', [], [], [
      setup.qres.Job(setup.job.slave),
      setup.qres.AnyTrait([setup.trait.training_none, setup.trait.training_roleplay_advanced]),
    ], {})
  }

  /**
   * @returns {number}
   */
  static getRng() {
    const varname = 'quest_unit_criteria_rape_fetishist_rng'
    if (State.variables.varstore.get(varname) == null) {
      State.variables.varstore.set(varname, Math.floor(Math.random() * 1000000000), -1)
    }
    const base = State.variables.varstore.get('quest_unit_criteria_rape_fetishist_rng')
    return parseInt(base)
  }

  /**
   * @returns {Array<setup.Trait>}
   */
  static getBgOptions() {
    return [
      setup.trait.bg_knight,
      setup.trait.bg_noble,
      setup.trait.bg_priest,
      setup.trait.bg_slaver,
    ]
  }

  /**
   * @returns {setup.Trait}
   */
  static getBgTrait() {
    const bgs = this.getBgOptions()
    const rng = this.getRng()
    return bgs[rng % bgs.length]
  }

  /**
   * @returns {Array<setup.Trait>}
   */
  static getSubraceOptions() {
    return setup.TraitHelper.getAllTraitsOfTags(['subrace']).filter(
      trait => [setup.rarity.common, setup.rarity.uncommon, setup.rarity.rare].includes(trait.getRarity())
    )
  }

  /**
   * @returns {setup.Trait}
   */
  static getSubraceTrait() {
    const bglength = this.getBgOptions().length
    const rng = Math.floor(this.getRng() / bglength)
    const subraces = this.getSubraceOptions()
    return subraces[rng % subraces.length]
  }

  /**
   * @returns {Array<setup.Trait>}
   */
  static getPerOptions() {
    return [
      setup.trait.per_dominant,
      setup.trait.per_submissive,
      setup.trait.per_chaste,
      setup.trait.per_sexaddict,
    ]
  }

  /**
   * @returns {setup.Trait}
   */
  static getPerTrait() {
    const bglength = this.getBgOptions().length
    const subracelength = this.getSubraceOptions().length
    const rng = Math.floor(this.getRng() / (bglength * subracelength))
    const per = this.getPerOptions()
    return per[rng % per.length]
  }

  /**
   * @returns Array.<setup.Trait>
   */
  getCritTraits() {
    return [
      setup.QuestUnitCriteriaRapeFetishist.getBgTrait(),
      setup.QuestUnitCriteriaRapeFetishist.getSubraceTrait(),
      setup.QuestUnitCriteriaRapeFetishist.getPerTrait(),
    ]
  }
}
