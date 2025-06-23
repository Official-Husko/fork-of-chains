import { doFinalize } from "../../../util/questassign"

/**
 * Creates a quest, then force assign the same team to that quest.
 * 
 * Both quests must have the same number of units
 */
setup.qcImpl.QuestDirectForceAssign = class QuestDirectForceAssign extends setup.Cost {
  /**
   * @param {setup.QuestTemplate | string} template
   * 
   * Map {new_actor: old_actor}
   * @param {Object<string, string>} forced_assignment
   */
  constructor(template, forced_assignment) {
    super()

    // directly generate quest based on the given template
    if (!template) throw new Error(`Missing template for QuestDirectForceAssign`)
    if (!Object.values(forced_assignment).length) throw new Error(`Empty forced assignment`)

    this.template_key = setup.keyOrSelf(template)
    this.forced_assignment = forced_assignment
  }

  text() {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentTextHelper(this.forced_assignment)
    return `setup.qc.QuestDirectForceAssign('${this.template_key}', ${assignment_text})`
  }

  /**
   * @param {setup.QuestInstance} quest 
   */
  apply(quest) {
    let template = setup.questtemplate[this.template_key]
    if (!template) throw new Error(`Quest ${this.template_key} is missing`)

    let newquest = setup.QuestPool.instantiateQuest(template)

    if (!newquest) {
      console.log(`Something wrong when trying to generate quest ${template.key}`)
      setup.notify(`Something wrong when trying to generate quest ${template.getName()}. Please save your game and report this bug, while attaching the save file.`)
    } else {
      setup.notify(`New quest: ${newquest.rep()}`)

      // Now force team.
      const assignment = setup.qcImpl.QuestDirectForceAssign.getActorUnitKey(
        this.forced_assignment, quest
      )

      doFinalize(newquest, assignment)
      newquest.setTeamForcedAssigned()
    }
  }

  explain(quest) {
    const assignment_text = setup.qcImpl.QuestDirect.assignmentExplainHelper(this.forced_assignment)
    let template = setup.questtemplate[this.template_key]
    if (!template) throw new Error(`Quest ${this.template_key} is missing`)
    return `New quest: ${template.getName()} forced with team: ${assignment_text}`
  }

  /**
   * @param {object} forced_assignment
   * @param {object} quest 
   */
  static getActorUnitKey(forced_assignment, quest) {
    const assignment = {}
    for (const actor_name in forced_assignment) {
      const target_actor_name = forced_assignment[actor_name]
      assignment[actor_name] = quest.getActorUnit(target_actor_name).key
    }
    return assignment
  }

  /**
   * 
   * @param {setup.QuestTemplate} new_quest 
   * @param {*} forced_assignment 
   */
  static sanityCheckDevTool(new_quest, forced_assignment) {
    /**
     * @type {setup.QuestTemplate} 
     */ // @ts-ignore
    const quest = State.variables.dtquest
    const chosen = {}
    const oldroles = quest.getUnitCriterias()
    for (const actor_name in new_quest.getUnitCriterias()) {
      if (!(actor_name in forced_assignment)) {
        return `Missing role ${actor_name} in new quest!`
      }
      const becomes = forced_assignment[actor_name]
      if (!(becomes in oldroles)) {
        return `Actor ${becomes} is not a team-member!`
      }
      if (becomes in chosen) {
        return `Actor ${becomes} duplicated!`
      }
      chosen[becomes] = true
    }
    return ''
  }
}
