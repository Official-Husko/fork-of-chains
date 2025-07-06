// @ts-nocheck

import { OngoingBase } from "./AAA_OngoingStart"

// abstract
setup.SexAction.OngoingEndOther = class OngoingEndOther extends OngoingBase {
  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        paces: [setup.sexpace.dom, ], 
      },
      {
        energy: setup.Sex.ENERGY_TINY,
        paces: setup.SexPace.getAllPaces(),
      }
    ]
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return [
      setup.qres.SexIsOngoing('b', this.getPenetratorBodypart(), 'a', this.getPenetrationTarget()),
    ]
  }

  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexOngoingEnd('b', this.getPenetratorBodypart())
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    const me = this.getActorUnit('a')
    const my_bp = this.getPenetrationTarget()
    const them = this.getActorUnit('b')
    const their_bp = this.getPenetratorBodypart()

    return `Withdraw a|their ${my_bp.rep(me, sex)} from b|their ${their_bp.rep(them, sex)}`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return this.rawTitle(sex)
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const me = this.getActorUnit('a')
    const my_bp = this.getPenetratorBodypart()
    const them = this.getActorUnit('b')
    const their_bp = this.getPenetrationTarget()
    return my_bp.describeEnd(them, me, their_bp, sex)
  }
}

