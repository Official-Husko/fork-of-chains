
// make one of your units missing, e.g., by being moved into the missingslavers unit group

import { ContentTemplate } from "../../../content/ContentTemplate"

// and removed from your company.
setup.qcImpl.MissingUnit = class MissingUnit extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.MissingUnit('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)

    if (setup.qcImpl.MissingUnit.checkBlessingOfLife({ unit: unit, stacks: 2 })) return
    if (setup.qcImpl.MissingUnit.checkMissingPlayer(unit, quest)) return

    let job = unit.getJob()
    unit.addHistory('went missing.', quest)
    State.variables.company.player.removeUnit(unit)
    if (job == setup.job.slave) {
      setup.unitgroup.missingslaves.addUnit(unit)
    } else if (job == setup.job.slaver) {
      setup.unitgroup.missingslavers.addUnit(unit)
    }
  }

  explain(quest) {
    return `${this.actor_name} would be gone from your company...`
  }

  /**
   * @param {setup.Unit} unit 
   * @param {*} quest 
   * @returns {boolean}
   */
  static checkMissingPlayer(unit, quest) {
    if (unit != State.variables.unit.player) return false

    // player disappears hahaha haha...
    State.variables.unit.player.addHistory('went missing from the company.', quest)

    setup.qc.CapturePlayer().apply(setup.costUnitHelper(unit))
    return true
  }

  /**
   * @param {{unit: setup.Unit, stacks: number}} args
   * 
   * @returns {boolean}
   */
  static checkBlessingOfLife({ unit, stacks }) {
    const trait_key = `blessing_life${stacks}`

    if (trait_key in setup.trait && unit.isYourCompany() && unit.isSlaver()) {
      const trait = setup.trait[trait_key]
      if (unit.isHasTrait(trait)) {
        // save the unit
        setup.notify(`a|Reps Blessing of Life saved the slaver's life`, { a: unit })
        for (let i = 0; i < stacks; ++i) {
          unit.decreaseTrait(trait.getTraitGroup())
        }

        return true
      }
    }

    return false
  }
}


