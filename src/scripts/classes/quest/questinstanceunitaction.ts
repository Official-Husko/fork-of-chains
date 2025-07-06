// @ts-nocheck

export class QuestInstanceAllowedInjured extends setup.QuestInstance {
  /**
   * @returns {boolean}
   */
  hasInjuredUnit() {
    for (const [actor_name, unit] of this.getActorsList()) {
      if (unit && State.variables.hospital.isInjured(unit)) {
        return true
      }
    }
    return false
  }

  advanceQuestOneWeek() {
    // Check for injuries. If anyone is injured, suspend it.
    if (this.getTeam()) {
      if (!this.hasInjuredUnit()) {
        this.elapsed_week += 1
      }
    } else {
      super.advanceQuestOneWeek()
    }
  }
}


/**
 * Special quest instance that will choose a multitrain unit action to perform,
 * based on the target traits.
 */
setup.QuestInstanceUnitAction = class QuestInstanceUnitAction extends QuestInstanceAllowedInjured {
  /**
   * @param {setup.QuestTemplate} quest_template 
   * @param {setup.Unit} trainee_unit 
   * @param {setup.Trait[]} target_traits 
   */
  constructor(quest_template, trainee_unit, target_traits) {
    super(quest_template, {trainee: trainee_unit})

    this.trainee_unit_key = trainee_unit.key
    this.target_trait_keys = target_traits.map(trait => trait.key)
  }

  getDescriptionPassage() {
    return `QuestInstanceUnitActionDescriptionPassage`
  }

  /**
   * @returns {setup.Trait[]}
   */
  getTargetTraits() {
    return this.target_trait_keys.map(key => setup.trait[key])
  }

  /**
   * @returns {setup.Unit}
   */
  getTraineeUnit() {
    return State.variables.unit[this.trainee_unit_key]
  }

  finalize() {
    super.finalize()

    // find next quest to generate.
    const unit = this.getTraineeUnit()
    const target_traits = this.getTargetTraits()
    const forced_units = Object.keys(this.getTemplate().getUnitCriterias()).map(
      actor_name => this.getActorUnit(actor_name))
    setup.UnitActionHelper.generateQuest(unit, target_traits, forced_units)
  }
}
