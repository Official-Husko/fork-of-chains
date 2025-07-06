// @ts-nocheck

// repeatedly purifies the unit.
setup.UnitActionRepeatSelf = class UnitActionRepeatSelf extends setup.UnitAction {

  /**
   * @param {UnitActionParam} args
   */
  constructor(args) {
    super(args)
  }

  getName() {
    return `${super.getName()} (Repeated)`
  }

  getDescriptionPassage() { return `QuestInstanceUnitActionRepeatSelfPassage` }

  /**
   * Generate quest. If target_traits is given, will generate chained quests.
   * @param {setup.Unit} unit 
   * @param {setup.Trait[]} [target_traits]   // not used
   * @param {boolean} [no_auto_assign]
   * @returns {setup.QuestInstance}
   */
  generateQuest(unit, target_traits, no_auto_assign) {
    // finally instantiate the quest
    const newquest = new setup.QuestInstanceUnitActionRepeatSelf(
      this.getTemplate(),
      unit,
      this)

    State.variables.company.player.addQuest(newquest)
    setup.notify(`New quest: ${newquest.rep()}`)

    if (!no_auto_assign && State.variables.settings.unitactionautoassign) {
      setup.QuestAssignHelper.tryAutoAssign(newquest)
    }

    return newquest
  }
}
