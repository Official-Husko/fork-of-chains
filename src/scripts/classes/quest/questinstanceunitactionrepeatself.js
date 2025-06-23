import { QuestInstanceAllowedInjured } from "./questinstanceunitaction"
import { doFinalize } from "../../util/questassign"

/**
 * Special quest instance that will repeatedly purify a unit until it is fully cleansed.
 */
setup.QuestInstanceUnitActionRepeatSelf = class QuestInstanceUnitActionRepeatSelf extends QuestInstanceAllowedInjured {
  /**
   * @param {setup.QuestTemplate} quest_template 
   * @param {setup.Unit} trainee_unit 
   */
  constructor(quest_template, trainee_unit, unit_action) {
    super(quest_template, {trainee: trainee_unit})

    this.trainee_unit_key = trainee_unit.key
    this.unit_action_key = unit_action.key
  }

  getDescriptionPassage() {
    return `QuestInstanceUnitActionRepeatSelfPassage`
  }

  /**
   * @returns {setup.Unit}
   */
  getTraineeUnit() {
    return State.variables.unit[this.trainee_unit_key]
  }

  /**
   * @returns {setup.UnitAction}
   */
  getUnitAction() { 
    return setup.unitaction[this.unit_action_key]
  }

  finalize() {
    super.finalize()

    const unit_action = this.getUnitAction()
    const trainee = this.getTraineeUnit()
    if (unit_action.isCanTrain(trainee)) {
      // can re-train, so do it with the exact same actors.

      const quest = unit_action.generateQuest(trainee, null, /* no auto assign =*/ true)

      // Assign the same team, if possible.
      if (State.variables.company.player.isCanDeployTeam() &&
          quest.isCostsSatisfied()) {
        const assignment = {}
        for (const actor_name in this.getTemplate().getUnitCriterias()) {
          assignment[actor_name] = this.getActorUnit(actor_name).key
        }

        // assign the team
        doFinalize(quest, assignment)
      } else {
        setup.notify(`Unable to assign team automatically for a|reps quest.`, {a: trainee})
      }
    } else {
      setup.notify(`No more actions for a|rep.`, {a: trainee})
    }
  }
}
