import { getActionScorePenetration } from "./util"

/**
 * Aim to reach orgasms. Abstract class
 */
class OrgasmBase extends setup.SexPlan {
  constructor(...args) {
    // @ts-ignore
    super(...args)
    this.orgasm_count_initial = this.sex.getOrgasms(this.unit)
    this.is_last_penetration = false
    this.failed = false
  }

  /**
   * @param {setup.SexAction} action 
   * @returns {number}
   */
  computeScore(action) {
    return 0
  }

  // select an action out of the given choice, if any compatible plan is found.
  /**
   * @param {setup.SexAction[]} actions 
   * @returns {setup.SexAction | null}
   */
  selectAction(actions) {
    // rank actions based on their arousal increases
    const candidates = []
    for (const action of actions) {
      let gain = 0
      if (action.getTags().includes('penetrationstartdom') ||
          action.getTags().includes('penetrationstartsub') ||
          action.getTags().includes('equipmentself') ||
          action.getTags().includes('equipmentother')) {
        gain = getActionScorePenetration(this.unit, action, this.sex)

        // prevent consecutive penetrations
        if (action.getTags().includes('penetrationstartdom') ||
            action.getTags().includes('penetrationstartsub')) {
          if (this.is_last_penetration) {
            gain = 0
          }
        }

      } else if (action.getTags().includes('penetrationenddom')) {
        // never
      } else if (action.getTags().includes('penetrationendsub')) {
        // pure doms can sometimes do this
        gain = setup.Sex.AI_END_PENETRATION_SUB_WEIGHT

      } else {
        gain = this.computeScore(action)

      }
      if (gain > 0) {
        candidates.push([action, gain])
      }
    }

    this.is_last_penetration = false

    if (!candidates.length) {
      this.failed = true
      return null
    }

    let chosen = setup.rng.sampleArray(candidates, /* normalize = */ true)

    if (chosen.getTags().includes('penetrationstartdom') || chosen.getTags().includes('penetrationstartsub')) {
      this.is_last_penetration = true
    }

    return chosen
  }

  /**
   * Whether the plan has been completed or aborted, and a new plan should be taken
   * @returns {boolean}
   */
  isComplete() {
    if (this.failed) return true
    return this.sex.getOrgasms(this.unit) > this.orgasm_count_initial
  }
}


/**
 * Aim to reach orgasm on self only.
 */
setup.SexPlanClass.OrgasmSelf = class OrgasmSelf extends OrgasmBase {
  /**
   * @param {setup.SexAction} action 
   * @returns {number}
   */
  computeScore(action) {
    return action.getArousal(this.unit, this.sex)
  }
}


/**
 * Aim to reach orgasm on both.
 */
setup.SexPlanClass.OrgasmAll = class OrgasmAll extends OrgasmBase {
  /**
   * @param {setup.SexAction} action 
   * @returns {number}
   */
  computeScore(action) {
    let sumarousal = 0
    for (const unit of action.getUnits()) {
      sumarousal += action.getArousal(unit, this.sex)
    }
    return sumarousal
  }
}


/**
 * Aim to reach orgasm on others.
 */
setup.SexPlanClass.OrgasmThem = class OrgasmThem extends OrgasmBase {
  /**
   * @param {setup.SexAction} action 
   * @returns {number}
   */
  computeScore(action) {
    let sumarousal = 0
    for (const unit of action.getUnits()) {
      if (unit == this.unit) continue
      sumarousal += action.getArousal(unit, this.sex)
    }
    return sumarousal
  }
}
